const producto = document.getElementById("producto");
const contenedor = document.getElementById("box");
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");
console.log("si funca");
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
contenedor.innerHTML = `
    <img src="${data.imagen_url}" alt="${data.nombre}">
    <h2>${data.nombre}</h2>
    <p>${data.descripcion}</p>
    <p class="precio">$${data.precio}</p>
    <button>Agregar al carrito</button>
  `;
}

cargarProducto();