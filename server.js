const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Configurás dónde y cómo se guardan las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/imgDB'); // carpeta donde se guardan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage });

// Ruta para subir la imagen
app.post('/subir-imagen', upload.single('imagen'), (req, res) => {
  console.log(req.file);
  res.json({ ruta: `imgDB/${req.file.filename}` });
});

app.listen(4000, () => console.log('Servidor de imágenes corriendo en localhost:4000'));