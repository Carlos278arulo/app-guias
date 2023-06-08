const express = require("express");
const router = express.Router();
const multer = require("multer");
const archivoController = require("../controllers/archivocontroler");
const nodemailer = require('nodemailer');
const fs = require("fs");
const Guia = require("../models/fil");

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

// Configurar el transporter para el servicio de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'carlosjoseariaslopez@gmail.com', // Tu dirección de correo electrónico
    pass: 'mqtdukqzaewjzece', // Tu contraseña de correo electrónico
  },
});

// Ruta para subir un archivo
router.post("/subir", upload.single("archivo"), archivoController.subirArchivo);

// Ruta para enviar el formulario y enviar la notificación por correo electrónico
router.post("/enviar", upload.single("guia"), async (req, res) => {
  try {
    // Obtener los datos del formulario
    const nombre = req.body.nombre;
    const carrera = req.body.carrera;
    const asignatura = req.body.asignatura;
    const grupo = req.body.grupo;

    // Configurar los detalles del correo de notificación
    const mailOptions = {
      from: 'carlosjoseariaslopez@gmail.com', // Tu dirección de correo electrónico
      to: 'cl5343940@gmail.com',              // Dirección de correo del destinatario
      subject: 'Nuevo formulario enviado',
      text: `Se ha recibido un nuevo formulario con los siguientes datos:
        Nombre: ${nombre}
        Carrera: ${carrera}
        Asignatura: ${asignatura}
        Grupo: ${grupo}`,
    };

    // Guardar los datos en la base de datos
    const archivo = req.file;
    const nuevaGuia = new Guia({
      nombre,
      carrera,
      asignatura,
      grupo,
      guia: {
        data: fs.readFileSync(archivo.path),
        contentType: archivo.mimetype,
      },
    });

    await nuevaGuia.save();

    // Enviar el correo de notificación
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        // Manejar el error, si corresponde
      } else {
        console.log('Correo enviado: ' + info.response);
        // Manejar la notificación de éxito, si corresponde
      }
    });

    // Eliminar el archivo temporal después de guardarlo en la base de datos
    fs.unlinkSync(archivo.path);

    res.send('Formulario enviado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el formulario");
  }
});
// Ruta para descargar un archivo
router.get("/descargar", archivoController.descargarArchivo);

module.exports = router;
