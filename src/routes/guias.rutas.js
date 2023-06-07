const {Router} = require("express");
const router = Router();
const { 
    renderguia1,  
    renderformguia,
    renderdatos,
    renderconsulta,
    deleteGuia,
    visualizarGuia,
    renderspagisubi,

    

} = require("../controllers/guias.controler");

const { isAuthenticated } = require("../helpers/auth");
// Ruta para docente
router.get("/guias/home", renderguia1);
// Ruta para agregar asignatura
router.post("/guias/add", renderformguia);
// Ruta para estudiante
router.get("/guias/datos", renderdatos);
// pagina para subirguias estudiante
router.get("/guias/subirguia", renderspagisubi);
// Ruta para consultar
router.get("/guias/consulta", renderconsulta);

// Ruta para borrar una guía
router.delete("/guias/:id", deleteGuia);

router.get("/guias/view", visualizarGuia);






module.exports = router;
