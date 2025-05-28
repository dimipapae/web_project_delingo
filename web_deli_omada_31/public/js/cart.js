const cart = {};
const isGuest = document.body.dataset.guest === 'true';

document.addEventListener('DOMContentLoaded', () => {
//   const cart = {};

  const updateCartDisplay = () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountElem = document.querySelector('.cart-total-amount');
    const totalItemsElem = document.querySelector('.cart-total-items');

    cartItemsContainer.innerHTML = '';

    let totalAmount = 0;
    let totalItems = 0;

    for (const [kodikos, item] of Object.entries(cart)) {
      if (item.qty > 0) {
        totalAmount += item.timh * item.qty;
        totalItems += item.qty;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
          <span class="cart-item-qty">${item.qty}x</span>
          <span class="cart-item-name">${item.onoma}</span>
          <img src="/images/${item.eikona}" alt="${item.onoma}" />
        `;
        cartItemsContainer.appendChild(itemDiv);
      }
    }

    totalAmountElem.textContent = totalAmount.toFixed(2);
    totalItemsElem.textContent = totalItems;
  };

  document.querySelectorAll('.menu-card').forEach(card => {
    const kodikos = card.dataset.kodikos;
    const plusBtn = card.querySelector('.qty-btn.plus');
    const minusBtn = card.querySelector('.qty-btn.minus');
    const qtySpan = card.querySelector('.qty-number');

    plusBtn.addEventListener('click', () => {
      let currentQty = parseInt(cart[kodikos]?.qty || 0);
      currentQty++;

      const onoma = card.querySelector('.menu-title').textContent.split(' - ')[0];
      const timh = parseFloat(card.querySelector('.menu-title').textContent.split(' - ')[1].replace('€', ''));
      const eikona = card.querySelector('.menu-image').getAttribute('alt') 
        ? card.querySelector('.menu-image').src.split('/images/')[1] 
        : '';

      cart[kodikos] = { qty: currentQty, onoma, timh, eikona };
      qtySpan.textContent = currentQty;
      updateCartDisplay();
    });

    minusBtn.addEventListener('click', () => {
      let currentQty = parseInt(cart[kodikos]?.qty || 0);
      if (currentQty > 0) currentQty--;
      if (currentQty === 0) {
        delete cart[kodikos];
      } else {
        cart[kodikos].qty = currentQty;
      }
      qtySpan.textContent = currentQty;
      updateCartDisplay();
    });
  });
});


document.querySelector('.checkout-btn').addEventListener('click', async () => {
   
  const troposPliromis = document.querySelector('input[name="paymentMethod"]:checked').value;

  if (Object.keys(cart).length === 0) {
    alert("Το καλάθι σας είναι άδειο!");
    return;
  }

  const response = await fetch('/submit-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      troposPliromis,
      items: cart
    })
  });

  if (response.status === 401) {
    const msg = await response.json(); 
    alert(msg.message);                
    window.location.href = '/';
    return;
  }

  if (response.ok) {
    alert("Ευχαριστούμε που μας προτιμήσατε! Η παραγγελία σας είναι στον δρόμο!");
    location.reload(); // καθαρίζεις μόνο το καλάθι
  } else {
    alert("Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε ξανά.");
  }
});


