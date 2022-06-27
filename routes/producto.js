const express = require('express');
const router = express.Router();


const productoController = require('../controllers/productoController');
const { adminAuth, userAuth, verifyToken } = require("../middleware/auth");

router.get('/',productoController.obtener);
router.post('/create', productoController.crear);
router.post('/add',[verifyToken,adminAuth],productoController.agregarProducto);
router.delete('/:id',[verifyToken,adminAuth], productoController.eliminar);
router.put('/edit/:id',[verifyToken,adminAuth], productoController.editar);
router.get('/edit/:id', productoController.obtenerProducto);
router.get('/misproductos',[verifyToken,adminAuth], productoController.misProductos);
module.exports = router;
