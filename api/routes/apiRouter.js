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
let checkLogin = (req, res, next) => {
    //localiza o usuário no banco de dados

    //valida a informação (senha | token) passada
    let authToken = req.headers["authorization"]

    if (!authToken) {
        res.status(401).json({ "messageAlert": "Efetue login para uma melhor experiência!" })
        return
    } else {
        let token = authToken.split(" ")[1]
        req.token = token

        jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ "messageAlert": "Efetue login para uma melhor experiência!" })
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

let isAdm = (req, res, next) => {
    knex
        .select("*")
        .from("usuario")
        .where( { login: req.body.login })
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

let idIsAvailable = (req, res, next) => {
    knex
        .select("*")
        .from("extrato")
        .where({ id: req.body.id })
        .then(extratos => {

            if (extratos.length) {
                res.status(200).json({ "messageAlert": `O código ${req.body.id} já está em uso!` })
                return
            } else {
                next()
                return
            }
        })
}

let idNotAvailable = (req, res, next) => {
    knex
        .select("*")
        .from("extrato")
        .where({ id: req.params.id})
        .then(extratos => {

            if (extratos.length) {
                next()
                return
            } else {
                res.status(200).json({ "messageAlert": `O código ${req.params.id} não existe!` })
                return
            }
        })
}

let idUserNotAvailable = (req, res, next) => {
    knex
        .select("*")
        .from("usuario")
        .where({ id: req.params.id})
        .then(usuarios => {

            if (usuarios.length) {
                next()
                return
            } else {
                res.status(200).json({ "messageAlert": `O código ${req.params.id} não existe!` })
                return
            }
        })
}

let endpoint = '/'

//API Usuario
apiRouter.get(endpoint + 'usuarios', isAdm, (req, res) => {
    knex
        .select('id', 'nome', 'email', 'login', 'roles')
        .from('usuario')
        .then(usuarios => res.status(200).json(usuarios))
})

apiRouter.put(endpoint + 'usuarios/:id', isAdm, idUserNotAvailable, (req, res) => {
    knex('usuario')
        .where({ id: req.params.id })
        .update({
            nome: req.body.nome,
            login: req.body.login,
            email: req.body.email,
            roles: req.body.roles
        }).then(() => res.status(200).json(
            { messageAlert: "Usuário alterado com sucesso!"}))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})

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
                "messageAlert": "Usuário cadastrado com sucesso!"
            })
            return
        })
        .catch(err => {
            res.status(500).json({
                messageAlert: 'Erro ao registrar usuario - ' + err.message
            })
        })
})
apiRouter.delete(endpoint + 'usuarios/:id',isAdm, idUserNotAvailable, (req, res) => {
    knex('usuario')
        .where({ id: req.params.id })
        .del()
        .then(() => res.status(200).json(
            { messageAlert: "Item excluido com sucesso" }))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})
apiRouter.post(endpoint + 'seguranca/login', (req, res) => {

    knex
        .select('*').from('usuario')
        .where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    let tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: 3600
                        })
                    res.status(200).json({
                        messageAlert: null,
                        token: tokenJWT
                    })
                    return
                }
            }
            res.status(200).json({ messageAlert: 'Login ou senha incorretos' })
        }).catch(err => {
            res.status(500).json({ messageAlert: 'Erro ao verificar login - ' + err.message })
        })
})

apiRouter.post(endpoint + 'seguranca/login/admin', isAdm, (req, res) => {

    knex
        .select('*').from('usuario')
        .where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    let tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: 3600
                        })
                    res.status(200).json({
                        messageAlert: null,
                        token: tokenJWT
                    })
                    return
                }
            }
            res.status(200).json({ messageAlert: 'Login ou senha incorretos' })
        }).catch(err => {
            res.status(500).json({ messageAlert: 'Erro ao verificar login - ' + err.message })
        })
})

// API Contato
apiRouter.post(endpoint + 'contatos', checkUser, (req, res)  => {
    knex('contato')
        .insert({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            mensagem: req.body.mensagem
        })
        .then((result) => {
            res.status(200).json({
                "messageAlert": "inserido com sucesso!"
            })
            return
        })
        .catch(err => {
            res.status(500).json({ messageAlert: "Erro ao inserir mensagem"})
        })

})
// API Extrato
apiRouter.get(endpoint + 'extratos', checkLogin, (req, res) => {
    knex
        .select('*')
        .from('extrato')
        .then(extratos => res.status(200).json(extratos))
})

apiRouter.get(endpoint + 'extrato/entrada', checkLogin,  (req, res) => {
     knex('extrato')
         .where('valor','>','0')
        .then(extratos => res.status(200).json(extratos))
})

apiRouter.get(endpoint + 'extrato/saida', checkLogin,  (req, res) => {
    knex('extrato')
        .where('valor','<','0')
       .then(extratos => res.status(200).json(extratos))
})


apiRouter.get(endpoint + 'extratos/:id', checkLogin, (req, res) => {

    knex
        .select('*')
        .from('extrato')
        .where({ id: req.params.id })
        .then(extratos => {
            res.status(200).json(extratos)
        })
        .catch(err => res.status(500).json(
            { messageAlert: "Item não localizado" + err.message }))

})

apiRouter.post(endpoint + 'extratos',checkUser, idIsAvailable, (req, res)  => {
    knex('extrato')
        .insert({
            id: req.body.id,
            datacompra: req.body.datacompra,
            descricao: req.body.descricao,
            valor: req.body.valor,
            detalhes: req.body.detalhes
        })
        .then((result) => {
            res.status(200).json({
                "messageAlert": "inserido com sucesso!"
            })
            return
        })
        .catch(err => {
            res.status(500).json({ messageAlert: "Erro ao inserir extrato código indisponivel"})
        })

})

apiRouter.put(endpoint + 'extratos/:id', checkUser, isAdmin, idNotAvailable, (req, res) => {
    knex('extrato')
        .where({ id: req.params.id })
        .update({
            datacompra: req.body.datacompra,
            descricao: req.body.descricao,
            valor: req.body.valor,
            detalhes: req.body.detalhes
        }).then(() => res.status(200).json(
            { messageAlert: "Item alterado com sucesso!"}))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})

apiRouter.delete(endpoint + 'extratos/:id', checkUser, isAdmin, idNotAvailable, (req, res) => {
    knex('extrato')
        .where({ id: req.params.id })
        .del()
        .then(() => res.status(200).json(
            { messageAlert: "Item excluido com sucesso" }))
        .catch(err => res.status(200).json(
            { messageAlert: "Erro no servidor -" + err.message }))
})

module.exports = apiRouter