import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@local.dev';
  const userEmail = 'user@local.dev';
  const password = 'Senha123!';

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, role: Role.ADMIN },
  });

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: { email: userEmail, passwordHash, role: Role.USER },
  });

  console.log(
    'Seed concluído. Admin:',
    adminEmail,
    'User:',
    userEmail,
    'Senha:',
    password,
  );
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
void main().finally(async () => prisma.$disconnect());
