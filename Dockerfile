# Usar Node.js LTS como base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Crear directorio para uploads si no existe
RUN mkdir -p uploads && chmod 777 uploads

# Exponer el puerto (ajusta según tu .env o usa 3000 por defecto)
EXPOSE 3000

# Variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "server.js"]