# Image de base : Node.js sur Alpine Linux (légère)
FROM node:24-alpine

WORKDIR /app

# Dépendances d'abord (mises en cache tant que package.json ne change pas)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Puis le code
COPY src ./src

EXPOSE 3000
CMD ["node", "src/server.js"]
