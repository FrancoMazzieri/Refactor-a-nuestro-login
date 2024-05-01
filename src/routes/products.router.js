const { Router } = require('express')
const productsModel = require('../models/products')
const MongoProductManager = require('../dao/mongo/mongoProductManager')
const vali = require('../middleware/validation')

const ProductRouter = Router();

const mongoProductManager = new MongoProductManager()

const leerProductos = mongoProductManager.getProducts()

ProductRouter.get('/', async (req, res) => {
    const { limit, page = 1 } = req.query       // se recibe limit del query
    try {
        let data = await mongoProductManager.getProducts()

        res.send(data.docs)
    } catch (error) {
        console.log(error)
    }
})

ProductRouter.get('/:pid', async (req, res) => {
    const { pid } = req.query        // se recibe pid de los parametros
    try {
        const allProducts = await mongoProductManager.getProducts()
        const productById = await mongoProductManager.getProductById(pid)

        pid ? res.send(productById) : res.send(allProducts)
    } catch (error) {
        console.log(error)
    }
})

ProductRouter.post('/', vali, async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body

        try {
            await mongoProductManager.addProduct(title, description, price, thumbnail, code, stock)

            res.send({ aviso: "producto agregado" })
        } catch (error) {
            console.log(error)
        }
    
})

ProductRouter.put('/:pid', vali, async (req, res) => {
    const { pid } = req.params
    const { title, description, price, thumbnail, code, stock } = req.body

        let obj = { title, description, price, thumbnail, code, stock }
        try {
            await mongoProductManager.updateProduct(pid, obj)

            res.send({ aviso: "producto actualizado" })
        } catch (error) {
            console.log(error)
        }
    
})

ProductRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params        // se recibe pid de los parametros

    try {
        await mongoProductManager.deleteProduct(pid)

        res.send({ aviso: "producto eliminado" })
    } catch (error) {
        console.log(error)
    }
})

module.exports = ProductRouter;