const API = 'http://localhost:3000';
const userID = localStorage.getItem("userID");
const userName = localStorage.getItem("userName");
const loginBtn = document.getElementById("loginBtn");
const out = document.getElementById("cerrar");
const signUpBtn = document.getElementById("signUpBtn");
const catalogo = document.getElementById("muestra");
let cantidad = 0;
let itemsLength = 0;
//Usuario

if (userID) {
  // Si el usuario está logueado
  const carritos = await fetch(`${API}/carritos?usuarioId=${userID}`).then(r => r.json());
  let carrito = carritos[0];
  let items = carrito.items;
  console.log(items);
  const btnCarrito = document.getElementsByClassName("btn-cart");
  btnCarrito[0].dataset.quantity = calcularCantidad();
  loginBtn.textContent = `Bienvenido, ${userName}`;
  loginBtn.href = "#";
  loginBtn.style = "text-decoration: none; cursor: default; color: black; text-align: center; display: block; font-family: 'VanHelsing'; font-size: 20px;";
  out.textContent = "Cerrar sesión";
  signUpBtn.href = "#";

  // Cerrar sesión
  out.addEventListener("click", () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("rol");
    localStorage.removeItem("userName");
    window.location.reload(); // Recargar la página
  });

  function calcularCantidad (){
    for (let i = 0; i < items.length; i++){
      cantidad += items[i].cantidad;
      console.log(cantidad);
    };
    return cantidad;
  };
}