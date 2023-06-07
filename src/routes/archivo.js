const express = require("express");
const router = express.Router();
const multer = require("multer");
const archivoController = require("../controllers/archivocontroler");




// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se almacenarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nombre del archivo
  }
});


// Validación de archivos
const fileFilter = (req, file, cb) => {
  // Validar tipos de archivos permitidos (solo PDF y documentos)
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml")) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024 // Limite de tamaño de 4 MB (en bytes)
  }
});

// Ruta para subir un archivo
router.post("/subir", upload.single("archivo"), archivoController.subirArchivo);
// Ruta para consultar los datos de archivos
router.post("/enviar", upload.single("guia"), archivoController.enviarFormulario);



module.exports = router;


