import { IsString } from 'class-validator';

export class SignDocumentDto {
  @IsString()
  cpf: string;
}
