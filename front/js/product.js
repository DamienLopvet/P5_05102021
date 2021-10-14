const productId = new URLSearchParams(window.location.search).get('Id')



fetch(`http://localhost:3000/api/products/${productId}`)
.then(data => data.json())
.then( jsonProduct => {
       let product = new Product(jsonProduct);
        
        document
        .querySelector(".item__img")
        .innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.querySelector("#title").innerText = `${product.name}`;
        document.getElementById('price').innerText = `${product.price}`;
        document.getElementById('description').innerText = `${product.description}`;
        for (let color of product.colors){
            document.getElementById('colors').innerHTML += `
            <option value="${color}">${color}</option>`};
   
    
});
function addToCart(){
colorChoosen = document.getElementById('colors').value;
quantityChoosen = document.getElementById('quantity').value;
var newItem = 
{
    "id" : productId,
    "color" : colorChoosen,
    "quantity" : quantityChoosen 
};
if (!colorChoosen || (quantityChoosen == 0)) 
{
    alert('vous devez choisir la couleur et la quantité :-)')
}
    else
    {
        var allItems = JSON.parse(localStorage.getItem('items')) || [];
        allItems.push(newItem);
        localStorage.setItem('items', JSON.stringify(allItems));
    
 
  document.querySelector('.item').innerHTML = `<div class="confirm-pop">
<h2>Votre produit a bien été ajouté au panier</h2>
<a href="index.html">
<div class="item__content__addButton">
<button type="button"> Continuer vos achats</button>
</div></a>
<a href="cart.html">
<div class="item__content__addButton">
<button type="button"> Aller au panier</button>
</div></a>
</div> `


}

}

document
.getElementById('addToCart')
.addEventListener('click', addToCart);

