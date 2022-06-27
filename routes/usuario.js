const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const { adminAuth, userAuth, verifyToken } = require("../middleware/auth");

//router.post('/create', usuarioController.crear);
router.get('/',[verifyToken,userAuth], usuarioController.obtener);
router.delete('/:id', usuarioController.eliminar);
router.get('/edit/:id',usuarioController.obtenerUsuario);
router.put('/edit/:id',usuarioController.editarDatosPersonales);
router.get('/miperfil',[verifyToken,adminAuth], usuarioController.miperfil);

module.exports = router;
