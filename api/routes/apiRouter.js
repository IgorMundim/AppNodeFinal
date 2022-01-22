const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let apiRouter = express.Router()

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

let checkUser = (req, res, next) => {
    //localiza o usuário no banco de dados

    //valida a informação (senha | token) passada
    let authToken = req.headers["authorization"]

    if (!authToken) {
        res.status(401).json({ "messageAlert": "Token requerida" })
        return
    } else {
        let token = authToken.split(" ")[1]
        req.token = token

        jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ "messageAlert": "Acesso negado" })
                return
            }
            req.usuarioId = decodeToken.id
            next()
        })
    }
}

let isAdmin = (req, res, next) => {
    knex
        .select("*")
        .from("usuario")
        .where({ id: req.usuarioId })
        .then(usuarios => {
            if (!usuarios.length) {
                res.status(401).json({ "messageAlert": "Acesso negado" })
                return
            }

            let usuario = usuarios[0]
            let roles = usuario.roles.split(";")
            let adminRole = roles.find(i => i === 'ADMIN')
            if (adminRole === 'ADMIN') {
                next()
                return
            } else {
                res.status(403).json({ "messageAlert": "Acesso restrito a administradores" })
            }
        })
}


let userNameIsAvailable = (req, res, next) => {
    knex
        .select("*")
        .from("usuario")
        .where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                res.status(200).json({ "messageAlert": `O nome de usuário ${req.body.login} não está disponível.` })
                return
            } else {
                next()
                return
            }
        })
}


let emailIsAvailable = (req, res, next) => {
    knex
        .select("*")
        .from("usuario")
        .where({ email: req.body.email })
        .then(usuarios => {

            if (usuarios.length) {
                res.status(200).json({ "messageAlert": `O e-mail ${req.body.email} já está em uso.` })
                return
            } else {
                next()
                return
            }
        })
}




let endpoint = '/'


apiRouter.post(endpoint + 'seguranca/register', userNameIsAvailable, emailIsAvailable, (req, res) => {

    knex('usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email
        })
        .then((result) => {

            res.status(200).json({
                "messageAlert": "Usuário cadastrado com sucesso"})
            return
        })
        .catch(err => {
            res.status(500).json({
                messageAlert: 'Erro ao registrar usuario - ' + err.message
            })
        })
})

apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    
    knex
        .select('*').from('usuario')
        .where({ login: req.body.login })
        .then(usuarios => {
            // if (usuarios.length) {
            //     let usuario = usuarios[0]
            //     let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
            //     console.log("aqui")
            //     if (checkSenha) {
            //         var tokenJWT = jwt.sign({ id: usuario.id },
            //             process.env.SECRET_KEY,
            //             {
            //                 expiresIn: 3600
            //             })
            //         res.status(200).json({
            //             messageAlert: null,
            //             token: tokenJWT
            //         })
            //         return
            //     }
            // }
            res.status(200).json({ messageAlert: 'Login ou senha incorretos' })
        }).catch(err => {
            res.status(500).json({ messageAlert: 'Erro ao verificar login - ' + err.message })
        })
})


// API Produtos
apiRouter.get(endpoint + 'produtos', (req, res) => {
    knex
        .select('*')
        .from('produto')
        .then(produtos => res.status(200).json(produtos))
})



apiRouter.get(endpoint + 'produtos/:id', (req, res) => {

    knex
        .select('*')
        .from('produto')
        .where({ id: req.params.id })
        .then(produtos => {
            if (produtos.length) {
                let produto = produtos[0]
                res.status(200).json(produto)
            }
            else {
                res.status(404).json({ messageAlert: "Item não localizado" })
            }
        })
        .catch(err => res.status(500).json(
            { messageAlert: "Item não localizado" + err.message }))

})

apiRouter.post(endpoint + 'produtos',checkUser, (req, res) => {
    knex('produto')
        .insert({
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca
        }, ['id', 'descricao', 'valor', 'marca'])
        .then((result) => {
            let produto = result[0]
            res.status(200).json({
                "id": produto.id,
                "descricao": produto.descricao,
                "valor": produto.valor,
                "marca": produto.marca,
                "messageAlert": "inserido com sucesso!"
            })
            return
        })
        .catch(err => {
            res.status(500).json({ messageAlert: "Erro ao inserir produto -" + err.message })
        })

})

apiRouter.put(endpoint + 'produtos/:id',checkUser, (req, res) => {
    knex('produto')
        .where({ id: req.params.id })
        .update({
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca
        }).then(() => res.status(200).json(
            { messageAlert: "Item alterado com sucesso!" }))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})

apiRouter.delete(endpoint + 'produtos/:id', checkUser, isAdmin, (req, res) => {
    knex('produto')
        .where({ id: req.params.id })
        .del()
        .then(() => res.status(200).json(
            { messageAlert: "Item excluido com sucesso" }))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})

module.exports = apiRouter