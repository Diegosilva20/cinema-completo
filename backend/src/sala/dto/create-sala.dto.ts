import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from "class-validator"


export class CreateSalaDto {
  @IsInt({ message: 'O número da sala deve ser um número inteiro.' })
  @Min(1, { message: 'O número da sala deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'O número da sala é obrigatório.' })
  numero: number;

  @IsInt({ message: 'A capacidade da sala deve ser um número inteiro.' })
  @Min(1, { message: 'A capacidade da sala deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'A capacidade da sala é obrigatória.' })
  capacidade: number;

  @IsString({ message: 'O tipo da sala deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo da sala é obrigatório.' })
  tipo: string;
}