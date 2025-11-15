# Usa una imagen base de Node.js para construir la aplicación
FROM nginx:alpine

# Copiamos la configuración personalizada de nginx (proxy para /api -> backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos del frontend directamente al servidor Nginx
COPY . /usr/share/nginx/html

# Expone el puerto en el que corre Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]