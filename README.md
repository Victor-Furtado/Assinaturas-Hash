# Plataforma de Assinatura Digital

## Descrição

Esta aplicação representa um fluxo de assinatura digital de documentos financeiros, com dois perfis principais:

- Usuário Final (mobile-first)

Recebe um documento disponível, assina informando o CPF, e finaliza o processo.

- Backoffice / Administrativo

Cadastra documentos (upload PDF) e consulta a lista de documentos assinados.

O sistema garante segurança de autenticação, registro de assinatura via hash, e segregação de acessos entre perfis.

## Tecnologias

**Frontend**: Next.js 15, TypeScript, TailwindCSS

**Backend**: NestJS, TypeScript, Prisma

**Banco de dados**: PostgreSQL

**Autenticação**: JWT

**Containerização**: Docker + Docker Compose

## Funcionalidades

### Backoffice / Admin

1. Login Administrativo
2. Cadastro de Documento
3. Upload de PDF com título.
4. Arquivo salvo no servidor e hash SHA-256 calculado.
5. Lista de Documentos Assinados
   - Exibe ID, nome, CPF do assinante, data e hash da assinatura.

### Usuário Final

1. Assinatura de Documento
2. Exibe o primeiro documento disponível.
3. Usuário informa CPF → hash do documento + CPF gerado.
4. Documento marcado como assinado e é mostrado o próximo.

## Scripts Docker

### Rodar todos os serviços
>
> ./setup.sh

- Espera o banco subir
- Roda migrations automaticamente
- Pergunta se deseja rodar seed

### Ver logs em tempo real
>
> docker compose logs -f backend

> docker compose logs -f frontend

### Parar e remover containers
>
> docker compose down

## Melhorias Futuras

Algumas funcionalidades e melhorias podem ser implementadas para tornar o sistema mais completo e robusto:

### 1. Testes Automatizados

- Implementação de testes unitários e de integração tanto no backend (NestJS + Jest) quanto no frontend (Next.js + React Testing Library).

### 2. Gerenciamento de Documentos Não Assinados

- Tela no backoffice mostrando documentos ainda não assinados.

- Possibilidade de remover ou cancelar documentos que não serão mais assinados.

### 3. Recusa de Documento pelo Usuário Final

- Opção para que o usuário final recuse a assinatura de um documento.

- Registro de recusa para auditoria e histórico de documentos.

### 4. Sistema de Notificação

- Push notifications ou alertas via e-mail quando um novo documento estiver disponível para assinatura.

- Notificação para administradores sobre documentos assinados ou recusados.