// js/productos.js (versión final y robusta)
import { supabase } from "./supabaseClient.js";

const catalogo = document.getElementById("muestra");
const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");
const cerrarSesionBtn = document.getElementById("cerrar");

function log(...args) {
  console.log("[productos.js]", ...args);
}

// -------------------- SESIÓN --------------------
async function verificarSesion() {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session ?? null;

    if (session) {
      const usuario = session.user;
      if (loginBtn) {
        loginBtn.textContent = `Bienvenido, ${usuario.email}`;
        loginBtn.href = "#";
      }
      if (signUpBtn) signUpBtn.style.display = "none";
      if (cerrarSesionBtn) {
        cerrarSesionBtn.style.display = "inline";
        cerrarSesionBtn.onclick = async () => {
          await supabase.auth.signOut();
          localStorage.clear();
          window.location.reload();
        };
      }
    } else {
      if (cerrarSesionBtn) cerrarSesionBtn.style.display = "none";
    }
  } catch (err) {
    console.error("[verificarSesion] error:", err);
  }
}

// -------------------- PRODUCTOS --------------------
async function fetchProductos() {
  try {
    const { data: productos, error } = await supabase
      .from("productos")
      .select("*")
      .order("id_producto", { ascending: true });

    if (error) {
      console.error("[fetchProductos] error:", error);
      return [];
    }
    log("Productos cargados:", productos?.length ?? 0);
    return productos ?? [];
  } catch (err) {
    console.error("[fetchProductos] unexpected:", err);
    return [];
  }
}

// -------------------- CARRITO --------------------
async function obtenerOCrearCarrito(userId) {
  try {
    // 1) Buscar carrito existente
    const { data: carritos, error: selectError } = await supabase
      .from("carritos")
      .select("id")
      .eq("id_usuario", userId)
      .limit(1);

    if (selectError) {
      console.warn("[carrito] error buscando carrito:", selectError);
    }

    if (carritos && carritos.length > 0) {
      log("Carrito existente encontrado:", carritos[0].id);
      return carritos[0].id;
    }

    // 2) Crear carrito si no existe
    const { data: nuevo, error: insertError } = await supabase
      .from("carritos")
      .insert([{ id_usuario: userId }])
      .select("id")
      .single();

    if (insertError) {
      // Si el error es conflicto (409) significa que el carrito ya existe, lo leemos otra vez
      if (insertError.code === "23505" || insertError.details?.includes("duplicate")) {
        log("[carrito] conflicto detectado, releyendo...");
        const { data: relectura } = await supabase
          .from("carritos")
          .select("id_carrito")
          .eq("id_usuario", userId)
          .limit(1);
        if (relectura && relectura.length > 0) return relectura[0].id;
      }
      console.error("[carrito] error creando carrito:", insertError);
      return null;
    }

    log("Carrito creado:", nuevo.id);
    return nuevo.id;
  } catch (err) {
    console.error("[carrito] error inesperado:", err);
    return null;
  }
}

// -------------------- AGREGAR PRODUCTO --------------------
async function agregarAlCarritoSafe(idProducto) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session ?? null;
    if (!session) {
      alert("Tenés que iniciar sesión para agregar productos al carrito.");
      return;
    }

    const userId = session.user.id;
    const carritoId = await obtenerOCrearCarrito(userId);
    if (!carritoId) {
      alert("No se pudo acceder al carrito. Intentá nuevamente.");
      return;
    }

    // Buscar si el producto ya está en el carrito
    const { data: existente, error: existeErr } = await supabase
      .from("carrito_productos")
      .select("id, cantidad")
      .eq("id", carritoId)
      .eq("id_producto", idProducto)
      .maybeSingle();

    if (existeErr) {
      console.error("[agregar] error buscando existente:", existeErr);
      alert("Error al acceder al carrito.");
      return;
    }

    if (existente) {
      // Ya existe → sumar cantidad
      const nuevaCantidad = (existente.cantidad || 0) + 1;
      const { error: updateErr } = await supabase
        .from("carrito_productos")
        .update({ cantidad: nuevaCantidad })
        .eq("id", existente.id);

      if (updateErr) {
        console.error("[agregar] error update:", updateErr);
        alert("No se pudo actualizar la cantidad.");
        return;
      }
      log("Cantidad actualizada:", idProducto, "->", nuevaCantidad);
      alert("Cantidad actualizada en el carrito");
    } else {
      // No existe → insertar nuevo
      const { error: insertErr } = await supabase.from("carrito_productos").insert([
        { id_carrito: carritoId, id_producto: idProducto, cantidad: 1 },
      ]);
      if (insertErr) {
        console.error("[agregar] error insert:", insertErr);
        alert("No se pudo agregar el producto.");
        return;
      }
      log("Producto agregado al carrito:", idProducto);
      alert("Producto agregado al carrito");
    }
  } catch (err) {
    console.error("[agregarAlCarritoSafe] unexpected:", err);
    alert("Error inesperado al agregar al carrito.");
  }
}

// -------------------- RENDER --------------------
function renderProductos(productos) {
  if (!catalogo) {
    console.error("No se encontró el elemento #muestra en el DOM");
    return;
  }
  catalogo.innerHTML = "";

  productos.forEach((prod) => {
    const idProd = prod.id_producto ?? prod.id ?? prod.id_prod;
    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <img src="${prod.imagen_url ?? ""}" alt="${prod.nombre}" />
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p class="precio">$${prod.precio}</p>
      <button class="btn-agregar" data-id="${idProd}">Agregar al carrito</button>
    `;

    const btn = card.querySelector(".btn-agregar");
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      await agregarAlCarritoSafe(id);
    });

    catalogo.appendChild(card);
  });
}

// -------------------- INIT --------------------
(async function init() {
  log("Inicializando productos...");
  await verificarSesion();
  const productos = await fetchProductos();
  renderProductos(productos);
  log("Inicialización completa");
})();
