const { Router } = require('express')
const ProductManager = require('../dao/fileSystem/productmanager')
const MongoProductManager = require('../dao/mongo/mongoProductManager')
const MongoCartManager = require('../dao/mongo/mongoCartManager')
const chatModel = require('../models/chat')
const auth = require('../middleware/auth')

const mongoProductManager = new MongoProductManager()
const mongoCartManager = new MongoCartManager()

const productManager = new ProductManager()
const route = new Router()

route.get('/products', auth,async (req, res)=>{

    const {limit = 10 , page = 1, query} = req.query
    let filtro = {}
    query? filtro = {category: query} : filtro = {}
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoProductManager.getProducts(limit, page, filtro)
        
        let datos = {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query
        }
        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }
})
route.get('/carts/:cid', async (req, res)=>{
    const {cid} = req.params
    const {limit = 1 , page = 1} = req.query
    console.log(limit)
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoCartManager.getCartProducts(cid, limit, page)
        let data = docs[0].products
        let datos = {
            productos: data,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit
        }
        res.render('carts', datos)
    } catch (error) {
        console.log(error)
    }
})


route.get('/realTimeProducts', async (__, res) => {
    try {

        res.render('realTimeProducts', {
            title: 'Websockets',
            useWS: true,
            scripts: [
                'index.js'
            ]
        })
    } catch (error) {
        console.log(error)
    }

})
route.get('/chat', (req, res) => {
    res.render('chat')
})

module.exports = route;