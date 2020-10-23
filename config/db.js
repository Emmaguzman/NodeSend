const mongoose = require('mongoose')
require('dotenv').config();

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true,
                useCreateIndex: true,
                useFindAndModify:false
            });
            console.log("DB CONECTADA")
    } catch (error) {
        console.log("TENEMOS UN ERROR:", error);
        process.exit(1);
    }
}

module.exports = conectarDB;