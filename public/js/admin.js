const API = 'http://localhost:3000';
const mensaje = document.getElementById("mensaje");
// Verificar Acceso
const admin = localStorage.getItem("rol");

  if (!admin) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para acceder al panel.";
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 2000);
  }

 if (admin !== "admin") {
    mensaje.textContent = "🚫 No tienes permiso para acceder a este panel.";
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
  } else {
  panelAdmin.style.display = "block";
  mensaje.textContent = "✅ Acceso concedido al panel de administración.";
  }

// Subir imagen al storage

// Guardar producto en base de datos
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const imagen = document.getElementById('imagen').files[0];
  if (!imagen) return alert("Seleccioná una imagen"); // ← primero verificás

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value.trim();
  const stock = parseInt(document.getElementById("stock").value);
  const categoria = document.getElementById("categoria").value.trim();

  const formData = new FormData();
  formData.append('imagen', imagen);

  const resImagen = await fetch('http://localhost:4000/subir-imagen', {
    method: 'POST',
    body: formData
  }).then(r => r.json());
  
  await fetch(`${API}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      precio,
      descripcion,
      stock,
      imagen: resImagen.ruta,
      categoria
    })
  });
});