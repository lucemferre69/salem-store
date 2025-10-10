async function registrarUsuario(correo, contrasena) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ correo, contrasena }]);

  if (error) {
    console.error('Error al registrar usuario:', error.message);
  } else {
    console.log('Usuario creado:', data);
  }
}

// Ejemplo de uso:
registrarUsuario('ejemplo@gmail.com', '123456');

async function testLectura() {
  const { data, error } = await supabase.from('usuarios').select('*');
  console.log(data || error);
}

testLectura();
