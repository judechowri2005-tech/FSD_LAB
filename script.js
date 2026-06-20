const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modalCloses = document.querySelectorAll('[data-modal-close]');
const html = document.documentElement;

function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
  html.classList.add('modal-open');
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  html.classList.remove('modal-open');
}

modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modal = document.querySelector(trigger.dataset.modalTarget);
    if (modal) openModal(modal);
  });
});

modalCloses.forEach(close => {
  close.addEventListener('click', () => {
    const modal = close.closest('.modal');
    if (modal) closeModal(modal);
  });
});

window.addEventListener('click', event => {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target);
  }
});

const goalForm = document.getElementById('goalForm');
const savedGoalText = document.querySelector('.saved-goal');
if (goalForm) {
  const storedGoal = localStorage.getItem('studyGoal');
  if (storedGoal) savedGoalText.textContent = `Saved goal: ${storedGoal}`;
  goalForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('goalText');
    if (!input.value.trim()) return;
    localStorage.setItem('studyGoal', input.value.trim());
    savedGoalText.textContent = `Saved goal: ${input.value.trim()}`;
    input.value = '';
  });
}

const chatForm = document.getElementById('chatForm');
if (chatForm) {
  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const messageInput = document.getElementById('chatMessage');
    const text = messageInput.value.trim();
    if (!text) return;
    const chatBox = document.getElementById('chatBox');
    const newMessage = document.createElement('article');
    newMessage.innerHTML = `<small>You • just now</small><p>${text}</p>`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    messageInput.value = '';
  });
}

const bioForm = document.getElementById('bioForm');
const bioPreview = document.getElementById('bioPreview');
if (bioForm) {
  const storedBio = localStorage.getItem('studyBio');
  if (storedBio) bioPreview.textContent = storedBio;
  bioForm.addEventListener('submit', event => {
    event.preventDefault();
    const bioText = document.getElementById('bioText');
    if (!bioText.value.trim()) return;
    localStorage.setItem('studyBio', bioText.value.trim());
    bioPreview.textContent = bioText.value.trim();
    bioText.value = '';
  });
}

const locateButton = document.getElementById('locateButton');
const locationStatus = document.getElementById('locationStatus');
if (locateButton && locationStatus) {
  locateButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Geolocation is not supported in this browser.';
      return;
    }
    locationStatus.textContent = 'Getting your location…';
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        locationStatus.innerHTML = `Your study location is <strong>${latitude.toFixed(3)}, ${longitude.toFixed(3)}</strong>.`;
      },
      error => {
        locationStatus.textContent = `Unable to get location: ${error.message}`;
      },
      { timeout: 10000 }
    );
  });
}
