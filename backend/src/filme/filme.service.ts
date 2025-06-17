// src/filme/filme.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

@Injectable()
export class FilmeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFilmeDto: CreateFilmeDto) {
    try {
      // O campo 'titulo' é @unique no seu schema. Prisma cuidará da validação de unicidade.
      const filme = await this.prisma.filme.create({
        data: createFilmeDto,
      });
      return filme;
    } catch (error) {
      // Tratamento de erro específico para violação de unique constraint no título
      if (error.code === 'P2002' && error.meta?.target?.includes('titulo')) {
        throw new ConflictException('Já existe um filme com este título.');
      }
      throw error; // Relança outros erros
    }
  }

  async findAll() {
    return this.prisma.filme.findMany();
  }

  async findOne(id: number) {
    const filme = await this.prisma.filme.findUnique({
      where: { id },
      // Opcional: Se você quiser incluir sessões relacionadas aqui, use 'include'
      // include: { sessoes: true },
    });
    if (!filme) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado.`);
    }
    return filme;
  }

  async update(id: number, updateFilmeDto: UpdateFilmeDto) {
    // Primeiro, verifica se o filme existe
    const filmeExistente = await this.prisma.filme.findUnique({ where: { id } });
    if (!filmeExistente) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado para atualização.`);
    }

    try {
      return this.prisma.filme.update({
        where: { id },
        data: updateFilmeDto,
      });
    } catch (error) {
      // Tratamento de erro para violação de unique constraint (se o título for atualizado para um existente)
      if (error.code === 'P2002' && error.meta?.target?.includes('titulo')) {
        throw new ConflictException('Já existe outro filme com este título.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Primeiro, verifica se o filme existe
    const filme = await this.prisma.filme.findUnique({ where: { id } });
    if (!filme) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado para exclusão.`);
    }
    // Opcional: Adicione lógica aqui para verificar se há sessões relacionadas
    // antes de permitir a exclusão, se for uma regra de negócio importante.
    // Ex: Se um filme tiver sessões, não permitir a exclusão direta.
    // const sessoesDoFilme = await this.prisma.sessao.count({ where: { filmeId: id } });
    // if (sessoesDoFilme > 0) {
    //   throw new BadRequestException('Não é possível excluir um filme que possui sessões cadastradas.');
    // }

    return this.prisma.filme.delete({
      where: { id },
    });
  }
}