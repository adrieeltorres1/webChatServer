const User = require('../models/Users');

const models = require('../models/Users');


async function registrarUsuarios(req, res) {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        }

        const novoUsuario = await User.create({
            username,
            password
        });

        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: novoUsuario
        });

    } catch (error) {
        res.status(400).json({
            error: 'Falha ao criar usuário',
            message: error.message
        });
    }
}


async function buscarUsuarios(req, res) {
    try {
        const usuarios = await models.find();
        res.status(200).json(usuarios);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
    }
}


module.exports = {
    buscarUsuarios,
    registrarUsuarios
}