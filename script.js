const pet = document.getElementById('pet');
const status = document.getElementById('status');

const feedButton = document.getElementById('feedButton');
const playButton = document.getElementById('playButton');
const restButton = document.getElementById('restButton');
const cleanButton = document.getElementById('cleanButton');

let scale = 1;

let stats = {
  health: 100,
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStatsDisplay() {
  document.getElementById('health').textContent = stats.health;
  document.getElementById('hunger').textContent = stats.hunger;
  document.getElementById('happiness').textContent = stats.happiness;
  document.getElementById('energy').textContent = stats.energy;
  document.getElementById('cleanliness').textContent = stats.cleanliness;
}

// FEED
feedButton.addEventListener('click', () => {
  status.textContent = 'Queenie von Floof is enjoying her royal treat... 👑🍬';
  scale += 0.1;

  stats.hunger = clamp(stats.hunger + 25);
  stats.happiness = clamp(stats.happiness + 5);
  stats.cleanliness = clamp(stats.cleanliness - 5);

  if (scale >= 1.2 && scale < 1.3) {
    alert('Queenie: "Hmm... quite satisfying. 💅🍰"');
  } else if (scale >= 1.3 && scale < 1.4) {
    alert('Queenie: "A lady mustn’t overindulge... ✨"');
  } else if (scale >= 1.4 && scale < 1.5) {
    alert('Queenie: "Okay that’s *quite* enough now! 😳👑"');
  } else if (scale >= 1.5) {
    alert('Queenie: "I’m full! Resetting my royal floofiness... 💖🐾"');
    scale = 1;
  }

  pet.style.transition = 'transform 0.5s ease';
  pet.style.transform = `scale(${scale})`;

  setTimeout(() => {
    status.textContent = 'Queenie von Floof is feeling majestic! 💖🐾';
  }, 1000);

  updateStatsDisplay();
});

// PLAY
playButton.addEventListener('click', () => {
  status.textContent = 'Queenie is chasing her jewel-encrusted tennis ball! 🎾💎';

  stats.happiness = clamp(stats.happiness + 20);
  stats.hunger = clamp(stats.hunger - 10);
  stats.energy = clamp(stats.energy - 15);
  stats.cleanliness = clamp(stats.cleanliness - 10);

  // Play animation: quick bounce
  pet.style.transition = 'transform 0.3s ease';
  pet.style.transform = 'translateY(-20px)';
  setTimeout(() => {
    pet.style.transform = 'translateY(0)';
  }, 300);

  updateStatsDisplay();
});

// REST
restButton.addEventListener('click', () => {
  status.textContent = 'Queenie von Floof is napping on silk cushions... 💤🛏️';

  stats.energy = clamp(stats.energy + 30);
  stats.happiness = clamp(stats.happiness + 5);
  stats.hunger = clamp(stats.hunger - 5);

  // Rest animation: fade out and in
  pet.style.transition = 'opacity 2s ease';
  pet.style.opacity = '0.5';
  setTimeout(() => {
    pet.style.opacity = '1';
  }, 2000);

  updateStatsDisplay();
});

// CLEAN
cleanButton.addEventListener('click', () => {
  status.textContent = 'Royal spa time! 🛁👑✨';

  // Glow effect
  pet.style.transition = 'box-shadow 0.5s ease';
  pet.style.boxShadow = '0 0 15px 5px pink';
  setTimeout(() => {
    pet.style.boxShadow = 'none';
  }, 500);

  // Quick shake
  pet.style.transition = 'transform 0.1s';
  pet.style.transform = 'translateX(-10px)';
  setTimeout(() => {
    pet.style.transform = 'translateX(10px)';
  }, 100);
  setTimeout(() => {
    pet.style.transform = 'translateX(0)';
  }, 200);

  const cleanSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
  cleanSound.play();

  stats.cleanliness = clamp(stats.cleanliness + 40);
  stats.happiness = clamp(stats.happiness + 5);

  updateStatsDisplay();
});

setInterval(() => {
  // Decrease stats over time
  stats.hunger = clamp(stats.hunger - 5);
  stats.energy = clamp(stats.energy - 3);
  stats.cleanliness = clamp(stats.cleanliness - 2);
  stats.happiness = clamp(stats.happiness - 4);

  // Health reacts to low conditions
  if (
    stats.hunger <= 20 ||
    stats.energy <= 20 ||
    stats.cleanliness <= 20 ||
    stats.happiness <= 20
  ) {
    stats.health = clamp(stats.health - 5);
  } else if (stats.health < 100) {
    stats.health = clamp(stats.health + 1); // slow recovery
  }

  // Mood messages
  let mood = "";

  if (stats.health <= 20) {
    mood = 'Queenie: "I feel faint... 💫"';
  } else if (stats.hunger <= 20) {
    mood = 'Queenie: "I require a snack immediately! 🍰"';
  } else if (stats.cleanliness <= 20) {
    mood = 'Queenie: "My paws! My precious paws! 🧼😩"';
  } else if (stats.energy <= 20) {
    mood = 'Queenie: "Zzz... too tired to bark. 💤"';
  } else if (stats.happiness <= 20) {
    mood = 'Queenie: "Why is nobody playing with me? 😔"';
  } else {
    mood = 'Queenie is gracefully thriving 👑✨';
  }

  status.textContent = mood;

  updateStatsDisplay();
}, 10000); // Every 10 seconds

// Init display
updateStatsDisplay();
