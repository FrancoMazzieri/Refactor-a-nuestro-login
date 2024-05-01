function vali (req, res, next){
    const { title, description, price, thumbnail, code, stock } = req.body

    if (title == '' || description == '' || price == '' || thumbnail == '' || code == '' || stock) {
        return res.status(401).send('datos invalidos')
    }
    return next()
}

module.exports = vali