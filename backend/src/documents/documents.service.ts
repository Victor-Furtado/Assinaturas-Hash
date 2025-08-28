import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { sha256Hex } from '../common/hash.util';
import { isValidCpf, normalizeCpf } from '../common/cpf.util';

@Injectable()
export class DocumentsService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir))
      fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    name: string,
    uploadedById: string,
  ) {
    if (!file) throw new BadRequestException('Arquivo é obrigatório');
    if (file.mimetype !== 'application/pdf')
      throw new BadRequestException('Apenas PDF');
    const storagePath = path.join(this.uploadDir, file.filename);
    const content = fs.readFileSync(storagePath);
    const docHash = sha256Hex(content);

    const doc = await this.prisma.document.create({
      data: {
        name,
        fileName: file.originalname,
        storagePath,
        mimeType: file.mimetype,
        docHash,
        uploadedById,
      },
    });
    return doc;
  }

  async getFirstAvailable() {
    return this.prisma.document.findFirst({
      where: { available: true },
      orderBy: { uploadedAt: 'asc' },
    });
  }

  async getByIdOrThrow(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }

  getFileStream(doc: { storagePath: string }) {
    return fs.createReadStream(doc.storagePath);
  }

  async signDocument(documentId: string, cpfInput: string) {
    const document = await this.getByIdOrThrow(documentId);
    if (!document.available)
      throw new BadRequestException('Documento já assinado');

    const cpf = normalizeCpf(cpfInput);
    if (!isValidCpf(cpf)) throw new BadRequestException('CPF inválido');

    // Hash de assinatura = sha256(docHash + ":" + cpf)
    const signatureHash = sha256Hex(`${document.docHash}:${cpf}`);

    const signature = await this.prisma.signature.create({
      data: {
        documentId: document.id,
        signerCpf: cpf,
        signatureHash,
      },
    });

    await this.prisma.document.update({
      where: { id: document.id },
      data: { available: false, signedAt: signature.signedAt },
    });

    return { signature, document };
  }

  async listSigned() {
    const rows = await this.prisma.signature.findMany({
      include: { document: true },
      orderBy: { signedAt: 'desc' },
    });

    return rows.map((r) => ({
      documentId: r.documentId,
      documentName: r.document.name,
      signedAt: r.signedAt,
      signerCpf: r.signerCpf,
      signatureHash: r.signatureHash,
    }));
  }
}
