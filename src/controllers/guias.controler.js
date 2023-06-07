const guiasController = {};
const GuiaDela = require("../models/datosguias");

guiasController.renderguia1 = (req, res) => {
  res.render("users/guia1");
};
guiasController.renderdatos = (req, res) => {
  res.render("users/datos");
};
guiasController.renderspagisubi = (req, res) => {
  res.render("users/subirestu");
};
guiasController.renderconsulta = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const guias = await GuiaDela.find({}, 'id carrera asignatura grupo num_estudiantes');

    // Renderiza la plantilla 'datos' y pasa los datos como contexto
    res.render('users/datos', { guias });
  } catch (error) {
    // Manejo de errores en caso de que la consulta falle
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las guías en la base de datos' });
  }
};


// Utiliza el middleware 'upload' para procesar el archivo adjunto
guiasController.renderformguia = async (req, res) => {
  try {
    const { carrera, asignatura, grupo, num_estudiantes } = req.body;
    const newguia = new GuiaDela({
      carrera,
      asignatura,
      grupo,
      num_estudiantes,
    });
    await newguia.save();
    req.flash("success_msg", "Asignatura agregada ");
    res.redirect("home"); // Cambia "/users/guia1" con la ruta deseada
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar la nueva guía");
  }
};

guiasController.deleteGuia = async (req, res) => {
  try {
    const { id } = req.params;
    await GuiaDela.findByIdAndRemove(id);
    req.flash("success_msg", "Guía borrada exitosamente");
    res.redirect("/guias/home"); // Redirige a la página de datos después de borrar la guía
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al borrar la guía");
  }
};



guiasController.visualizarGuia = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const guias = await GuiaDela.find({}, 'id carrera asignatura grupo num_estudiantes');

    // Renderiza la plantilla 'guias' y pasa los datos como contexto
    res.render('users/guia1', { guias });
  } catch (error) {
    // Manejo de errores en caso de que la consulta falle
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las guías en la base de datos' });
  }
};




module.exports = guiasController;
