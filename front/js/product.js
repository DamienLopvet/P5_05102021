const params = new URLSearchParams(window.location.search)
const productId = params.get('productId')


fetch("http://localhost:3000/api/products")
.then(data => data.json())
.then( jsonlistProduct => {
   
    for (let jsonProduct of jsonlistProduct){
        let product = new Product(jsonProduct);
        if (productId == product._id){
        document
        .querySelector(".item__img")
        .innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.querySelector("#title").innerText = `${product.name}`;
        document.getElementById('price').innerText = `${product.price}`;
        document.getElementById('description').innerText = `${product.description}`;
        for (let color of product.colors){
            document.getElementById('colors').innerHTML += `
            <option value="${color}">${color}</option>`};
   }}
    
});
document
.getElementById('colors')
.addEventListener('change', function(event) {

    console.log(event.target.value);
})
