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
  if (!correo || !contrasena) {
    mensaje.textContent = "Por favor completá todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  // Insertar usuario en Supabase
  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nombre, apellido, correo, contrasena }])
    .select();

  if (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    mensaje.textContent = "Error: " + error.message;
    mensaje.style.color = "red";
  } else {
    console.log("✅ Usuario agregado:", data);
    mensaje.textContent = "✅ Usuario registrado con éxito!";
    mensaje.style.color = "green";
    form.reset();
  }
});
