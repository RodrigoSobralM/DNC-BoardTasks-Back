const jwt = require('jsonwebtoken')
const tratarErrosEsperados = require('../functions/tratarErrosEsperados')

async function authUser(req, res, next) {
    const token = req.header('x-auth-token')

    if(!token) {
        return tratarErrosEsperados(res, new Error('Token de autenticação não fornecido'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuarioJwt = decoded;

        next();

    } catch (error) {
        console.error(error);
        return tratarErrosEsperados(res, new Error('Token de autenticação invalido'));
    }
    
}

module.exports = authUser