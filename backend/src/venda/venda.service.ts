// src/venda/venda.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVendaDto: CreateVendaDto) {
    // 1. Buscar a sessão para obter o preço do ingresso e verificar sua existência
    const sessao = await this.prisma.sessao.findUnique({
      where: { id: createVendaDto.sessaoId },
      select: { precoIngresso: true, sala: { select: { capacidade: true } } }, // Inclui capacidade da sala
    });

    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${createVendaDto.sessaoId} não encontrada para esta venda.`);
    }

    // Opcional: Lógica para verificar a capacidade da sala / assentos disponíveis
    // Isso exigiria um mecanismo mais sofisticado de controle de assentos,
    // mas é um bom lugar para pensar nisso. Por enquanto, só um exemplo:
    // if (createVendaDto.quantidade > sessao.sala.capacidade) {
    //   throw new BadRequestException('Quantidade de ingressos excede a capacidade da sala.');
    // }

    // 2. Calcular o valor total da venda no backend
    const valorTotalCalculado = sessao.precoIngresso * createVendaDto.quantidade;

    // 3. Criar a venda no banco de dados
    const venda = await this.prisma.venda.create({
      data: {
        sessaoId: createVendaDto.sessaoId,
        quantidade: createVendaDto.quantidade,
        valorTotal: valorTotalCalculado, // Valor calculado
        // dataVenda, createdAt, updatedAt são automáticos pelo Prisma
      },
    });
    return venda;
  }

  async findAll() {
    return this.prisma.venda.findMany({
      include: { sessao: { include: { filme: true, sala: true } } }, // Inclui detalhes da sessão, filme e sala
    });
  }

  async findOne(id: number) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
      include: { sessao: { include: { filme: true, sala: true } } },
    });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }
    return venda;
  }

  async update(id: number, updateVendaDto: UpdateVendaDto) {
    const vendaExistente = await this.prisma.venda.findUnique({ where: { id } });
    if (!vendaExistente) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada para atualização.`);
    }

    let valorTotalAtualizado: number | undefined;

    // Se 'quantidade' foi atualizada, ou se 'sessaoId' foi atualizado e 'quantidade' está presente
    if (updateVendaDto.quantidade !== undefined || updateVendaDto.sessaoId !== undefined) {
        const targetSessaoId = updateVendaDto.sessaoId || vendaExistente.sessaoId;
        const targetQuantidade = updateVendaDto.quantidade !== undefined ? updateVendaDto.quantidade : vendaExistente.quantidade;

        const sessao = await this.prisma.sessao.findUnique({
            where: { id: targetSessaoId },
            select: { precoIngresso: true },
        });

        if (!sessao) {
            throw new NotFoundException(`Sessão com ID ${targetSessaoId} não encontrada para recalcular a venda.`);
        }
        valorTotalAtualizado = sessao.precoIngresso * targetQuantidade;
    }

    return this.prisma.venda.update({
      where: { id },
      data: {
        ...updateVendaDto,
        valorTotal: valorTotalAtualizado, // Sobrescreve se a quantidade/sessão foi atualizada
      },
    });
  }

  async remove(id: number) {
    const venda = await this.prisma.venda.findUnique({ where: { id } });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada para exclusão.`);
    }
    return this.prisma.venda.delete({
      where: { id },
    });
  }
}