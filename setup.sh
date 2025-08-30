#!/usr/bin/env bash
set -e

echo "Iniciando Docker Compose..."
docker compose up -d --build

echo "Banco de dados pronto!"

echo "Rodando migrations..."

docker compose exec -T backend npx prisma migrate deploy

read -p "Deseja rodar o seed? (s/N) " seed
if [[ "$seed" == "s" || "$seed" == "S" ]]; then
  docker compose exec -T backend npm run prisma:seed
fi

echo '"Ladies and gentlemen, we got him!"'

echo "Frontend rodando em http://localhost:3000"
