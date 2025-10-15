import { supabase } from "./supabaseClient.js";

async function cargarCarrito() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("Debes iniciar sesión");

  // Buscar carrito del usuario
  const { data: carrito, error: carritoError } = await supabase
    .from("carritos")
    .select("id")
    .eq("id_usuario", user.id)
    .single();

  if (carritoError || !carrito) {
    console.error("Error al obtener carrito:", carritoError);
    return alert("No se encontró tu carrito");
  }

  // Cargar productos del carrito
  const { data: productos, error } = await supabase
    .from("carrito_productos")
    .select("id, cantidad, id_producto, productos(id_producto, nombre, precio, imagen_url)")
    .eq("id_carrito", carrito.id);

  if (error) {
    console.error("Error al obtener productos:", error);
    return;
  }

  // 🔧 --- NUEVO BLOQUE: combinar duplicados y reflejar en la base de datos ---
  const agrupados = {};

  for (const item of productos) {
    const idProd = item.id_producto;
    if (!agrupados[idProd]) agrupados[idProd] = [item];
    else agrupados[idProd].push(item);
  }

  for (const idProd in agrupados) {
    const items = agrupados[idProd];
    if (items.length > 1) {
      const total = items.reduce((suma, i) => suma + (i.cantidad || 0), 0);
      const idPrincipal = items[0].id;
      const idsEliminar = items.slice(1).map(i => i.id);

      // ✅ Actualizamos la cantidad acumulada en el registro principal
      const { data: updated, error: updateErr } = await supabase
        .from("carrito_productos")
        .update({ cantidad: total })
        .eq("id", idPrincipal)
        .select("id, cantidad");

      if (updateErr) {
        console.error("Error actualizando cantidad combinada:", updateErr);
        continue;
      }

      console.log(`🟢 Producto ${idProd}: cantidad total = ${total} (actualizado en ${idPrincipal})`);

      // 🗑️ Eliminar duplicados secundarios
      if (idsEliminar.length > 0) {
        const { error: deleteErr } = await supabase
          .from("carrito_productos")
          .delete()
          .in("id", idsEliminar);

        if (deleteErr)
          console.error("Error eliminando duplicados:", deleteErr);
        else
          console.log(`🧹 Eliminados ${idsEliminar.length} duplicados de producto ${idProd}`);
      }
    }
  }

  // 🔁 Volvemos a cargar la data fresca desde Supabase (ya consolidada)
  const { data: productosFinales, error: reloadErr } = await supabase
    .from("carrito_productos")
    .select("id, cantidad, productos(id_producto, nombre, precio, imagen_url)")
    .eq("id_carrito", carrito.id);

  if (reloadErr) {
    console.error("Error recargando carrito:", reloadErr);
    return;
  }

  mostrarCarrito(productosFinales, carrito.id);
}

function mostrarCarrito(productos, idCarrito) {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  productos.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <img src="${item.productos.imagen_url}" width="80">
      <h4>${item.productos.nombre}</h4>
      <p>$${item.productos.precio}</p>
      <div class="cantidad-control">
        <button class="restar" data-id="${item.id}">-</button>
        <span>${item.cantidad}</span>
        <button class="sumar" data-id="${item.id}">+</button>
      </div>
      <button class="eliminar" data-id="${item.id}">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });

  // Eventos
  contenedor.querySelectorAll(".sumar").forEach(btn =>
    btn.addEventListener("click", async e => {
      await modificarCantidad(e.target.dataset.id, 1);
    })
  );

  contenedor.querySelectorAll(".restar").forEach(btn =>
    btn.addEventListener("click", async e => {
      await modificarCantidad(e.target.dataset.id, -1);
    })
  );

  contenedor.querySelectorAll(".eliminar").forEach(btn =>
    btn.addEventListener("click", async e => {
      await eliminarProducto(e.target.dataset.id);
    })
  );
}

async function modificarCantidad(idRegistro, cambio) {
  const { data, error } = await supabase
    .from("carrito_productos")
    .select("cantidad")
    .eq("id", idRegistro)
    .single();

  if (error || !data) return console.error("Error al obtener cantidad:", error);

  const nuevaCantidad = data.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    await eliminarProducto(idRegistro);
  } else {
    const { error: updateError } = await supabase
      .from("carrito_productos")
      .update({ cantidad: nuevaCantidad })
      .eq("id", idRegistro);

    if (updateError) console.error("Error al actualizar cantidad:", updateError);
  }

  await cargarCarrito();
}

async function eliminarProducto(idRegistro) {
  const { error } = await supabase
    .from("carrito_productos")
    .delete()
    .eq("id", idRegistro);

  if (error) console.error("Error al eliminar producto:", error);
  await cargarCarrito();
}

document.addEventListener("DOMContentLoaded", cargarCarrito);
