# Etapa de construcción
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:22-alpine
WORKDIR /app
# Angular 17+ suele poner el build en dist/nombre-del-proyecto
COPY --from=build /app/dist/astra-ventura-f-main ./dist

# El puerto por defecto del SSR de Angular es el 4000
EXPOSE 4000 

# Ejecutar el servidor SSR
CMD ["node", "dist/server/server.mjs"]
