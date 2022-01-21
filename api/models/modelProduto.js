const res = require('express/lib/response')

const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
})

getProdutos(){
    knex
    .select('*')
    .from('produto')
    .then(produtos => res.status(200).json(produtos))
}