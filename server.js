const express = require ('express')
const path = require ('path')
const cors = require('cors')
const apiRouter = require('./api/routes/apiRouter')

const app = express ()
require('dotenv').config()



app.use (cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(function (req, res, next) {console.log (req.query + "" + req.url); next() })

app.use ('/app', express.static (path.join (__dirname, '/public')))
app.use('/api', apiRouter)


let port = process.env.PORT || 3000
app.listen (port)