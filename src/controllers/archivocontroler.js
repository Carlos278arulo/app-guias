const fs = require("fs");
const Archivo = require("../models/archivos");
const Guia = require("../models/fil");

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

    // Eliminar el archivo temporal después de guardarlo en la base de datos
    fs.unlinkSync(archivo.path);

    req.flash("success_msg", "Guía de laboratorio agregada exitosamente");
    res.redirect("/guias/subirguia"); // Redirige a la página principal o a donde desees después de subir la guía
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir la guía");
  }
};



module.exports = {
  subirArchivo,
  enviarFormulario,
  
};
