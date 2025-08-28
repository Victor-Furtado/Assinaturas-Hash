import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { AuthGuard } from '@nestjs/passport';

function filenameFactory(req, file, cb) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(String(file.originalname)));
}

@Controller('admin/documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminDocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: filenameFactory,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const doc = await this.docs.saveUploadedFile(file, name, userId);
    return { id: doc.id, name: doc.name };
  }

  @Get('signed')
  async listSigned() {
    return this.docs.listSigned();
  }
}
