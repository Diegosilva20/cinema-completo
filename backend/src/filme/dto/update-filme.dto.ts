import { PartialType } from '@nestjs/mapped-types';
import { CreateFilmeDto } from './create-filme.dto';
import { IsNotEmpty, IsString, isInt, IsOptional, IsInt, Min } from "class-validator"

export class UpdateFilmeDto extends PartialType(CreateFilmeDto) {
      @IsNotEmpty({ message: 'O título não pode ser vazio.' })
      @IsString({ message: 'O título deve ser uma string.' })
      titulo: string;
    
      @IsNotEmpty({ message: 'O diretor não pode ser vazio.' })
      @IsString({ message: 'O diretor deve ser uma string.' })
      diretor: string;
    
      @IsNotEmpty({ message: 'O gênero não pode ser vazio.' })
      @IsString({ message: 'O gênero deve ser uma string.' })
      genero: string;
    
      @IsNotEmpty({ message: 'A duração não pode ser vazia.' })
      @IsInt({ message: 'A duração deve ser um número inteiro.' })
      @Min(1, { message: 'A duração deve ser maior que 0.' })
      duracao: number;
    
      @IsNotEmpty({ message: 'A sinopse não pode ser vazia.' })
      @IsString({ message: 'A sinopse deve ser uma string.' })
      sinopse: string;
    
      @IsOptional()
      @IsString({ message: 'A URL do cartaz deve ser uma string.' })
      urlCartaz?: string;
}
