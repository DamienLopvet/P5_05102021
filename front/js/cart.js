(window.onload = setCart()), cartTotalPrice();
function setCart() {
  allItems = JSON.parse(localStorage.getItem("items")) || [];

  if (allItems.length == 0) {
    document.querySelector("h1").innerHTML = "votre panier est vide";
  } else {
    for (let item of allItems) {
      totalOfThisItem = item.price * item.quantity;

      itemQuantity = item.quantity;
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
            <p>Qté :</p><p id="itemQuantity"></p>
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

//Modifying quantity

document
  .querySelector("section #cart__items")
  .addEventListener("change", function (e) {
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
        allItems.find((item) => item.id === oldItemID) &&
        allItems.find((item) => item.color === oldItemColor);
      if (matchIdAndColor) {
        let oldItemIndex = allItems.indexOf(matchIdAndColor);
        oldItem = allItems[oldItemIndex];

        let newItem = {
          id: oldItem.id,
          color: oldItem.color,
          quantity: newQuantity,
          photo: oldItem.photo,
          altText: oldItem.altText,
          price: oldItem.price,
          name: oldItem.name,
        };

        allItems.splice(oldItemIndex, 1, newItem);
        localStorage.setItem("items", JSON.stringify(allItems));

        //Fixing new total price of item modified
        let newTotal = newItem.quantity * newItem.price;
        totalInput.innerHTML = `${newTotal}`;
      }
    }
    cartTotalPrice();
  });
//delete an Item
document.querySelector("section").addEventListener("click", function (e) {
  if (e.target && e.target.className == "deleteItem") {
    let itemToDeleteId = e.target.closest(".cart__item").id;
    let itemToDEleteColor = e.target
      .closest(".cart__item")
      .querySelector(".color").id;
    let articleToDelete = e.target.closest("article");

    let matchIdAndColor =
      allItems.find((item) => item.id === itemToDeleteId) &&
      allItems.find((item) => item.color === itemToDEleteColor);
    if (matchIdAndColor) {
      let itemToDeleteIndex = allItems.indexOf(matchIdAndColor);
      itemToDelete = allItems[itemToDeleteIndex];
      allItems.splice(itemToDeleteIndex, 1);
      localStorage.setItem("items", JSON.stringify(allItems));
    }
    articleToDelete.remove();
  }
  if (allItems.length == 0) {
    document.querySelector("h1").innerHTML = "votre panier est vide";
  }
  cartTotalPrice();
});

//fixing Total price off all items

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

//Form input validation
document
  .querySelector('.cart__order__form input[type="submit"]')
  .addEventListener("click", function (e) {
    e.preventDefault();   
    //are all inputs valid? let create a variable to checkout
    var valid = true;
    for (let input of document.querySelectorAll(".cart__order__form input")) {
      //corespond a : if (valid = true && input.reportValidity())
      // qui corespond aussi a : valid = valid && input.reportValidity()
      valid &= input.reportValidity();
      if (!valid) {
        break;
      }
    }
    if (valid) {
      if (allItems.length >= 1) {
        itemsId = allItems.map((product) => product.id);
      }
      //Send Datas to the API
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
          return result.json();
        })
        .then(function (value) {
          orderId = value.orderId;
          console.log(orderId);
          let newDiv = document.createElement("div");
          document.querySelector("form").appendChild(newDiv);
          newDiv.innerHTML = `<input type="text" name="orderId" id="orderId" value=${orderId}>`;
          document.querySelector("form").submit()


        })
        .then(function (clear) {
          localStorage.clear();
        });
    }
  });
