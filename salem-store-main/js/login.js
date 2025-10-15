import { supabase } from "./supabaseClient.js";

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("correo").value.trim();
  const password = document.getElementById("contrasena").value.trim();

  if (!email || !password) {
    mensaje.textContent = "⚠️ Por favor completá todos los campos.";
    return;
  }

  // Iniciar sesión con Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    mensaje.textContent = `Error: ${error.message}`;
    return;
  }

  console.log("✅ Sesión iniciada:", data);

  // Guardar los datos del usuario localmente
  const user = data.user;
  localStorage.setItem("usuarioId", user.id);
  localStorage.setItem("usuarioCorreo", user.email);

  mensaje.textContent = "✅ Inicio de sesión exitoso. Redirigiendo...";

  // Redirigir al index
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
