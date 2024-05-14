const { Router } = require('express')
const userVali = require('../middleware/userValidation')

const MongoUserManager = require('../dao/mongo/MongoUserManager')
const MongoProductManager = require('../dao/mongo/mongoProductManager')

const Bcrypt = require('../ultis/bcrypt.js')
const products = require('../models/products.js')

const router = Router()

const mongoUserManager = new MongoUserManager
const mongoProductManager = new MongoProductManager

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})


router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const { limit = 10, page = 1, query } = req.query
    let filtro = {}
    query ? filtro = { category: query } : filtro = {}
    try {
        let user = await mongoUserManager.getUser(username)
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await mongoProductManager.getProducts(limit, page, filtro)
        let datos = {
            productos: docs,
            user: {
                firstName: user.first_name,
                lastName: user.last_name,
                age: user.age,
                email: user.email
            },
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query
        }

        if (!user) {
            res.send({ status: 'error', message: 'Usuario no existe' })
        }

        /*if(!Bcrypt.isValidPassword(user, password)){
            res.send({status: 'error', message: 'Contraseña incorrecta'})
        }*/

        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
            res.render('home', datos)
            //res.redirect('http://localhost:8080/products')

        } else {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.render('home', datos)
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (!err) res.redirect('http://localhost:8080/auth')
            else res.send({ status: 'Logout error', message: err })
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', userVali, async (req, res) => {
    const { first_name, last_name, age, roll = 'user', email, password } = req.body
    let user = { first_name, last_name, age, roll, email, password: Bcrypt.createHash(password) }

    try {
        let exist = await mongoUserManager.getUser(email)

        if (exist) {
            res.send({ status: 'error', message: 'El usuario ya existe' })
        } else {
            await mongoUserManager.addUser(user)
            res.redirect('http://localhost:8080/auth')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router