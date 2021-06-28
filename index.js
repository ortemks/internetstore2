let productsInformation = JSON.parse(`
[
    {
        "image":"images/boot.png",
        "name":"ботинок",
        "price":"350",
        "description":"да, он один"
    },
    {
        "image":"images/display.png",
        "name":"монитор",
        "price":"12000",
        "description":"этот монитор точно обеспечит вас полным спектром лгбт гаммы"
    },
    {
        "image":"images/fortynine.png",
        "name":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero voluptate atque nemo quo, magnam quam ",
        "price":"57",
        "description":"8 гривен за хостинг"
    },
    {
        "image":"images/nightstand.png",
        "name":"тумбочка сапфировая",
        "price":"530835",
        "description":"очень редкая и очень дорогая"
    },
    {
        "image":"images/obama.png",
        "name":"Барак Александрович",
        "price":"2",
        "description":"сейчас не 18 век, но все же..."
    },
    {
        "image":"images/pan.png",
        "name":"кастрюля",
        "price":"990",
        "description":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero voluptate atque nemo quo, magnam quam eligendi sit necessitatibus possimus saepe, amet illo, non cumque nam adipisci eius! Illo, recusandae ea."
    }
]
    `);
document.addEventListener('click', (e) => {console.log(e.target)})
class Store{
    addAllProducts(){
        productsInformation.forEach(function(productinformation, number){
            let product = new Product(productinformation);
            product.id = number + 1;
            document.querySelector('.containerforproducts').append(product.createProduct());
        })
    }
    basket = new Basket();
    addAllAboutBasket(){
        this.basket.basketIcon();
        this.basket.basketExit();
        this.basket.cleanBasket();
        this.basket.setBasketArray();
    }
    hidePopup(){
        document.querySelector('.popupbackground').style.display = 'none';
    }
    addAllAboutPopup(){
        document.querySelector('.popupbackground').addEventListener('click', () => this.hidePopup());
        document.querySelector('.buybuttoncontainer>button').addEventListener('click', () => this.basket.addProductToBasket());
    }
}
class Product{
    constructor(options) {
        this.image = options.image;
        this.name = options.name;
        this.price = options.price;
        this.description = options.description;
    }
    product = document.querySelector('.productcontainer').cloneNode('floppa');
    createProduct(){
        this.product.removeAttribute('style');
        this.product.querySelector('img').setAttribute('src', this.image);
        this.product.querySelector('.productname > span').innerHTML = this.name;
        this.product.querySelector('.priceinmainproduct').innerHTML = this.price;
        this.product.style.display = 'flex';
        this.product.removeAttribute('id');
        this.product.querySelector('.visibleproduct').addEventListener('click', () => this.showPopup());
        return this.product;
    }
    popup = document.querySelector('.popupbackground');
    showPopup(){
       this.popup.style.display = 'flex';
       this.popup.querySelector('img').setAttribute('src', this.image);
       this.popup.querySelector('.productnameinpopup>span').innerHTML = this.name;
       this.popup.querySelector('.productdescriptioninpopup>span').innerHTML = this.description;
       this.popup.querySelector('.productpriceinpopup>span').innerHTML = this.price;
       this.popup.setAttribute('id', this.id);
    } 
    productinbasket = new ProductInBasket(this);
}

