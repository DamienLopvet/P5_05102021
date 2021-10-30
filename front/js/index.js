/**
 * Send request using fetch API to get all products.
 * transform the datas received into json datas.
 * insert them into an HTML using a loop.
 *
 */
fetch("http://localhost:3000/api/products")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Mauvaise réponse du réseau");
    }
  })
  .then((data) => {
    for (let product of data) {
      document.getElementById(
        "items"
      ).innerHTML += `<a href="./product.html?Id=${product._id}">
       <article>
         <img src="${product.imageUrl}" alt="${product.altTxt} ">
         <p class="productPrice">${product.price} euros</P>
         <h3 class="productName">${product.name} </h3>
         <p class="productDescription">${product.description} </p>
       </article>
     </a> `;
    }
  })
  .catch(function (error) {
    console.log(
      "Il y a eu un problème avec l'opération fetch: " + error.message
    );
  });
