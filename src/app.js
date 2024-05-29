const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')

const productRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')
const viewsRouter = require('./routes/views.router')
const loginRouter = require('./routes/login.router')

const ProductManager = require('./dao/fileSystem/productmanager')

const { Server, Socket } = require('socket.io')
const dbConnection = require('./config/dbConnection')
const chatModel = require('./models/chat')

const passport = require('passport')
const initializeStrategy = require('./config/passport.config')

const productManager = new ProductManager()

const app = express()

dbConnection()


app.use(session({
    secret: 'adasd127812be',
    resave: true,
    saveUninitialized: true
}));
// inicializamos Passport
initializeStrategy()
app.use(passport.initialize())
app.use(passport.session())

//configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//
app.use(express.static(`${__dirname}/./public`))

//permitir envio de informacion mediante formularios y json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', viewsRouter)
app.use('/auth', loginRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

const PORT = 8080

const httpserver = app.listen(PORT, () => {
    console.log(`Expres por local host ${httpserver.address().port}`)
})


httpserver.on("Error", (error) => {
    console.log(`Error del servidor ${error}`)
})

const wsServer = new Server(httpserver)

let productos
let mensajes

wsServer.on('connection', async (clientSocket) => {
    console.log(`Cliente conectado, ID: ${clientSocket.id}`)
    try {

        productos = await productManager.getProducts()

        mensajes = await chatModel.find()
        clientSocket.emit('mensajeServer', productos)
        clientSocket.emit('mensajesChat', mensajes)
    } catch (error) {
        console.log(error)
    }

    clientSocket.on('product', async data => {
        console.log('data: ', data)
        const {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        } = data

        if (title == '' || description == '' || price == '' || thumbnail == '' || code == '' || stock == '') {
        } else {
            try {
                await productManager.addProduct(title, description, price, thumbnail, code, stock)
                let datos = await productManager.getProducts()
                wsServer.emit('productoAgregado', datos)
            } catch (error) {
                console.log(error)
            }
        }
    })

    clientSocket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProducts()
            wsServer.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })

    clientSocket.on('msg', async data => {
        console.log(data);
        try {
            await chatModel.insertMany(data)
            let datos = await chatModel.find()
            wsServer.emit('newMsg', datos)
        } catch (error) {
            console.log(error)
        }
    })


})