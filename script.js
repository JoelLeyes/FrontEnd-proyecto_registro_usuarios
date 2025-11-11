// script.js - Conexión simple frontend <-> backend (Django REST)
// Detecta automáticamente la URL del API según el entorno
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : `${window.location.protocol}//${window.location.host}/api`;



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
        console.error('Listar usuarios:', err);
    }
}

// Si estamos en la página de registro, conectamos el form
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
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ nombre, email, telefono }),
				});
				const body = await res.json();
				if (!res.ok) {
					mensajeDiv.textContent = 'Error: ' + JSON.stringify(body);
					mensajeDiv.style.color = 'red';
					return;
				}
				mensajeDiv.textContent = 'Usuario creado correctamente';
				mensajeDiv.style.color = 'green';
				registroForm.reset();
			} catch (err) {
				mensajeDiv.textContent = 'Error al conectar con el servidor';
				mensajeDiv.style.color = 'red';
				console.error(err);
			}
		});
	}

	// Si estamos en el index, listar usuarios
	if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ) {
		listarUsuarios();
	}
});

//cors