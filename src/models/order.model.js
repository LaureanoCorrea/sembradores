const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  asesor: { type: String, required: true },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;