const orderId = new URLSearchParams(window.location.search).get("orderId");
/**
 *Alert User if there is no Id in the Url
 */
if (!orderId) {
  document.querySelector(
    ".confirmation"
  ).innerHTML = `<p>Aucune commande n'a été effectuée pour le moment.</br><a href="index.html"><button type="button">Accueil</button></a></br><a href="cart.html"><button type="button">Panier</button></a></p>`;
} else {
  document.getElementById("orderId").innerText = orderId;
}
