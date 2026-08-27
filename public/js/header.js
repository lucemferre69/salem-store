const API = 'http://localhost:3000';
const userID = localStorage.getItem("userID");
const userName = localStorage.getItem("userName");
const loginBtn = document.getElementById("loginBtn");
const out = document.getElementById("cerrar");
const signUpBtn = document.getElementById("signUpBtn");
const catalogo = document.getElementById("muestra");
//Usuario
if (userID) {
  // Si el usuario está logueado
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
}