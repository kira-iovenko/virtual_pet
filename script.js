const pet = document.getElementById('pet');
const status = document.getElementById('status');
const feedButton = document.getElementById('feedButton');

feedButton.addEventListener('click', () => {
  status.textContent = 'Queenie von Floof is munching... 😋';
  pet.style.transform = 'scale(1.1)';
  setTimeout(() => {
    status.textContent = 'Queenie von Floof is happy now! 🐕🐾';
    pet.style.transform = 'scale(1)';
  }, 1000);
});
