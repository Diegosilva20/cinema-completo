import {IsInt, IsNotEmpty, Min} from 'class-validator';

export class CreateVendaDto {
  @IsInt({ message: 'O ID da sessão deve ser um número inteiro.' })
  @Min(1, { message: 'O ID da sessão deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'O ID da sessão é obrigatório.' })
  sessaoId: number;

  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser maior ou igual a 1.' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  quantidade: number;
}
