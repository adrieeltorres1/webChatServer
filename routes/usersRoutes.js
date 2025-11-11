const express = require("express");
const router = express.Router();

const {
    buscarUsuarios,
    registrarUsuarios

} = require('../controllers/usersController');

router.get('/', buscarUsuarios);
router.post('/registrarUsuarios', registrarUsuarios)

module.exports = router;