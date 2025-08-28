FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads

RUN mkdir -p /app/uploads

EXPOSE 3001
CMD ["node", "dist/main.js"]
