import { supabase } from "./supabaseClient.js";

const ADMIN_ID = "b0dec071-4530-49b0-a3cd-86e5944929b1"; // 👈 reemplazalo por tu ID real
const panelAdmin = document.getElementById("panelAdmin");
const mensaje = document.getElementById("mensaje");

// Verificar sesión
async function verificarAcceso() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session ?? null;

  if (!session) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para acceder al panel.";
    return false;
  }

  const user = session.user;
  console.log("Usuario actual:", user.id);

  if (user.id !== ADMIN_ID) {
    mensaje.textContent = "🚫 No tienes permiso para acceder a este panel.";
    return false;
  }

  panelAdmin.style.display = "block";
  mensaje.textContent = "✅ Acceso concedido al panel de administración.";
  return true;
}

// Subir imagen al storage
async function subirImagenProducto(file, nombreArchivo) {
  const filePath = `productos/${nombreArchivo}`;

  const { data, error } = await supabase.storage
    .from("productos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error al subir imagen:", error.message);
    alert("❌ No se pudo subir la imagen");
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("productos")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// Guardar producto en base de datos
async function guardarProducto(nombre, precio, descripcion, stock, talla, color, id_categoria, url) {
  const { error } = await supabase.from("productos").insert([
    { nombre, precio, descripcion, stock, talla, color, id_categoria, imagen_url: url },
  ]);

  if (error) {
    console.error("Error al guardar producto:", error.message);
    alert("❌ No se pudo guardar el producto");
  } else {
    alert("✅ Producto agregado correctamente");
    document.getElementById("formProducto").reset();
  }
}

// Manejador del formulario
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value.trim();
  const file = document.getElementById("imagen").files[0];
  const stock = parseInt(document.getElementById("stock").value);
  const talla = document.getElementById("talla").value.trim();
  const color = document.getElementById("color").value.trim();
  const id_categoria = parseInt(document.getElementById("categoria").value);
  if (!file) return alert("Seleccioná una imagen");

  const nombreArchivo = `${Date.now()}-${file.name}`;
  const url = await subirImagenProducto(file, nombreArchivo);
  if (url) await guardarProducto(nombre, precio, descripcion, stock, talla, color, id_categoria, url);
});

// Inicializar
verificarAcceso();
