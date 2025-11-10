const express = require("express");
const router = express.Router();

const {
    buscarUsuarios,
    buscarUmUsuario

} = require('../controllers/usersController');

router.get('/', buscarUsuarios);

router.get('/buscarUmUsuario', buscarUmUsuario);

module.exports = router;