const mongoose = require("mongoose");

const guiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
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
  guia: {
    data: Buffer,
    contentType: {
      type: String,
      default: "application/pdf"
    }
  }
}, {
  timestamps: true
});

const Guia = mongoose.model("Guia", guiaSchema);

module.exports = Guia;
