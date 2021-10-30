/**
 * Onlaod, lunch a function that create the HTML of each item from the localStorage
 * Also lunch a function that sum the totals
 */
(window.onload = setCart()), cartTotalPrice();
function setCart() {
  storedItems = JSON.parse(localStorage.getItem("items")) || [];

  /**
   * If cart is empty alert user, else create HTML.
   */
  if (storedItems.length == 0) {
    document.querySelector("h1").innerHTML = "votre panier est vide";
  } else {
    for (let item of storedItems) {
      totalOfThisItem = item.price * item.quantity;

      document.getElementById(
        "cart__items"
      ).innerHTML += `<article class="cart__item" id="${item.id}">
      <div class="cart__item__img">
        <img src="${item.photo}" alt="${item.altText}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${item.name}</h2>
            <p id="totalOfThisItem">${totalOfThisItem}</p><p>€</p>
            <p class="color" id="${item.color}" >Couleur : ${item.color}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
          <p>Quantité :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
    }
  }
}

/**
 * Modifying quantity using element.closest method
 */

document
  .querySelector("section #cart__items")
  .addEventListener("change", (e) => {
    if (e.target && e.target.nodeName == "INPUT") {
      let newQuantity = e.target.closest(".itemQuantity").value;
      let oldItemID = e.target.closest(".cart__item").id;
      let oldItemColor = e.target
        .closest(".cart__item")
        .querySelector(".color").id;
      let totalInput = e.target
        .closest(".cart__item")
        .querySelector("div.cart__item__content__titlePrice > p");

      let matchIdAndColor =
        storedItems.find((item) => item.id === oldItemID) &&
        storedItems.find((item) => item.color === oldItemColor);
      if (matchIdAndColor) {
        let oldItemIndex = storedItems.indexOf(matchIdAndColor);
        oldItem = storedItems[oldItemIndex];

        let newItem = {
          id: oldItem.id,
          color: oldItem.color,
          quantity: newQuantity,
          photo: oldItem.photo,
          altText: oldItem.altText,
          price: oldItem.price,
          name: oldItem.name,
        };
        /**
         * replace an item with the new quantity in the localStorage
         */
        storedItems.splice(oldItemIndex, 1, newItem);
        localStorage.setItem("items", JSON.stringify(storedItems));

        /**
         * Fixing new total price of item modified
         */
        let newTotal = newQuantity * newItem.price;
        totalInput.innerHTML = `${newTotal}`;
      }
    }
    /**
     * Update cart total price
     */
    cartTotalPrice();
  });

/**
 * Delete an Item
 *First : any click on the body will abort delete process
 */
document.querySelector("body").addEventListener("click", (event) => {
  closeBoxes();
});
/**
 * When ckicking on "supprimer", create a confirmDelete HTML
 */
document.querySelectorAll(".deleteItem").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    closeBoxes();
    event.target.style.display = "none";
    event.target.insertAdjacentHTML(
      "beforebegin",
      `<div class="confirmBox"><h3>Confirmer la suppression ?</h3>
      <button class="cart__order__delete" id="confirmDelete">Confirmer</button>
      <button class="cart__order__delete">Annuler</button></div>`
    );

    /**
     * If confirm delete process : match id and color,
     * find and delete localStorage Item and remove item from cart HTML
     */
    document
      .querySelector("#confirmDelete")
      .addEventListener("click", function () {
        let itemToDeleteId = event.target.closest(".cart__item").id;
        let itemToDeleteColor = event.target
          .closest(".cart__item")
          .querySelector(".color").id;
        matchIdAndColor =
          storedItems.find((item) => item.id === itemToDeleteId) &&
          storedItems.find((item) => item.color === itemToDeleteColor);
        let itemToDeleteIndex = storedItems.indexOf(matchIdAndColor);
        itemToDelete = storedItems[itemToDeleteIndex];
        storedItems.splice(itemToDeleteIndex, 1);
        localStorage.setItem("items", JSON.stringify(storedItems));
        event.target.closest("article").remove();

        /**
         * recalculate totals
         */
        cartTotalPrice();
        /**
         * If no items left in the cart, then inform User
         */
        if (storedItems.length == 0) {
          document.querySelector("h1").innerHTML = "votre panier est vide";
        }
      });
  });
});
function closeBoxes() {
  document.querySelectorAll(".confirmBox").forEach((item) => {
    item.closest("article").querySelector(".deleteItem").style.display =
      "inline-block";
    item.remove();
  });
}

/**
 * fixing Total price and total quantitity of all items
 */

function cartTotalPrice() {
  let totalQuantity = 0;
  document
    .querySelectorAll('input[type="number"]')
    .forEach((el) => (totalQuantity += +el.value));
  document.getElementById("totalQuantity").innerText = totalQuantity;

  let totalPrice = 0;

  document
    .querySelectorAll("p#totalOfThisItem")
    .forEach((el) => (totalPrice += +el.textContent));
  document.getElementById("totalPrice").innerText = totalPrice;
}

/**
 * Form input validation
 * Before sending datas, check inputs validity using html5 default functions with patterns and titles to indicate user what he has to do.
 */
document
  .querySelector('.cart__order__form input[type="submit"]')
  .addEventListener("click", function (e) {
    e.preventDefault();
    /**
     * Are all inputs valids? let create a variable to checkout
     */
    var valid = true;
    for (let input of document.querySelectorAll(".cart__order__form input")) {
      valid &= input.reportValidity();
      if (!valid) {
        break;
      }
    }
    if (valid) {
      /**
       * check if there is at least one item in the cart
       */
      if (storedItems.length == 0) {
        alert("Choisissez des articles avant de commander");
      }
      if (storedItems.length >= 1) {
        itemsId = storedItems.map((product) => product.id);
      }
      /**
       * Send Datas to the API
       */
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: {
            firstName: document.querySelector('[name="firstName"]').value,
            lastName: document.querySelector('[name="lastName"]').value,
            address: document.querySelector('[name="address"]').value,
            city: document.querySelector('[name="city"]').value,
            email: document.querySelector('[name="email"]').value,
          },
          products: itemsId,
        }),
      })
        .then(function (result) {
          if (result.ok) {
            return result.json();
          }
        })
        .then(function (orderDatas) {
          /**
           * Create a hidden input to insert order Id
           */
          orderId = orderDatas.orderId;
          let newDiv = document.createElement("div");
          document.querySelector("form").appendChild(newDiv);
          newDiv.innerHTML = `<input type="hidden" name="orderId" id="orderId" value=${orderId}>`;

          document.querySelector("form").submit();
        })
        .then(function () {
          localStorage.clear();
        });
    }
  });
