const fs = require('fs')

class product {
    #_id = 0
    constructor(title, description, price, thumbnail, code, stock) {

        this._title = title;
        this._description = description;
        this._price = price;
        this._thumbnail = thumbnail;
        this._code = code;
        this._stock = stock;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    get thumbnail() {
        return this._thumbnail;
    }
    set code(value) {
        this._thumbnail = value;
    }
    get code() {
        return this._code;
    }
    set code(value) {
        this._code = value;
    }
    get stock() {
        return this._stock;
    }
    set stock(value) {
        this._stock = value;
    }

}

class ProductManager {

    #ultimoId = 1

    constructor() {
        this.products = []
        this.path = './Productos.txt'
    }
    #getNewId() {
        const id = this.#ultimoId
        this.#ultimoId += 1
        return id

    }

    async addProduct(title, description, price, thumbnail, code, stock) {
       
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {

            return console.log("Complete todos los campos")

        }
        const prods = await this.getProducts()
        const codeValidat = prods.find(prod => prod.code === code)

        if (codeValidat) {
            console.log("El codigo esta repetido")
        }
        else {
            const newProduct = {
                id: this.#getNewId(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }
            this.products.push(newProduct)
        }
        const filecontent = JSON.stringify(this.products, null, '\t')

        await fs.promises.writeFile(this.path, filecontent)

    }
    async getProducts() {
        try {
            const usersFileContent = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(usersFileContent)
        }
        catch (err) {
            return []
        }
    }
    async getProductById(id) {

        let fileContent = fs.promises.readFileSync(this.path, 'utf-8')

        let arreglo = JSON.parse(fileContent)

        const prodById = arreglo.find(prod => prod.id === id)
        if (prodById) {
            console.log(prodById)
        } else {
            console.log("Not found")
        }
    }
    async updateProduct(id, updatedProductData) {

        let fileContent = fs.readFileSync(this.path, 'utf-8')

        let arreglo = JSON.parse(fileContent)

        const index = arreglo.findIndex(prod => prod.id === id)

        if (index === -1) {
            return null;
        }
        updatedProductData._id = id

        arreglo[index] = updatedProductData;

        const newArr = JSON.stringify(arreglo, null, '\t')

        await fs.promises.writeFileSync(this.path, newArr)

        console.log(updatedProductData)

    } catch(error) {
        console.error('Error updating product:', error);
        return null;
    }
    deleteProduct(id) {

        let fileContent = fs.readFileSync(this.path, 'utf-8')
        let arreglo = JSON.parse(fileContent)
        let indice = id - 1

        let filterA = arreglo.splice(indice, 1)

        console.log("Eliminado: ")
        console.log(filterA)

        console.log(arreglo)

        const newArr = JSON.stringify(arreglo, null, '\t')

        fs.writeFileSync(this.path, newArr)
    }

}

const main = async () => {

    const productManager = new ProductManager();


    await productManager.addProduct("Coca", "Gaseosa", 500, "link", 16, 2)
    await productManager.addProduct("Matarazo", "Fideo", 400, "link", 17, 3)
    await productManager.addProduct("Rexona", "Jabón", 250, "link", 1, 4)
    await productManager.addProduct("Head&Shoulders", "shampoo", 1500, "link", 150, 6)

    console.log(await productManager.getProducts())

}



module.exports = ProductManager, product

