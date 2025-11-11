# Usa una imagen base de Nginx para servir archivos estáticos
FROM nginx:alpine

# Establece el directorio de trabajo
WORKDIR /usr/share/nginx/html

# Copia los archivos estáticos del frontend al servidor Nginx
COPY index.html ./
COPY registroUsuario.html ./
COPY mostrarUsuarios.html ./
COPY script.js ./
COPY styles.css ./

# Copia configuración personalizada de Nginx (opcional, para mejor manejo de rutas)
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto en el que corre Nginx
EXPOSE 80

# Comando para iniciar Nginx en modo foreground
CMD ["nginx", "-g", "daemon off;"]