let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let iconCart = document.querySelector('.icon-cart');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

let carts = [];

let productList = [];

function addDataToHtml() {
    listProductHTML.innerHTML = ""
    if (productList.length > 0) {
        productList.forEach(product => {
            let newproduct = document.createElement("div")
            newproduct.classList.add("item")
            newproduct.dataset.id = product.id
            newproduct.innerHTML = `<img src=${product.image} alt="">
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newproduct)
        })
    }
}

listProductHTML.addEventListener('click', (e) => {
    let positionClicked = e.target;
    let product_id = positionClicked.parentElement.dataset.id
    addToCart(product_id)
})

function addToCart(product_id) {
    let postitionThisProductInCart = carts.findIndex((value) =>
        value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (postitionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        carts[postitionThisProductInCart].quantity = carts[postitionThisProductInCart].quantity + 1;
    }
    console.log(carts)
    addCartToHMTL()
    addCartToMemory()
}

function addCartToMemory() {
    localStorage.setItem('cart', JSON.stringify(carts))
}

function addCartToHMTL() {
    listCartHTML.innerHTML = "";
    let totalNumber = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalNumber = totalNumber + cart.quantity
            let newCart = document.createElement("div")
            newCart.classList.add("item")
            newCart.dataset.id = cart.product_id
            let positionProduct = productList.findIndex((value) => value.id == cart.product_id);
            let info = productList[positionProduct];
            newCart.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * cart.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.appendChild(newCart)
            iconCartSpan.innerHTML = totalNumber
        })
    }
}
listCartHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = "minus";
        if (positionClick.classList.contains("plus")) {
            type = "plus"
        }
        changeQuantity(product_id, type);
    }
})

function changeQuantity(product_id, type,) {
    let positionItemInCart = carts.findIndex((value) => value.product_id = product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case "plus":
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                    iconCartSpan.innerHTML = 0

                }
                break;
        }

        addCartToMemory()
        addCartToHMTL()
    }
}

async function productFetch() {
    const response = await fetch("product.json");
    const data = await response.json();
    productList = data;
    addDataToHtml()

    if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"))
        addCartToHMTL()
    }
}

productFetch()