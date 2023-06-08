const fs = require("fs");
const Archivo = require("../models/archivos");
const Guia = require("../models/fil");
const nodemailer = require('nodemailer');

// Configurar el transporter para el servicio de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'carlosjoseariaslopez@gmail.com', // Tu dirección de correo electrónico
    pass: 'mqtdukqzaewjzece', // Tu contraseña de correo electrónico
  },
});

const subirArchivo = async (req, res) => {
  try {
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).send("No se ha proporcionado ningún archivo");
    }

    const nuevoArchivo = new Archivo({
      archivo: {
        data: fs.readFileSync(archivo.path),
        contentType: archivo.mimetype,
      },
    });

    await nuevoArchivo.save();

    // Eliminar el archivo temporal después de guardarlo en la base de datos
    fs.unlinkSync(archivo.path);

    req.flash("success_msg", "Archivo subido");
    res.redirect("/guias/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir el archivo");
  }
};

const enviarFormulario = async (req, res) => {
  try {
    const { nombre, carrera, asignatura, grupo } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).send("No se ha proporcionado ningún archivo");
    }

    // Guardar los datos en la base de datos
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
    const mailOptions = {
      from: 'carlosjoseariaslopez@gmail.com', // Tu dirección de correo electrónico
      to: 'cl5343940@gmail.com', // Dirección de correo del destinatario
      subject: 'Nuevo formulario enviado',
      text: `Se ha recibido un nuevo formulario con los siguientes datos:
        Nombre: ${nombre}
        Carrera: ${carrera}
        Asignatura: ${asignatura}
        Grupo: ${grupo}`,
    };

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
};

module.exports = {
  subirArchivo,
  enviarFormulario,
};

const descargarArchivo = async (req, res) => {
  try {
    // Obtener el primer archivo encontrado en la base de datos
    const archivo = await Archivo.findOne();

    if (!archivo) {
      return res.status(404).send("No se encontró ningún archivo en la base de datos");
    }

    // Establecer el tipo de contenido como PDF
    res.setHeader("Content-Type", "application/pdf");

    // Enviar el archivo como respuesta
    res.send(archivo.archivo.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al descargar el archivo");
  }
};

module.exports = {
  subirArchivo,
  enviarFormulario,
  descargarArchivo,
};
