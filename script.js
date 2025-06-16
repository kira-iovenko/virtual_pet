const pet = document.getElementById('pet');
const status = document.getElementById('status');
const feedButton = document.getElementById('feedButton');

let scale = 1;

feedButton.addEventListener('click', () => {
  // Update status
  status.textContent = 'Queenie von Floof is enjoying her royal treat... 👑🍬';

  // Increase size
  scale += 0.1;

  // Check fullness milestones
  if (scale >= 1.2 && scale < 1.3) {
    alert('Queenie: "Hmm... quite satisfying. 💅🍰"');
  } else if (scale >= 1.3 && scale < 1.4) {
    alert('Queenie: "A lady mustn’t overindulge... ✨"');
  } else if (scale >= 1.4 && scale < 1.5) {
    alert('Queenie: "Okay that’s *quite* enough now! 😳👑"');
  } else if (scale >= 1.5) {
    alert('Queenie: "I’m full! Resetting my royal floofiness... 💖🐾"');
    scale = 1; // reset
  }

  // Animate scale
  pet.style.transition = 'transform 0.5s ease';
  pet.style.transform = `scale(${scale})`;

  // Restore status
  setTimeout(() => {
    status.textContent = 'Queenie von Floof is feeling majestic! 💖🐾';
  }, 1000);
});
