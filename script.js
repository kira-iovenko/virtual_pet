const pet = document.getElementById('pet');
const status = document.getElementById('status');
const iconContainer = document.getElementById('need-icons');

const feedButton = document.getElementById('feedButton');
const playButton = document.getElementById('playButton');
const restButton = document.getElementById('restButton');
const cleanButton = document.getElementById('cleanButton');

// Sound setup
const crunchSound = new Audio('https://www.soundjay.com/human/sounds/crunching-1.mp3');
crunchSound.volume = 0.8;
const toySound = new Audio("https://www.soundjay.com/misc/sounds/squeeze-toy-2.mp3");
toySound.volume = 0.8;
const chimeSound = new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3");
chimeSound.volume = 0.8;
const waterSound = new Audio("https://www.soundjay.com/nature/sounds/water-splash-2.mp3");
waterSound.volume = 0.8;

let scale = 1;

let stats = {
  health: 100,
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100,
  xp: 0,
  level: 1
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStatsDisplay() {
  const xpNeeded = stats.level * 100; // dynamically calculate XP needed

  document.getElementById('health').textContent = stats.health;
  document.getElementById('hunger').textContent = stats.hunger;
  document.getElementById('happiness').textContent = stats.happiness;
  document.getElementById('energy').textContent = stats.energy;
  document.getElementById('cleanliness').textContent = stats.cleanliness;

  document.getElementById('xp').textContent = stats.xp;
  document.getElementById('level').textContent = stats.level;

  // Show the dynamic XP max needed to level up
  document.getElementById('xp-max').textContent = xpNeeded;

  // Update progress bar width as percentage
  const xpPercent = (stats.xp / xpNeeded) * 100;
  const xpBar = document.getElementById('xp-bar');
  xpBar.style.width = `${xpPercent}%`;
}


function updateNeedIcons() {
  iconContainer.innerHTML = "";

  const needs = [];

  if (stats.hunger <= 60) needs.push("need-food.png");
  if (stats.cleanliness <= 60) needs.push("need-bath.png");
  if (stats.energy <= 60) needs.push("need-sleep.png");
  if (stats.happiness <= 60) needs.push("need-play.png");

  if (needs.length === 0) {
    needs.push("thriving.png");
  }

  needs.forEach(filename => {
    const img = document.createElement("img");
    img.src = `images/${filename}`;
    img.alt = filename.split('.')[0];
    img.classList.add("need-icon");
    iconContainer.appendChild(img);
  });
}

function addXP(amount) {
  stats.xp += amount;

  let xpNeeded = stats.level * 100;

  while (stats.xp >= xpNeeded) {
    stats.xp -= xpNeeded;
    stats.level++;
    xpNeeded = stats.level * 100;

    alert(`🎉 Queenie leveled up! She is now Level ${stats.level}! 👑`);

    const xpContainer = document.getElementById('xp-bar-container');

    xpContainer.classList.remove('level-up');
    void xpContainer.offsetWidth; // Trigger reflow to restart animation
    xpContainer.classList.add('level-up');

    xpContainer.addEventListener('animationend', () => {
      xpContainer.classList.remove('level-up');
    }, { once: true });
  }

  updateStatsDisplay();
  saveProgress();
}


// FEED
feedButton.addEventListener('click', () => {
  crunchSound.currentTime = 0;
  crunchSound.play();
  setTimeout(() => crunchSound.pause(), 600);

  status.textContent = 'Queenie von Floof is enjoying her royal treat... 👑🍬';
  scale += 0.1;

  stats.hunger = clamp(stats.hunger + 25);
  stats.happiness = clamp(stats.happiness + 5);
  stats.cleanliness = clamp(stats.cleanliness - 5);
  addXP(10);

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
  updateNeedIcons();
  saveProgress();
});

// PLAY
playButton.addEventListener('click', () => {
  status.textContent = 'Queenie is chasing her jewel-encrusted tennis ball! 🎾💎';
  toySound.currentTime = 0;
  toySound.play();

  stats.happiness = clamp(stats.happiness + 20);
  stats.hunger = clamp(stats.hunger - 10);
  stats.energy = clamp(stats.energy - 15);
  stats.cleanliness = clamp(stats.cleanliness - 10);
  addXP(12);

  pet.style.transition = 'transform 0.3s ease';
  pet.style.transform = 'translateY(-20px)';
  setTimeout(() => pet.style.transform = 'translateY(0)', 300);

  updateStatsDisplay();
  updateNeedIcons();
  saveProgress();
});

// REST
restButton.addEventListener('click', () => {
  status.textContent = 'Queenie von Floof is napping on silk cushions... 💤🛏️';
  setTimeout(() => {
    chimeSound.currentTime = 0;
    chimeSound.play();
  }, 1500);

  stats.energy = clamp(stats.energy + 30);
  stats.happiness = clamp(stats.happiness + 5);
  stats.hunger = clamp(stats.hunger - 5);
  addXP(8);

  pet.style.transition = 'opacity 2s ease';
  pet.style.opacity = '0.5';
  setTimeout(() => pet.style.opacity = '1', 2000);

  updateStatsDisplay();
  updateNeedIcons();
  saveProgress();
});

// CLEAN
cleanButton.addEventListener('click', () => {
  status.textContent = 'Royal spa time! 🛁👑✨';
  waterSound.currentTime = 0;
  waterSound.play();

  pet.style.transition = 'box-shadow 0.5s ease';
  pet.style.boxShadow = '0 0 15px 5px pink';
  setTimeout(() => pet.style.boxShadow = 'none', 500);

  pet.style.transition = 'transform 0.1s';
  pet.style.transform = 'translateX(-10px)';
  setTimeout(() => pet.style.transform = 'translateX(10px)', 100);
  setTimeout(() => pet.style.transform = 'translateX(0)', 200);

  stats.cleanliness = clamp(stats.cleanliness + 40);
  stats.happiness = clamp(stats.happiness + 5);
  addXP(6);

  updateStatsDisplay();
  updateNeedIcons();
  saveProgress();
});

// Mood & stat decay
setInterval(() => {
  stats.hunger = clamp(stats.hunger - 5);
  stats.energy = clamp(stats.energy - 3);
  stats.cleanliness = clamp(stats.cleanliness - 2);
  stats.happiness = clamp(stats.happiness - 4);

  if (
    stats.hunger <= 60 ||
    stats.energy <= 60 ||
    stats.cleanliness <= 60 ||
    stats.happiness <= 60
  ) {
    stats.health = clamp(stats.health - 5);
  } else if (stats.health < 100) {
    stats.health = clamp(stats.health + 1);
  }

  let mood = "";

  if (stats.health <= 20) {
    mood = 'Queenie: "I feel faint... 💫"';
  } else if (stats.hunger <= 60) {
    mood = 'Queenie: "I require a snack immediately! 🍰"';
  } else if (stats.cleanliness <= 60) {
    mood = 'Queenie: "My paws! My precious paws! 🧼😩"';
  } else if (stats.energy <= 60) {
    mood = 'Queenie: "Zzz... too tired to bark. 💤"';
  } else if (stats.happiness <= 60) {
    mood = 'Queenie: "Why is nobody playing with me? 😔"';
  } else {
    mood = 'Queenie is gracefully thriving 👑✨';
  }

  status.textContent = mood;
  updateStatsDisplay();
  updateNeedIcons();
}, 10000);

// === USER LOGIN / SIGNUP SYSTEM ===

let currentUser = null;

const loginScreen = document.getElementById('login-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');

const usernameInput = document.getElementById('usernameInput');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const loginStatus = document.getElementById('login-status');

const currentUserDisplay = document.getElementById('current-user');
const newGameBtn = document.getElementById('newGameBtn');
const loadGameBtn = document.getElementById('loadGameBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Helper function to switch visible screens
function showScreen(screen) {
  loginScreen.style.display = 'none';
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'none';

  screen.style.display = 'block';
}

// Show login on page load
window.addEventListener('DOMContentLoaded', () => {
  showScreen(loginScreen);
});

// SIGN UP: create new user if not exists
signUpBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    loginStatus.textContent = 'Please enter a username.';
    return;
  }
  if (localStorage.getItem(`queenie-save-${username}`)) {
    loginStatus.textContent = 'Username already exists. Please sign in.';
    return;
  }
  const defaultStats = {
    health: 100,
    hunger: 100,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
    xp: 0,
    level: 1
  };
  localStorage.setItem(`queenie-save-${username}`, JSON.stringify(defaultStats));
  loginStatus.textContent = 'User created! You can now sign in.';
});

