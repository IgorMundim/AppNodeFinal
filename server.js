require('dotenv').config()
// Importação 
const express = require ('express')
const path = require ('path')
const cors = require('cors')
const apiRouter = require('./api/routes/apiRouter')

//Inicialização do express
const app = express ()
require('dotenv').config()



app.use (cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Middleware para gerar log de requisições
app.use(function (req, res, next) {console.log (req.query + "" + req.url); next() })

// Instancia as rotas em outro ambiente desafogando a script atual
app.use ('/app', express.static (path.join (__dirname, '/public')))
app.use('/api', apiRouter)

let port = process.env.PORT || 3000
app.listen (port)