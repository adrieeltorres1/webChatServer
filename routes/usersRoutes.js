const express = require("express");
const router = express.Router();

const {
    buscarUsuarios,
    registrarUsuarios,
    loginUser

} = require('../controllers/usersController');

router.get('/', buscarUsuarios);
router.post('/registrarUsuarios', registrarUsuarios)
router.post('/login', loginUser);

module.exports = router;