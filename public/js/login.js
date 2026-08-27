const API = 'http://localhost:3000';
const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  // Buscar usuario por correo y contraseña
  const usuarios = await fetch(`${API}/usuarios?email=${correo}&password=${contrasena}`).then(r => r.json());
  if (usuarios.length === 0) {
    mensaje.textContent = "Email o contraseña incorrectos";
    mensaje.style.color = "White";
    mensaje.style.fontSize = "30px";
    return;
  }
  const user = usuarios[0];
    // Guardar sesión local
    localStorage.setItem('userID', user.id);
    localStorage.setItem('rol', user.rol);
    localStorage.setItem('userName', user.nombre);

    // Redirigir al index
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
  }
);