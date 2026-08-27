const API = 'http://localhost:3000';
let carrito = null;
async function cargarCarrito() {
  const usuarioId = Number(localStorage.getItem('userID'));
  if (!usuarioId) {
    alert("❌Inicia sesión para acceder al carrito.")
    window.location.href = '/login.html';
    return;
  }

  // Traés el carrito del usuario
  const carritos = await fetch(`${API}/carritos?usuarioId=${usuarioId}`).then(r => r.json());
  carrito = carritos[0];

  const contenedor = document.getElementById('carrito');

  // Si el carrito está vacío
  if (carrito.items.length === 0) {
    contenedor.innerHTML = '<p>Tu carrito está vacío</p>';
    return;
  }

  // Limpiás el contenedor antes de renderizar
  contenedor.innerHTML = '';

  // Renderizás cada item
  carrito.items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-carrito');

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio}</p>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Subtotal: $${item.precio * item.cantidad}</p>
      <button onclick="eliminarDelCarrito(${item.productoId})">Eliminar</button>
    `;

    contenedor.appendChild(card);
  });

  // Mostrás el total
  const total = document.getElementById('total');
  total.textContent = `Total: $${carrito.total}`;
}
cargarCarrito();
window.eliminarDelCarrito = async function (productoId) {
  const usuarioId = Number(localStorage.getItem('userID'));
  const carritos = await fetch(`${API}/carritos?usuarioId=${usuarioId}`).then(r => r.json());
  carrito = carritos[0];
  // Filtrás el item a eliminar
  carrito.items = carrito.items.filter(item => item.productoId !== productoId);

  // Actualizás el total
  carrito.total = carrito.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Guardás el carrito actualizado
  await fetch(`${API}/carritos/${carrito.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrito)
  });

  // Recargás el carrito en pantalla
  cargarCarrito();
}

function compartirPedido() {
  const usuarioNombre = localStorage.getItem('userName');
  
  // Armás el mensaje con los items del carrito
  let mensaje = `🛍️ Pedido de ${usuarioNombre}:\n\n`;
  
  carrito.items.forEach(item => {
    mensaje += `• ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}\n`;
  });
  
  mensaje += `\nTotal: $${carrito.total}`;

  // Encode para URL y abrís WhatsApp
  const url = `https://wa.me/5492604012205?text=${encodeURIComponent(mensaje)}`;
  window.open(url);
}