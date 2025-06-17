// src/sessao/sessao.module.ts

import { Module } from '@nestjs/common';
import { SessaoService } from './sessao.service';
import { SessaoController } from './sessao.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SessaoController],
  providers: [SessaoService],
  exports: [SessaoService],
})
export class SessaoModule {}