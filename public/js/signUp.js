const API = 'http://localhost:3000';
const form = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("email").value;
  const contrasena = document.getElementById("password").value;
  const contrasena2 = document.getElementById("password2").value;

  // Validación simple
  if (!correo || !contrasena || !nombre) {
    mensaje.textContent = "Por favor completá todos los campos.";
    return;
  }
  if (contrasena !== contrasena2) {
    mensaje.textContent = "Las contraseñas no coinciden.";
    return;
  }
  // Comprueba si el mail ya está registrado
  const mailComp = await fetch(`${API}/usuarios?email=${correo}`).then(r => r.json());

  if (mailComp.length > 0) {
    mensaje.textContent = "Este mail ya está registrado.";
    return;
  }
  // Insertar usuario
  const signUp = await fetch(`${API}/usuarios`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    nombre: nombre,
    apellido: apellido,
    email: correo,
    password: contrasena,
    rol: "cliente"
    })
  }).then(r => r.json());
  await fetch(`${API}/carritos`,{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
    usuarioId: signUp.id,
    items: [],
    total: 0
    })
  })
});
