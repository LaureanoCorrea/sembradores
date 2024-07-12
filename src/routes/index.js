const express = require('express');
const router = express.Router();
const OrderRoutes = require('./orders');
const uploadRoutes = require('./upload');

// Ruta principal del formulario de carga
router.get('/uploads', (req, res) => {
  res.render('uploads'); // Renderiza la vista 'uploads.hbs'
});

// Middleware para manejar rutas de subida de archivos
router.use('/upload', uploadRoutes);
router.use('/orders', OrderRoutes);

module.exports = router;