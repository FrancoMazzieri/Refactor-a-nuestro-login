const productsModel = require('../../models/products')

class MongoProductManager{

    async addProduct(title, description, price, thumbnail, code, stock){
        try {
            await productsModel.create({title, description, price, thumbnail, code, stock})
        } catch (error) {
            console.log(error)
        }
    }

 
    async getProducts(limit, page, filtro){
        try {
            let products = await productsModel.paginate(filtro, {limit: 10, page: page, lean: true})
            console.log(products)
            if (!limit) {
                return products
            }
            return products = await productsModel.paginate(filtro, {limit: limit, page: page, lean: true})
        } catch (error) {
            console.log(error)
        }
    }

    async getProductCant(){
        return productsModel.length
    }

    async getProductById(pid){
        try {
            const data = await productsModel.find()
    
            return data.find(product => product.id == pid)
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(pid, obj){
        try {
            await productsModel.findOneAndReplace({_id: pid}, obj)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(pid){
        try {
            await productsModel.findOneAndDelete({_id: pid})
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = MongoProductManager