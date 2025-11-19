const express = require("express");
const router = express.Router();

const {
    buscarUsuarios,
    registrarUsuarios,
    loginUser,
    deletarUsuario

} = require('../controllers/usersController');

router.get('/', buscarUsuarios);
router.post('/registrarUsuarios', registrarUsuarios)
router.post('/login', loginUser);
router.delete('/deletarusuarios', deletarUsuario)

module.exports = router;