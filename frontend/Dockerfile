# Etapa 1: Build da aplicação React
# Usa uma imagem Node.js para o build
FROM node:20-alpine AS build

WORKDIR /app

# Instalar ferramentas de build (manter)
RUN apk add --no-cache npm python3 make gcc g++

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm cache clean --force && npm install --silent

# Copia o restante do código fonte
COPY . .

# Constrói a aplicação Vite para produção
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
# AGORA O NGINX COMEÇA AQUI, E ELE COPIARÁ DIRETAMENTE DO ESTÁGIO DE BUILD
FROM nginx:alpine

# Copia os arquivos estáticos gerados na etapa de build para o diretório de serviço do Nginx
COPY --from=build /app/dist /usr/share/nginx/html 

# Copia a configuração personalizada do Nginx (esta será montada via volume no docker-compose.yml)
# O Docker Compose vai montar o nginx.conf localmente. Não precisa copiar aqui no Dockerfile.
# Se você quiser que o nginx.conf faça parte da IMAGEM, você o copiaria aqui.
# No seu docker-compose.yml atual, você está montando o nginx.conf como um volume.
# Se for montado como volume, não precisa desta linha aqui.
# Se for para produção e você quer o nginx.conf na imagem final, você o copiaria aqui.
# Por enquanto, vamos manter o volume para flexibilidade em dev.

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"] 