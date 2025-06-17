import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: 'http://localhost:5173', // O URL do seu frontend React/Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuração global do ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <-- MUITO IMPORTANTE: Habilita a transformação de payloads para instâncias do DTO
                      // Permite que o @Type(() => Date) funcione, por exemplo.
                      // Também converte IDs de string para number automaticamente se a propriedade for tipada como number no DTO.
    whitelist: true, // <-- Remove propriedades do payload que NÃO estão definidas no DTO
                      // Ajuda a evitar que dados indesejados sejam passados
    forbidNonWhitelisted: true, // <-- Lança um erro se houver propriedades não whitelistadas
                                 // Garante que o cliente envie apenas o que é esperado
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}
bootstrap();