// SIGN IN: load user if exists, go to menu
signInBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    loginStatus.textContent = 'Please enter a username.';
    return;
  }
  const savedData = localStorage.getItem(`queenie-save-${username}`);
  if (!savedData) {
    loginStatus.textContent = 'User not found. Please sign up.';
    return;
  }
  currentUser = username;
  currentUserDisplay.textContent = currentUser;
  loginStatus.textContent = '';
  loadGameBtn.disabled = false; // can load game
  showScreen(menuScreen);
});

// NEW GAME: reset stats & enter game screen
newGameBtn.addEventListener('click', () => {
  stats = {
    health: 100,
    hunger: 100,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
    xp: 0,
    level: 1
  };
  updateStatsDisplay();
  updateNeedIcons();
  showScreen(gameScreen);
  saveProgress();
});

// LOAD GAME: load stats & enter game screen
loadGameBtn.addEventListener('click', () => {
  const savedData = localStorage.getItem(`queenie-save-${currentUser}`);
  if (!savedData) {
    alert('No saved game found!');
    return;
  }
  stats = JSON.parse(savedData);
  updateStatsDisplay();
  updateNeedIcons();
  showScreen(gameScreen);
});

// LOGOUT: clear current user and go back to login screen
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  stats = null;
  showScreen(loginScreen);
});

// Save progress function, call after stats changes
function saveProgress() {
  if (!currentUser || !stats) return;
  localStorage.setItem(`queenie-save-${currentUser}`, JSON.stringify(stats));
}


updateStatsDisplay();
updateNeedIcons();