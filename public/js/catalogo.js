const API = 'http://localhost:3000';
async function agregarAlCarrito(productoId) {
  const usuarioId = Number(localStorage.getItem('userID'));

  if (!usuarioId) {
    alert('Tenés que iniciar sesión para agregar productos');
    return;
  }

  // Traés el producto
  const producto = await fetch(`${API}/productos/${productoId}`).then(r => r.json());

  // Traés el carrito del usuario
  const carritos = await fetch(`${API}/carritos?usuarioId=${usuarioId}`).then(r => r.json());
  const carrito = carritos[0];

  // Verificás si el producto ya está en el carrito
  const itemExistente = carrito.items.find(item => item.productoId === productoId);

  if (itemExistente) {
    // Si ya está, aumentás la cantidad
    itemExistente.cantidad++;
  } else {
    // Si no está, lo agregás
    carrito.items.push({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  // Actualizás el total
  carrito.total = carrito.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Guardás el carrito actualizado
  await fetch(`${API}/carritos/${carrito.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrito)
  });

  alert('Producto agregado al carrito');
}
// -------------------- PRODUCTOS --------------------
async function cargarProductos(){
const productos = await fetch(`${API}/productos`).then(r => r.json());

const contenedor = document.getElementById('catalogo');

productos.forEach(producto => {
  const card = document.createElement('div');
  card.classList.add('producto');
  
  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p>$${producto.precio}</p>
    <button onclick="event.stopPropagation(); agregarAlCarrito(${producto.id})">Agregar al carrito</button>
  `;
  card.addEventListener('click', () => {
  window.location.href = `producto.html?id=${producto.id}`;
});
  contenedor.appendChild(card);
})}
cargarProductos();