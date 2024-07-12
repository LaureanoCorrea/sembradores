const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailSchema = new Schema({
  "Codigo de Producto": { type: String, required: true },
  "Nombre de Producto": { type: String, required: true },
  "Cantidad Unidades": { type: Number, required: true },
  Puntos: { type: Number, required: true },
  "Precio Público": { type: Number, required: true },
  "Precio x Unidades": { type: Number, required: true },
  "Precio x Nivel / Categoria": { type: Number, required: true },
  Ganancia: { type: Number, required: true },
});

const OrderSchema = new Schema({
  "Número de Pedido": { type: Number, required: true },
  Detalles: [DetailSchema],
});

const AsesorSchema = new Schema({
  "Nivel de Alianza Categoria": { type: String, required: true },
  Asesor: { type: String, required: true },
  Pedidos: [OrderSchema],
});

const DocumentsSchema = new Schema({
  Timestamp: { type: Date, default: Date.now },
  ciclo: { type: Number, required: true }, 
  semana: { type: Number, required: true },
  Asesores: [AsesorSchema],
});

const Data = mongoose.model("Data", DocumentsSchema);

module.exports = Data;
