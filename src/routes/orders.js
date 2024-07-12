const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAdvisorNames);
router.get('/:id', orderController.getOrderDetails);
router.put('/edit/:asesorId/:pedidoId/:productId', orderController.editProductQuantity);



module.exports = router;
