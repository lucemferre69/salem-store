import { supabase } from "./supabaseClient.js";

async function cerrarSesion() {
  try {
    // 🔒 Cierra la sesión de Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // 🧹 Limpia cualquier dato del navegador (carrito, sesión, etc.)
    localStorage.clear();
    sessionStorage.clear();

    // 🔁 Redirige o recarga la página
    window.location.reload(); // o podés usar: window.location.reload();

  } catch (err) {
    console.error("Error al cerrar sesión:", err.message);
    alert("No se pudo cerrar sesión. Intentá nuevamente.");
  }
}

// 🔘 Asociar al botón de cierre de sesión
document.getElementById("cerrarSesionBtn")?.addEventListener("click", cerrarSesion);
