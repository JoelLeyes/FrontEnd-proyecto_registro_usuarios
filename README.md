# Frontend – Registro de Usuarios (Nginx + HTML/JS)

Este repositorio contiene el **frontend de la aplicación de registro de usuarios**.  
Su función es brindar una interfaz sencilla que permita **registrar** y **visualizar** usuarios conectándose al backend a través de una API REST.

## Estructura
- `index.html`, `registroUsuario.html`, `mostrarUsuarios.html`, `styles.css`, `script.js`
- `nginx.conf`: reverse proxy para `/api` → backend (API Gateway o NLB)
- `Dockerfile`: imagen Nginx sirviendo estáticos y proxy `/api`

---

## 📌 Características
- Formulario de registro de usuario (nombre, email y teléfono)
- Lista dinámica de usuarios registrados
- Conexión al backend mediante peticiones HTTP en formato JSON

---

## 🧰 Tecnologías utilizadas
- HTML / CSS / JavaScript
- Nginx (reverse proxy /api → backend)

## Desarrollo local
Opción rápida sin Nginx (sirviendo estáticos):
```powershell
python -m http.server 8080
# Abrir: http://127.0.0.1:8080
```
Nota: así no hay proxy `/api`. Para pruebas completas, usar Docker (abajo) o ajustar `script.js` a URL absoluta del backend.

## Contenedor Docker (Nginx)
Editar `nginx.conf` para apuntar `/api` al backend (ejemplos):
```nginx
location /api/ {
	proxy_pass https://api.tu-dominio/;  # ej.: https://api.labinfra2025.cloud-ip.cc/
}
```
Construir y ejecutar:
```powershell
# Desde FrontEnd-proyecto_registro_usuarios
docker build -t frontend-app:local .

docker run --rm -p 8080:80 frontend-app:local
```

## Publicación en ECR (placeholders)
```powershell
$AWS_ACCOUNT_ID = "111122223333"
$AWS_REGION     = "us-east-1"
$REPO           = "proyecto/frontend"
$IMAGE          = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest"

aws ecr get-login-password --region $AWS_REGION | docker login `
	--username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

docker build -t $IMAGE .
docker push $IMAGE
```

## Despliegue en Kubernetes (EKS)
Manifiesto: `k8s/frontend.yml` (en el repo raíz). Crea Deployment y Service `NodePort` (ej.: 80:31983/TCP).
```powershell
kubectl apply -f k8s/frontend.yml
kubectl get svc,pods -o wide
```

### Exposición pública (ALB + ACM)
- ALB con certificado de ACM (HTTPS), CNAME `infra.<tu-dominio>`.
- El ALB enruta al `NodePort` del Service `frontend`.
- En el lab, los targets del ALB se registran con las instancias EKS y `NodePort` vigente (p.ej., 31983).

## Configuración
- El frontend usa `/api/...` en `script.js`.
- Nginx hace proxy `/api` hacia el backend definido en `nginx.conf`.

## Seguridad y evidencias
- DAST (OWASP ZAP) sobre el dominio del frontend.
- Evidencias en `evidencias/security/` del repo raíz del proyecto.