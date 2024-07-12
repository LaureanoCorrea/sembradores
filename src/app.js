const express = require("express");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const routes = require("./routes/index");
const cors = require("cors");
const numeral = require("numeral"); // Importar numeral.js

const app = express();
const port = 3000;

// Configuración de HBS
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Servir archivos estáticos desde la carpeta 'src/public'
app.use(express.static(path.join(__dirname, "public")));

// Registrar el helper personalizado getField
hbs.registerHelper("getField", function (obj, fieldName) {
  return obj[fieldName];
});

// Registrar el helper personalizado sumarValores
hbs.registerHelper("sumarValores", function (productos, campo) {
  let total = 0;
  productos.forEach((producto) => {
    const valor = parseFloat(producto[campo]) || 0;
    total += valor;
  });
  return total.toFixed(2); // Redondear a dos decimales
});

// Registrar el helper para formatear números usando numeral.js
hbs.registerHelper("formatNumber", function (value) {
  if (typeof value === "string") {
    // Intenta convertir la cadena a número
    value = parseFloat(value.replace(",", ".")); // Si los decimales usan coma, cambiarla a punto
  }

  if (typeof value === "number" && !isNaN(value)) {
    return numeral(value).format("0,0.[00]"); // Formatear el número con separadores de miles
  } else {
    return ""; // Devuelve una cadena vacía si el valor no es válido
  }
});

// Conectar a MongoDB
mongoose.connect(
  "mongodb+srv://Sembradores:1212LorienSembradores@cluster0.jelbyuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {}
);

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});
app.use(cors());

// Middleware para analizar bodies de tipo application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware para analizar bodies de tipo application/json
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// Middleware para manejar las rutas definidas en routes/index.js
app.use(routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
