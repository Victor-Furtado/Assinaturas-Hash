import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AdminDocumentsController } from './admin-documents.controller';
import { PublicDocumentsController } from './public-documents.controller';

@Module({
  providers: [DocumentsService],
  controllers: [AdminDocumentsController, PublicDocumentsController],
})
export class DocumentsModule {}
