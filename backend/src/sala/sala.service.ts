import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSalaDto: CreateSalaDto) {
    try {
      // O campo 'numero' é @unique no seu schema. Prisma cuidará da validação de unicidade.
      const sala = await this.prisma.sala.create({
        data: createSalaDto,
      });
      return sala;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('numero')) {
        throw new ConflictException('Já existe uma sala com este número.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.sala.findMany();
  }

  async findOne(id: number) {
    const sala = await this.prisma.sala.findUnique({
      where: { id },
    });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada.`);
    }
    return sala;
  }

  async update(id: number, updateSalaDto: UpdateSalaDto) {
    const salaExistente = await this.prisma.sala.findUnique({ where: { id } });
    if (!salaExistente) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada para atualização.`);
    }

    try {
      return this.prisma.sala.update({
        where: { id },
        data: updateSalaDto,
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('numero')) {
        throw new ConflictException('Já existe outra sala com este número.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const sala = await this.prisma.sala.findUnique({ where: { id } });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada para exclusão.`);
    }
    // Opcional: Adicione lógica para verificar sessões relacionadas antes de excluir uma sala
    // const sessoesNaSala = await this.prisma.sessao.count({ where: { salaId: id } });
    // if (sessoesNaSala > 0) {
    //   throw new BadRequestException('Não é possível excluir uma sala que possui sessões cadastradas.');
    // }
    return this.prisma.sala.delete({
      where: { id },
    });
  }
}