# Usa uma imagem Node.js base com Alpine para leveza
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia package.json e package-lock.json para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código fonte para o diretório de trabalho
COPY . .

# **MUDANÇA CRUCIAL AQUI:** Gerar o Prisma Client para o ambiente Linux Alpine
# Isso deve ser feito DEPOIS de copiar o schema.prisma (COPY . .)
# e ANTES do npm run build que usará o Prisma Client.
RUN npx prisma generate

# Constrói a aplicação NestJS para produção
RUN npm run build

# Expõe a porta em que o NestJS estará ouvindo (definida em main.ts)
EXPOSE 3001

# Comando para rodar a aplicação quando o contêiner for iniciado
CMD [ "node", "dist/main" ]