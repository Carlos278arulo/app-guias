const mongoose = require("mongoose");

const archivoSchema = new mongoose.Schema({
  archivo: {
    data: Buffer,
    contentType: {
      type: String,
      default: "application/pdf"
    }
  }
}, {
  timestamps: true
});

const Archivo = mongoose.model("Archivo", archivoSchema);

module.exports = Archivo;

 