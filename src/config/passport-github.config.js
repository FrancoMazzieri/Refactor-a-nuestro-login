const passport = require('passport')
const { Strategy } = require('passport-github2')
const User = require('../models/user')
const { clientID, clientSecret, callbackURL } = require('./github.private')

const initializeStrategy = () => {
    
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            console.log(profile)

            const user = await User.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }

            // crear el usuario, ya que no existe
            const newUser = {
                firstName: profile._json.name,
                lastName: '',
                age: 30,
                email: profile._json.email,
                password: ''
            }
            const result = await User.create(newUser)
            done(null, result)
        }
        catch (err) {
            done(err)
        }
    }))
    // estrategia para el registro de usuarios
    passport.use('register', new Strategy({
        passReqToCallback: true, // habilitar el parámetro "req" en el callback de abajo
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email } = req.body

        try {
            const user = await User.findOne({ email: username })
            if (user) {
                console.log('User already exists!')

                // null como 1er argumento, ya que no hubo error
                // false en el 2do argumento, indicando que no se pudo registrar
                return done(null, false)
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: createHash(password)
            }
            const result = await User.create(newUser)

            // registro exitoso
            return done(null, result)
        }
        catch (err) {
            done(err)
        }

    }))
    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username })
            if (!user) {
                console.log('User not found!')
                return done(null, false)
            }

            if (!isValidPassword(user, password)) {
                return done(null, false)
            }

            return done(null, user)
        }
        catch (err) {
            done(err)
        }
    }))
}

passport.serializeUser((user, done) => {
    console.log('serialized!', user)
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    console.log('deserialized!', id)
    const user = await User.findById(id)
    done(null, user)
})


module.exports = initializeStrategy