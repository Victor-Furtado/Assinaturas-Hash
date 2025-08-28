import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Res,
  StreamableFile,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { SignDocumentDto } from './dto/sign-document.dto';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('documents')
@UseGuards(AuthGuard('jwt')) // usuários logados (USER ou ADMIN) podem ver/assinar
export class PublicDocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get('available')
  async getAvailable() {
    const doc = await this.docs.getFirstAvailable();
    return doc ? { id: doc.id, name: doc.name } : null;
  }

  @Get(':id/file')
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const doc = await this.docs.getByIdOrThrow(id);
    try {
      const stream = this.docs.getFileStream(doc);
      res.set({
        'Content-Type': doc.mimeType,
        'Content-Disposition': `inline; filename="${doc.fileName}"`,
      });
      return new StreamableFile(stream);
    } catch {
      throw new NotFoundException('Arquivo não encontrado');
    }
  }

  @Post(':id/sign')
  async sign(@Param('id') id: string, @Body() body: SignDocumentDto) {
    const result = await this.docs.signDocument(id, body.cpf);
    return {
      documentId: result.document.id,
      signatureHash: result.signature.signatureHash,
      signedAt: result.signature.signedAt,
    };
  }
}