class Basket{
    basket = document.querySelector('.basketbackground');
    basketIcon(){
        document.querySelector('.basketicon').addEventListener('click', () => {
            document.querySelector('.basketbackground').style.display = '';
            this.basketArray.forEach((element) => {
                let productinbasketclass = new ProductInBasket(element);
                let productinbasket = productinbasketclass.createProduct();
                productinbasket.id = element.id;
                document.querySelector('.basketheader').after(productinbasket);
            })
            this.basket.querySelector('.totalamount').innerHTML = this.getPriceAmount();
            this.basketEmptyImage();
        })
    }
    basketExit(){
        document.querySelector('.exitinbasket').addEventListener('click', () => {
            document.querySelector('.basketbackground').style.display = 'none';
            document.querySelector('.basketbackground').querySelectorAll('.productinbasketcontainer').forEach((element) => element.remove());
        })
    }
    getPriceAmount(){
        let amount = 0;
        this.basket.querySelectorAll('.priceinbasket').forEach((element) => {
            amount += +element.innerHTML;
        })
        return amount;
    }
    basketArray = [];
    setBasketArray(){
        if (localStorage.getItem('basketdata') == null) {
            localStorage.setItem('basketdata', JSON.stringify(this.basketArray))
        } else {
            console.log(localStorage.getItem('basketdata'))
            console.log(localStorage.getItem('basketdata'));
            this.basketArray = JSON.parse(localStorage.getItem('basketdata'));
        }
    }
    addProductToBasket(){
            let options = {
                image: document.querySelector('.popupbackground').querySelector('img').getAttribute('src'),
                name: document.querySelector('.popupbackground').querySelector('.productnameinpopup>span').innerHTML,
                price: document.querySelector('.popupbackground').querySelector('.productpriceinpopup>span').innerHTML,
                id: document.querySelector('.popupbackground').getAttribute('id')
            }
            if (this.basketArray.length == 0) {
                this.basketArray.push(new productInBasketArray(options));
            } else {
                let needElement = 'floppa';
                this.basketArray.forEach((element) => {
                    if (element.id == document.querySelector('.popupbackground').getAttribute('id')) {
                        element.price /= element.amount;
                        element.amount++;
                        element.price *= element.amount;
                        needElement = false;
                    } else {}
                })
                if (needElement !== false) {
                    this.basketArray.push(new productInBasketArray(options));
                }
            }
            this.setBasket();
    }
    setBasket(){
        localStorage.setItem('basketdata', JSON.stringify(this.basketArray));
    }
    basketEmptyImage(){
        if (this.basket.querySelector('.productinbasketcontainer') === null) {
            document.querySelector('.emptyimagecontainer').style.display = 'flex'
        } else { 
            document.querySelector('.emptyimagecontainer').style.display = 'none'
        }
    }
    cleanBasket(){
        this.basket.querySelector('.cleanbasketbutton').addEventListener('click', () => {
            this.basket.querySelectorAll('.productinbasketcontainer').forEach((element) => {
                element.remove();
            })
            this.basketArray.length = 0;
            this.basket.querySelector('.totalamount').innerHTML = 0;
            this.basketEmptyImage();
        })
        this.setBasket();
    }
}

class ProductInBasket{
    constructor(options) {
        this.image = options.image;
        this.name = options.name;
        this.price = options.price;
        this.amount = options.amount;
    }
    productinbasket = document.querySelector('.productinbasketcontainer').cloneNode('floppa');
    createProduct(){
        this.productinbasket.removeAttribute('style');
        this.productinbasket.querySelector('img').setAttribute('src', this.image);
        this.productinbasket.querySelector('.nameinbasket > span').innerHTML = this.name;
        this.productinbasket.querySelector('.priceinbasket').innerHTML = this.price;
        this.productinbasket.querySelector('.amountbasket').value = this.amount;
        this.productinbasket.querySelector('.amountbasket').addEventListener('change', (event) => {
            store.basket.basketArray.forEach((element) => {
                if (event.target.closest('.productinbasketcontainer').getAttribute('id') == element.id) {
                    document.querySelector('.totalamount').innerHTML = +document.querySelector('.totalamount').innerHTML - element.price;
                    element.price /= element.amount;
                    element.amount = +event.target.value;
                    element.price *= element.amount;
                    event.target.closest('.productinbasketcontainer').querySelector('.priceinbasket').innerHTML = element.price;
                    document.querySelector('.totalamount').innerHTML = +document.querySelector('.totalamount').innerHTML + element.price;
                }
            })
            localStorage.setItem('basket', store.basket.setBasket());
        })
        return this.productinbasket;
    }
}

class productInBasketArray{
    constructor(options){
        this.image = options.image;
        this.name = options.name;
        this.price = +options.price;
        this.id = options.id;
    }
    amount = 1;    
}

let store = new Store();
store.addAllProducts();
store.addAllAboutBasket();
store.addAllAboutPopup();