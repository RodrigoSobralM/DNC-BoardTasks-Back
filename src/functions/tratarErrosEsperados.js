const S = require('string')

function tratarErrosEsperados(res, err) {
    // qnd o mongoose der algum erro
    if(String(err).includes(`ValidationError:`)) {
        return res.status(400).json({
            status: "Erro",
            StatusMensagem: S(String(err).replace("ValidationError: ", "")).replaceAll(':', '').s,
            resposta: String(err)
        })
    }

    // pode ser um erro definido manualmente por mim
    if (String(err).includes(`Error:`)) {
        return res.status(400).json ({
            status: "Erro",
            StatusMensagem: String(err).replace("Error: ", ""),
            resposta: String(err)
        })
    }

    // erro inesperado 
    console.error(err)
    return res.status(500).json({
        status: "Erro",
        StatusMensagem: "Houve um problema inesperado, tente novamente mais tarde.",
        resposta: String(err)
    })
}

module.exports = tratarErrosEsperados