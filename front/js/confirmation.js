const orderId = new URLSearchParams(window.location.search).get('orderId')
document.getElementById('orderId').innerText = orderId;
