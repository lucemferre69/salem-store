async function registrarUsuario() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const nombre = document.getElementById("nombre").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre: nombre },
    },
  });

  if (error) {
    alert("Error al registrarse: " + error.message);
    console.error(error);
    return;
  }

  alert("Cuenta creada correctamente. Ahora podés iniciar sesión.");
  window.location.href = "login.html";
}
