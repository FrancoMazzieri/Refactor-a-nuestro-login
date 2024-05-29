const { Router } = require('express')
const userVali = require('../middleware/userValidation')

const passport = require('passport')

const MongoUserManager = require('../dao/mongo/MongoUserManager')
const MongoProductManager = require('../dao/mongo/mongoProductManager')

const Bcrypt = require('../ultis/bcrypt')

const router = Router()

const mongoUserManager = new MongoUserManager
const mongoProductManager = new MongoProductManager

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    console.log(req.body)
    req.session.user = {
        id: req.user._id,
        email: req.user.email
    }

    // no es necesario validar el login aquí, ya lo hace passport!
    res.redirect('/')
})

/*router.post('/login', async (req, res) => {
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

        if (!Bcrypt.isValidPassword(password, user.password)) {
            res.send({ status: 'error', message: 'Contraseña incorrecta' })
        }

            res.render('home', datos)
        
    } catch (error) {
        console.log(error)
    }
})*/

router.get('/faillogin', (req, res) => {
    res.send({ status: 'error', message: 'Login failed!' })
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


// agregamos el middleware de passport para el register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), (req, res) => {
    console.log(req.body)
    // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
    res.redirect('/')
})

router.get('/failregister', (req, res) => {
    res.send({ status: 'error', message: 'Register failed!' })
})

/*router.post('/register', async (req, res) => {
    const { first_name, last_name, age, roll = 'user', email, password } = req.body
    let user = {
        first_name,
        last_name,
        age,
        roll,
        email,
        password: Bcrypt.hashPassword(password)
    }

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
})*/

module.exports = router