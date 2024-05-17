/*const bcrypt = require('bcrypt')

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

module.exports = createHash, isValidPassword*/

const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: value => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),

    isValidPassword: (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword)
}