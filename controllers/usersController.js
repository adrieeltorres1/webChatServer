const User = require('../models/Users');
const models = require('../models/Users');
const bcrypt = require('bcryptjs');


async function registrarUsuarios(req, res) {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const novoUsuario = await User.create({
            username,
            password: hashedPassword
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

//Aqui eu to comparando e facilitando para o front entender as senhas que são digitas. 
//Após serem Digitas minha função LoginUser compara com a senha
//digitar com a hash que fica no BD. 

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta.' });
        }
        res.status(200).json({ 
            message: `Login bem-sucedido! Bem-vindo, ${user.username}`,
            userId: user._id, 
            username: user.username 
        });

    } catch (error) {
        res.status(500).send(`Erro no servidor: ${error.message}`);
    }
};


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
    registrarUsuarios,
    loginUser
}