const express = require("express");
const conectarBancoDados = require("../middlewares/conectarBD");
const tratarErrosEsperados = require("../functions/tratarErrosEsperados");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const EsquemaUsuario = require("../models/usuario");
const authUser = require("../middlewares/authUser");
const router = express.Router();

/* GET users listing. */
router.post("/criar", conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { nome, email, senha } = req.body;
    const numeroVezesHash = 10;
    const senhaHash = await bcrypt.hash(senha, numeroVezesHash);
    const respostaDB = await EsquemaUsuario.create({
      nome,
      email,
      senha: senhaHash,
    });

    res.status(200).json({
      status: "OK",
      StatusMensagem: 'Usuário criado com sucesso',
      resposta: respostaDB,
    });
  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.post("/logar", conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { email, senha } = req.body;
    let respostaBD = await EsquemaUsuario.findOne({ email }).select('+senha')
    if (respostaBD) {

      let senhaCorreta = await bcrypt.compare(senha, respostaBD.senha)
      if (senhaCorreta) {

        let token = jwt.sign({ id: respostaBD._id }, process.env.JWT_SECRET, { expiresIn: '1d'})

        res.header('x-auth-token', token)
        res.status(200).json({
          status: 'OK',
          mensagem: 'Usuário autenticado com sucesso',
          resposta: {'x-auth-token': token},
        })
      } else {
        throw new Error('Email ou senha incorreta')
      }
    } else {
      throw new Error('Email ou senha incorreta')
    }
  } catch (err) {
    return tratarErrosEsperados(res, err);
  }
});

module.exports = router;
