
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.getElementById('cartCounter');


function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            theme: 'relax',
            text: 'Item added to cart',
            layout: 'topRight',
            timeout: 1500,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            theme: 'relax',
            text: 'Something went wrong',
            layout: 'topRight',
            timeout: 1500,
        }).show();
    })
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click', (e) =>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    });
});
