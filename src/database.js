
//SE CONECTA EL SERVER CON MONGO DB
const mongoose = require("mongoose");

const { NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE } = process.env;

const MONGODB_URI = 'mongodb+srv://manglar:manglar278@basemanglar.xwyvfix.mongodb.net/?retryWrites=true&w=majority';



mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(db => console.log("DB Mongo is connected"))
  .catch(err => console.error(err));


