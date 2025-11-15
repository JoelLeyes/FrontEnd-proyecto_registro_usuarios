// script.js - Conexión frontend <-> backend (Django REST en EKS + RDS)

// Usar ruta relativa para que las llamadas pasen por el frontend (Nginx) y lleguen al backend ClusterIP
const API_BASE = '/api';

// --- Listar usuarios ---
async function listarUsuarios() {
    try {
        const res = await fetch(`${API_BASE}/usuarios/`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const list = document.createElement('ul');
        data.forEach(u => {
            const li = document.createElement('li');
            li.textContent = `${u.id} - ${u.nombre} (${u.email}) - ${u.telefono}`;
            list.appendChild(li);
        });

        const listaUsuarios = document.getElementById('listaUsuarios');
        listaUsuarios.innerHTML = ''; // Limpiar contenido previo
        listaUsuarios.appendChild(list);
    } catch (err) {
        console.error('❌ Error al listar usuarios:', err);
    }
}

// --- Registrar usuario ---
document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const mensajeDiv = document.getElementById('mensaje');

            try {
                const res = await fetch(`${API_BASE}/usuarios/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, email, telefono }),
                });

                const body = await res.json();
                if (!res.ok) {
                    mensajeDiv.textContent = '⚠️ Error: ' + JSON.stringify(body);
                    mensajeDiv.style.color = 'red';
                    return;
                }

                mensajeDiv.textContent = '✅ Usuario creado correctamente';
                mensajeDiv.style.color = 'green';
                registroForm.reset();
            } catch (err) {
                mensajeDiv.textContent = '❌ Error al conectar con el servidor';
                mensajeDiv.style.color = 'red';
                console.error(err);
            }
        });
    }

    // Si estamos en index.html, listar usuarios automáticamente
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        listarUsuarios();
    }
});
