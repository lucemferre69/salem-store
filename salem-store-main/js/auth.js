import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evitar que recargue la página

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    mensaje.textContent = "⚠️ Por favor completá todos los campos.";
    return;
  }

  // Crear usuario en Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("❌ Error al registrar:", error.message);
    mensaje.textContent = `Error: ${error.message}`;
    return;
  }

  console.log("✅ Usuario registrado:", data);
  mensaje.textContent = "✅ Registro exitoso. Revisá tu correo (si está habilitada la verificación).";

  // Redirigir al login después de 2 segundos
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});

export function initAuth() {
  const formReg = document.getElementById("registroForm");
  if (formReg) formReg.addEventListener("submit", registrarUsuario);

  const formLogin = document.getElementById("loginForm");
  if (formLogin) formLogin.addEventListener("submit", iniciarSesion);

  const btnCerrar = document.getElementById("cerrarSesion");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarSesion);
}

