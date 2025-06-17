// src/sessao/sessao.service.ts

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessaoDto: CreateSessaoDto) {
    // 1. Verificar se o filme e a sala existem
    const filme = await this.prisma.filme.findUnique({
      where: { id: createSessaoDto.filmeId },
    });
    if (!filme) {
      throw new NotFoundException(`Filme com ID ${createSessaoDto.filmeId} não encontrado.`);
    }

    const sala = await this.prisma.sala.findUnique({
      where: { id: createSessaoDto.salaId },
    });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${createSessaoDto.salaId} não encontrada.`);
    }

    // `horarioInicio` no DTO é string (validado por @IsDateString).
    // Converte para Date para o Prisma.
    const horarioInicioDate = new Date(createSessaoDto.horarioInicio);

    try {
      const sessao = await this.prisma.sessao.create({
        data: {
          filmeId: createSessaoDto.filmeId,
          salaId: createSessaoDto.salaId,
          horarioInicio: horarioInicioDate,
          precoIngresso: createSessaoDto.precoIngresso,
        },
      });
      return sessao;
    } catch (error) {
      // Tratamento de erro para a constraint @@unique([filmeId, salaId, horarioInicio])
      if (error.code === 'P2002' && error.meta?.target) {
        if (Array.isArray(error.meta.target) &&
            error.meta.target.includes('filmeId') &&
            error.meta.target.includes('salaId') &&
            error.meta.target.includes('horarioInicio')) {
          throw new ConflictException('Já existe uma sessão para este filme, nesta sala e neste horário.');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.sessao.findMany({
      include: { filme: true, sala: true }, // Inclui os dados do filme e da sala relacionados
    });
  }

  async findOne(id: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: { filme: true, sala: true },
    });
    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada.`);
    }
    return sessao;
  }

  async update(id: number, updateSessaoDto: UpdateSessaoDto) {
    const sessaoExistente = await this.prisma.sessao.findUnique({ where: { id } });
    if (!sessaoExistente) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada para atualização.`);
    }

    // Se um novo filmeId ou salaId for fornecido, verificar sua existência
    if (updateSessaoDto.filmeId) {
      const filme = await this.prisma.filme.findUnique({ where: { id: updateSessaoDto.filmeId } });
      if (!filme) throw new NotFoundException(`Filme com ID ${updateSessaoDto.filmeId} não encontrado.`);
    }
    if (updateSessaoDto.salaId) {
      const sala = await this.prisma.sala.findUnique({ where: { id: updateSessaoDto.salaId } });
      if (!sala) throw new NotFoundException(`Sala com ID ${updateSessaoDto.salaId} não encontrada.`);
    }

    // Converte 'horarioInicio' para Date se ele for fornecido no DTO de atualização
    let horarioInicioUpdated: Date | undefined;
    if (updateSessaoDto.horarioInicio) {
        horarioInicioUpdated = new Date(updateSessaoDto.horarioInicio);
    }

    try {
      return this.prisma.sessao.update({
        where: { id },
        data: {
          ...updateSessaoDto,
          horarioInicio: horarioInicioUpdated, // Pode ser undefined se não foi atualizado
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target) {
        if (Array.isArray(error.meta.target) &&
            error.meta.target.includes('filmeId') &&
            error.meta.target.includes('salaId') &&
            error.meta.target.includes('horarioInicio')) {
          throw new ConflictException('Não é possível criar uma sessão duplicada com este filme, sala e horário.');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    const sessao = await this.prisma.sessao.findUnique({ where: { id } });
    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada para exclusão.`);
    }
    // Opcional: Verificar se há vendas associadas a esta sessão
    // const vendasDaSessao = await this.prisma.venda.count({ where: { sessaoId: id } });
    // if (vendasDaSessao > 0) {
    //   throw new BadRequestException('Não é possível excluir uma sessão que possui vendas registradas.');
    // }
    return this.prisma.sessao.delete({
      where: { id },
    });
  }
}