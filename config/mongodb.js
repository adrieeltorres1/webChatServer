const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        const conectado = await mongoose.connect(process.env.DATABASE_URL);
        console.log('Banco de dados conectado!')
    } catch (error) {
       console.error(`Deu erro ao se conectar ao MongoDB, erro: ${error.message}`);
    }
};

module.exports = connectMongo;




