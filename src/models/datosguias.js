const mongoose = require('mongoose');

const guiasdelabSchema = new mongoose.Schema({
  carrera: {
    type: String,
    required: true
  },
  asignatura: {
    type: String,
    required: true
  },
  grupo: {
    type: String,
    required: true
  },
  num_estudiantes: {
    type: Number,
    required: true
  },
  
}, {
  timestamps: true
});

const GuiaDelabModel = mongoose.model('GuiaDelab', guiasdelabSchema);

module.exports = GuiaDelabModel;
