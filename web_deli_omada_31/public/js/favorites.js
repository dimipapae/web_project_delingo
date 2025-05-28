document.addEventListener('DOMContentLoaded', () => {
  const favBtn = document.querySelector('.favorite-btn');
  if (!favBtn) return;

  const heart = favBtn.querySelector('.heart-icon');
  const shopId = favBtn.dataset.shopId;

  // Ελέγχει αν είναι ήδη αγαπημένο
  fetch(`/favorites/${shopId}`)
    .then(res => res.json())
    .then(data => {
      if (data.isFavorite) {
        heart.innerHTML = '❤️';
        favBtn.classList.add('favorited');
      }
    });

  favBtn.addEventListener('click', () => {
    const isFavorited = favBtn.classList.contains('favorited');

    fetch('/favorites', {
      method: isFavorited ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId })
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        heart.innerHTML = isFavorited ? '♡' : '❤️';
        favBtn.classList.toggle('favorited');
      } else {
        alert('Προέκυψε σφάλμα');
      }
    });
  });
});
