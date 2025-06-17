import {IsInt, IsNotEmpty, IsNumber, Min, IsDateString} from 'class-validator';

export class CreateSessaoDto {
  @IsInt({ message: 'O ID do filme deve ser um número inteiro.' })
  @Min(1, { message: 'O ID do filme deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'O ID do filme é obrigatório.' })
  filmeId: number;

  @IsInt({ message: 'O ID da sala deve ser um número inteiro.' })
  @Min(1, { message: 'O ID da sala deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'O ID da sala é obrigatório.' })
  salaId: number;

  @IsDateString({}, { message: 'O horário de início deve ser uma data/hora válida no formato ISO 8601 (ex: 2025-06-12T14:30:00Z).' })
  @IsNotEmpty({ message: 'O horário de início é obrigatório.' })
  horarioInicio: string;

  @IsNumber({}, { message: 'O preço do ingresso deve ser um número.' })
  @Min(0, { message: 'O preço do ingresso não pode ser negativo.' })
  @IsNotEmpty({ message: 'O preço do ingresso é obrigatório.' })
  precoIngresso: number;
}