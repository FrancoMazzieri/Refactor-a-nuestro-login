const { Router } = require('express')
const userVali = require('../middleware/userValidation')
const MongoUserManager = require('../dao/mongo/MongoUserManager')
const bcrypt = require('../ultis/bcrypt.js')

const router = Router()

const mongoUserManager = new MongoUserManager

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        
        let user = await mongoUserManager.getUser(username)

        if (!user) {
            res.send({status: 'error', message: 'Usuario no existe'})
        }

        if(!bcrypt.isValidPassword(user, password)){
            res.send({status: 'error', message: 'Contraseña incorrecta'})
        }

        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if(!err) res.redirect('http://localhost:8080/auth')
            else res.send({status:'Logout error', message: err})
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', userVali, async (req, res)=>{
    const { first_name, last_name, age, roll = 'user', email, password } = req.body
    let user = { first_name, last_name, age, roll, email, password: bcrypt.createHash(password) }

    try {
        let exist = await mongoUserManager.getUser(email)
        
        if(exist) {
            res.send({status:'error', message: 'El usuario ya existe'})
        }else{
            await mongoUserManager.addUser(user)
            res.redirect('http://localhost:8080/auth')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router