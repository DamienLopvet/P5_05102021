/**
 * retrieve the Id of the product in the URL
 */
const productId = new URLSearchParams(window.location.search).get("Id");
/**
 * Redirect User if there is no Id in the Url.
 */
if (!productId) {
  window.location.href = "index.html";
} else {
  /**
   * Get the product from API searching by ID
   */
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((reponse) => reponse.json())
    .then((product) => {
      productPhoto = product.imageUrl;
      productPrice = product.price;
      productAltTxt = product.altTxt;
      productName = product.name;
      /**
       *Insert the datas into the HTML
       */
      document.querySelector(
        ".item__img"
      ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
      document.querySelector("#title").innerText = `${product.name}`;
      document.getElementById("price").innerText = `${product.price}`;
      document.getElementById(
        "description"
      ).innerText = `${product.description}`;
      for (let color of product.colors) {
        document.getElementById("colors").innerHTML += `
            <option value="${color}">${color}</option>`;
      }
    });
}

/**
 * onclick : put the product into localStorage.
 */

function addToCart() {

  /**
   * Retrieves values from selectors
   */
  let colorChoosen = document.getElementById("colors").value;
  let quantityChoosen = document.getElementById("quantity").value;

  /**
   * Create new Object to send to the localStorage
   */
  var newItem = {
    id: productId,
    color: colorChoosen,
    quantity: quantityChoosen,
    photo: productPhoto,
    altText: productAltTxt,
    price: productPrice,
    name: productName,
  };

  /**
   * Invite user to choose color before sending request
   */

  if (!colorChoosen) {
alert("Vous devez choisir la couleur :-)")
  } else {
    /**Retrieve localSotrage array and parse into javascript.
     */
    var allItems = JSON.parse(localStorage.getItem("items")) || [];

    /**Check if an object in the localStorage array has the same id and color
     */
    var itemMatching =
      allItems.find((item) => item.id === productId) &&
      allItems.find((item) => item.color === colorChoosen);

    if (itemMatching) {
      /**
       * Adding quantities of the two matching items
       */
      let quantityOfInitialItem = itemMatching.quantity;
      let newQuantity =
        parseInt(quantityOfInitialItem) + parseInt(quantityChoosen);

      /**
       * finding position in localStorage of the initial Item and create an new item to replace it.
       */
      let initialItemPos = allItems.indexOf(itemMatching);

      var modifyItem = {
        id: productId,
        color: colorChoosen,
        quantity: newQuantity,
        photo: productPhoto,
        altText: productAltTxt,
        price: productPrice,
        name: productName,
      };

      allItems.splice(initialItemPos, 1, modifyItem);
      localStorage.setItem("items", JSON.stringify(allItems));
    } else {
      /**
       * If item not matching in localStorage, adding it to localStorage
       */
      allItems.push(newItem);
      localStorage.setItem("items", JSON.stringify(allItems));
    }

    /**
     * Confirm user action and redirect to homepage or cart
     */
    document.querySelector(".item").innerHTML = `<div class="confirm-pop">
<h1>Votre produit a bien été ajouté au panier</h1>
<a href="index.html">
<div class="item__content__addButton">
<button type="button"> Continuer vos achats</button>
</div></a>
<a href="cart.html">
<div class="item__content__addButton">
<button type="button"> Aller au panier</button>
</div></a>
</div> `;
  }
}
/**
 * listening to the "ajouter au panier" button
 */
document.getElementById("addToCart").addEventListener("click", () => {
  testLocalStorage();
  addToCart();
});
/**
 * Test Whether localStorage is Available
 */
 function testLocalStorage(){ 
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}
if(testLocalStorage() === false){
  document.querySelector(".item").innerHTML = `<div class="confirm-pop">
  <h1>Désolé, vous ne pouvez pas acheter nos produits depuis ce navigateur, essayez avec un autre navigateur</h1></div>`
}



/**
 * Update the total price.
 */
document
  .getElementById("quantity")
  .addEventListener("input", calculateTotalPrice);
function calculateTotalPrice() {
  let quantity = document.getElementById("quantity").value;
  let totalPrice = quantity * productPrice;
  document.getElementById("price").innerHTML = `${totalPrice}`;
}
