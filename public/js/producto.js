const API = 'http://localhost:3000';

async function cargarDetalle() {
  // Leés el id de la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  const producto = await fetch(`${API}/productos/${id}`).then(r => r.json());

  document.getElementById('nombre').textContent = producto.nombre;
  document.getElementById('precio').textContent = `$${producto.precio}`;
  document.getElementById('descripcion').textContent = producto.descripcion;
  document.getElementById('imagen').src = producto.imagen;

  document.getElementById('btnAgregar').onclick = () => agregarAlCarrito(producto.id);
}

cargarDetalle();

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