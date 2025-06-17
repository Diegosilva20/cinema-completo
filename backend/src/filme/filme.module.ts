import { Module } from '@nestjs/common';
import { FilmeService } from './filme.service';
import { FilmeController } from './filme.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importe PrismaModule

@Module({
  imports: [PrismaModule], // Importe o PrismaModule para que FilmeService possa usar PrismaService
  controllers: [FilmeController],
  providers: [FilmeService],
  exports: [FilmeService], // Exporte se outros módulos precisarem usar FilmeService
})
export class FilmeModule {}