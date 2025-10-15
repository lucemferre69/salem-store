const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  // Buscar usuario con ese correo
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", correo)
    .eq("contrasena", contrasena)
    .single(); // Trae un solo resultado

  if (error || !data) {
    mensaje.textContent = "❌ Correo o contraseña incorrectos";
    mensaje.style.color = "red";
    console.error("Error:", error?.message);
  } else {
    mensaje.textContent = "✅ Inicio de sesión exitoso";
    mensaje.style.color = "green";

    // Guardar sesión local (opcional)
    localStorage.setItem("usuario_id", data.id_usuario);
    localStorage.setItem("usuario_correo", data.correo);
    localStorage.setItem("usuario_nombre", data.nombre);

    // Redirigir (por ejemplo, a la tienda)
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
});