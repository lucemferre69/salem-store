const usuarioCorreo = localStorage.getItem("usuario_correo");
const usuarioNombre = localStorage.getItem("usuario_nombre");
const loginBtn = document.getElementById("loginBtn");
const out = document.getElementById("cerrar");
const signUpBtn = document.getElementById("signUpBtn");
const catalogo = document.getElementById("muestra");
//Usuario
if (usuarioCorreo) {
  // Si el usuario está logueado
  loginBtn.textContent = `Bienvenido, ${usuarioNombre}`;
  loginBtn.href = "#";
  loginBtn.style = "text-decoration: none; cursor: default; color: black; text-align: right;";
  out.textContent = "Cerrar sesión";
  signUpBtn.href = "#";

  // Acción para cerrar sesión
  out.addEventListener("click", () => {
    localStorage.removeItem("usuario_correo");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario_nombre");
    window.location.reload(); // Recargar la página
  });
}
//Fin Usuario
async function cargarProductos() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    catalogo.innerHTML = "<p>Error al cargar los productos.</p>";
    console.error("❌ Error:", error.message);
    return;
  }

  if (productos.length === 0) {
    catalogo.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  catalogo.innerHTML = ""; // Limpiar contenido

  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <img src="${prod.imagen_url}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p class="precio">$${prod.precio}</p>
      <button>Agregar al carrito</button>
    `;
      card.addEventListener("click", () => {
    window.location.href = `producto.html?id=${prod.id_producto}`;
  });
    catalogo.appendChild(card);
  });
}

cargarProductos();