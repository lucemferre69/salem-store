import { supabase } from "./supabaseClient.js";

const contenedor = document.getElementById("box");
const imagen = document.getElementById("imagen");
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

// 🔹 Cargar los datos del producto desde Supabase
async function cargarProducto() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id_producto", idProducto)
    .single();

  if (error || !data) {
    contenedor.innerHTML = "<p>❌ Producto no encontrado.</p>";
    console.error("Error:", error?.message);
    return;
  }

  imagen.innerHTML = `<img src="${data.imagen_url}" alt="${data.nombre}">`;
  contenedor.innerHTML = `
    <h2>${data.nombre}</h2>
    <p>${data.descripcion}</p>
    <p>$${data.precio}</p>
    <button id="agregarBtn">Agregar al carrito</button>
  `;

  const btn = document.getElementById("agregarBtn");
  btn.addEventListener("click", () => agregarAlCarrito(data));
}

// 🔹 Obtener o crear el carrito del usuario
async function obtenerOCrearCarrito() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    return null;
  }

  // Verificar si ya existe un carrito para el usuario
  const { data: carritos, error: buscarError } = await supabase
    .from("carritos")
    .select("id")
    .eq("id_usuario", user.id);

  if (buscarError) {
    console.error("Error buscando carrito:", buscarError);
    return null;
  }

  if (carritos.length > 0) {
    // ✅ Ya existe, devolver el existente
    return carritos[0];
  } 

  // 🔹 Si no existe, crear uno nuevo
  const { data: nuevoCarrito, error: crearError } = await supabase
    .from("carritos")
    .insert([{ id_usuario: user.id }])
    .select()
    .single();

  if (crearError) {
    console.error("Error creando carrito:", crearError);
    return null;
  }

  return nuevoCarrito;
}

// 🔹 Agregar producto al carrito en Supabase
async function agregarAlCarrito(producto) {
  const carrito = await obtenerOCrearCarrito();
  if (!carrito) return;

  // Verificar si el producto ya está en el carrito
  const { data: existente, error: buscarError } = await supabase
    .from("carrito_productos")
    .select("id, cantidad")
    .eq("id", carrito.id)
    .eq("id_producto", producto.id_producto)
    .maybeSingle();

  if (buscarError) {
    console.error("Error verificando producto en carrito:", buscarError);
    return;
  }

  if (existente) {
    // 🔹 Si ya está, actualizar cantidad
    const nuevaCantidad = existente.cantidad + 1;
    const { error: updateError } = await supabase
      .from("carrito_productos")
      .update({ cantidad: nuevaCantidad })
      .eq("id", existente.id);

    if (updateError) {
      console.error("Error al actualizar cantidad:", updateError);
      return;
    }

    alert(`🛒 Se sumó 1 unidad de ${producto.nombre} al carrito`);
  } else {
    // 🔹 Si no está, insertarlo
    const { error: insertError } = await supabase.from("carrito_productos").insert([
      {
        id_carrito: carrito.id,
        id_producto: producto.id_producto,
        cantidad: 1
      }
    ]);

    if (insertError) {
      console.error("Error al agregar al carrito:", insertError);
      return;
    }

    alert(`✅ ${producto.nombre} agregado al carrito`);
  }
}

document.addEventListener("DOMContentLoaded", cargarProducto);
