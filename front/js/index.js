fetch("http://localhost:3000/api/products")
.then(data => data.json())
.then( jsonlistProduct => {
    for (let jsonProduct of jsonlistProduct){
        let product = new Product(jsonProduct);
        document
        .getElementById('items')
        .innerHTML += `<a href="./product.html?Id=${product._id} ">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt} ">
          <p class="productPrice">${product.price} euros</P>
          <h3 class="productName">${product.name} </h3>
          <p class="productDescription">${product.description} </p>
        </article>
      </a> `
    }
});
