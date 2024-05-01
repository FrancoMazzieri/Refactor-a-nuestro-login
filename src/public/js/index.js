// JS del lado del cliente(Browser)

const socket = io()

let submitProduct = document.querySelector('#submitProduct')
let title = document.querySelector('#title')
let description = document.querySelector('#description')
let price = document.querySelector('#price')
let thumbnail = document.querySelector('#thumbnail')
let code = document.querySelector('#code')
let stock = document.querySelector('#stock')

let productID = document.querySelector('#titleDelete')
let deleteBtn = document.querySelector('#deleteProduct')

let contenedor = document.querySelector('#container')

submitProduct.addEventListener('click', (event) => {
    event.preventDefault()

    let product = {
        
        title: title.value,
        description: description.value,
        price: price.value,
        thumbnail: thumbnail.value,
        code: code.value,
        stock: stock.value

    }

    socket.emit('product', product)
})

deleteBtn.addEventListener('click', (event) => {
    event.preventDefault()

    let pid = productID.value

    socket.emit('deleteProduct', pid)
})

socket.on('mensajeServer', data => {
    contenedor.innerHTML = ''

    data.forEach(element => {
        contenedor.innerHTML += `<div>
                                        <h4>${element.title}</h4>
                                        <p>${element.description}</p>
                                        <p>${element.price}</p> 
                                        <p>${element.thumbnail}</p> 
                                        <p>${element.code}</p>                                         
                                        <p>${element.stock}</p>
                                        <p>${element.id}</p> 
                                    </div>
                                   `
    })
})

socket.on('productoAgregado', data => {
    contenedor.innerHTML = ''

    data.forEach(element => {
        contenedor.innerHTML += `<div>
                                        <h4>${element.title}</h4>
                                        <p>${element.description}</p>
                                        <p>${element.price}</p> 
                                        <p>${element.thumbnail}</p> 
                                        <p>${element.code}</p>                                         
                                        <p>${element.stock}</p>
                                        <p>${element.id}</p>                                   
                                </div>`
    })
})

socket.on('prodcutoEliminado', data => {
    contenedor.innerHTML = ''

    data.forEach(element => {
        contenedor.innerHTML += `<div>
                                    <h4>${element.title}</h4>
                                    <p>${element.description}</p>
                                    <p>${element.price}</p> 
                                    <p>${element.stock}</p>                                    
                                </div>`
    })
})