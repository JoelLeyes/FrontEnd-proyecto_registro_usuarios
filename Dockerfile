# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del frontend al contenedor
COPY . /app

# Instala las dependencias necesarias
RUN npm install

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos construidos al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto en el que corre Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]