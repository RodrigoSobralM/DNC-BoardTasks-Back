const mongoose = require("mongoose");
const validator = require("validator");

const esquema = mongoose.Schema(
    {
        nome: {
            type: String,
            required: 'é obrigatório !',
        },
        email: {
            type: String,
            unique: true,
            required: 'é obrigatório !',
            lowercase: true,
            index: true,
            validate: {
                validator: (valorDigitado) => { return validator.isEmail(valorDigitado) },
                mansagem: 'inválido!'
            }
        },
        senha: {
            type: String,
            required: 'é obrigatório!',
            Select: false,
        },

    },
    {
        timestamps: true
    },
);

const EsquemaUsuario = mongoose.models.Usuario || mongoose.model('Usuario', esquema);
module.exports = EsquemaUsuario
