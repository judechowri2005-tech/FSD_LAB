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

// ============================================
// AXIOS IMAGE SEARCH INTEGRATION
// ============================================

// Subject Resources Search (Dashboard)
const resourceSearchButtons = document.querySelectorAll('.btn-search-subject');
const resourceSearchModal = document.getElementById('resourceSearchModal');
const resourceSearchInput = document.getElementById('resourceSearchInput');
const resourceSearchBtn = document.getElementById('resourceSearchBtn');
const resourceGridModal = document.getElementById('resourceGridModal');
const resourceLoading = document.getElementById('resourceLoadingSpinner');
const resourceError = document.getElementById('resourceErrorMsg');
const resourceSubject = document.getElementById('resourceSubject');

let currentResourceSubject = '';

if (resourceSearchButtons.length > 0) {
  resourceSearchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentResourceSubject = btn.dataset.subject;
      resourceSubject.textContent = `Search resources for: ${currentResourceSubject}`;
      resourceSearchInput.value = '';
      resourceGridModal.innerHTML = '';
      resourceError.style.display = 'none';
      openModal(resourceSearchModal);
      resourceSearchInput.focus();
    });
  });
}

if (resourceSearchBtn) {
  resourceSearchBtn.addEventListener('click', async () => {
    const query = resourceSearchInput.value.trim();
    if (!query) {
      showResourceError('Please enter a search term');
      return;
    }
    const fullQuery = `${currentResourceSubject} ${query}`;
    await searchAndDisplayResources(fullQuery);
  });
}

resourceSearchInput?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    resourceSearchBtn?.click();
  }
});

async function searchAndDisplayResources(query) {
  try {
    resourceLoading.style.display = 'flex';
    resourceError.style.display = 'none';
    resourceGridModal.innerHTML = '';

    if (!window.imageSearchClient) {
      showResourceError('Image search not initialized. Please refresh the page.');
      resourceLoading.style.display = 'none';
      return;
    }

    const params = {
      query: query,
      page: 1,
      per_page: 12,
      order_by: 'relevant'
    };

    const response = await window.imageSearchClient.get('/search/photos', { params });

    if (!response.data.results || response.data.results.length === 0) {
      showResourceError(`No resources found for "${query}". Try different keywords.`);
      resourceLoading.style.display = 'none';
      return;
    }

    displayResourcesInGrid(response.data.results);
    resourceLoading.style.display = 'none';

  } catch (error) {
    console.error('Search error:', error);
    let message = 'Error searching resources. ';
    if (error.response?.status === 401) {
      message += 'API key not configured.';
    } else if (error.response?.status === 403) {
      message += 'Rate limit exceeded.';
    } else if (error.code === 'ECONNABORTED') {
      message += 'Request timeout.';
    } else {
      message += error.message;
    }
    showResourceError(message);
    resourceLoading.style.display = 'none';
  }
}

function displayResourcesInGrid(images) {
  resourceGridModal.innerHTML = '';
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = image.urls.small;
    img.alt = image.alt_description || 'Study resource';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const info = document.createElement('div');
    info.className = 'image-info';
    info.innerHTML = `
      <p class="image-title">${image.alt_description || 'Resource'}</p>
      <p class="image-by">by ${image.user.name}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'image-actions';
    actions.innerHTML = `
      <a href="${image.urls.full}" target="_blank" class="btn-download" title="View Full">🔗 Open</a>
      <button type="button" class="btn-save-resource" title="Save to profile">💾 Save</button>
    `;

    const saveBtn = actions.querySelector('.btn-save-resource');
    saveBtn.addEventListener('click', () => saveResource(image));

    overlay.appendChild(info);
    overlay.appendChild(actions);
    card.appendChild(img);
    card.appendChild(overlay);
    resourceGridModal.appendChild(card);
  });
}

function showResourceError(message) {
  resourceError.textContent = message;
  resourceError.style.display = 'block';
}

// ============================================
// CHAT RESOURCE SHARING
// ============================================

const attachResourceBtn = document.getElementById('attachResourceChatBtn');
const chatShareModal = document.getElementById('chatShareModal');
const chatShareSearchInput = document.getElementById('chatShareSearchInput');
const chatSearchBtn = document.getElementById('chatSearchBtn');
const chatShareGrid = document.getElementById('chatShareGrid');
const chatShareLoading = document.getElementById('chatShareLoading');
const chatShareError = document.getElementById('chatShareError');
const chatResourceHeaderBtn = document.getElementById('chatResourceBtn');

if (attachResourceBtn) {
  attachResourceBtn.addEventListener('click', () => {
    chatShareSearchInput.value = '';
    chatShareGrid.innerHTML = '';
    chatShareError.style.display = 'none';
    openModal(chatShareModal);
    chatShareSearchInput.focus();
  });
}

if (chatResourceHeaderBtn) {
  chatResourceHeaderBtn.addEventListener('click', () => {
    openModal(chatShareModal);
    chatShareSearchInput.focus();
  });
}

if (chatSearchBtn) {
  chatSearchBtn.addEventListener('click', async () => {
    const query = chatShareSearchInput.value.trim();
    if (!query) {
      showChatError('Please enter a search term');
      return;
    }
    await searchAndShareResource(query);
  });
}

chatShareSearchInput?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    chatSearchBtn?.click();
  }
});

async function searchAndShareResource(query) {
  try {
    chatShareLoading.style.display = 'flex';
    chatShareError.style.display = 'none';
    chatShareGrid.innerHTML = '';

    if (!window.imageSearchClient) {
      showChatError('Image search not initialized.');
      chatShareLoading.style.display = 'none';
      return;
    }

    const response = await window.imageSearchClient.get('/search/photos', {
      params: {
        query: query,
        page: 1,
        per_page: 12,
        order_by: 'relevant'
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      showChatError('No resources found.');
      chatShareLoading.style.display = 'none';
      return;
    }

    displayChatShareResources(response.data.results);
    chatShareLoading.style.display = 'none';

  } catch (error) {
    console.error('Search error:', error);
    showChatError('Error searching resources.');
    chatShareLoading.style.display = 'none';
  }
}

function displayChatShareResources(images) {
  chatShareGrid.innerHTML = '';
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = image.urls.small;
    img.alt = image.alt_description || 'Resource';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const actions = document.createElement('div');
    actions.className = 'image-actions';
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn-download';
    shareBtn.innerHTML = '📤 Share to Chat';
    shareBtn.addEventListener('click', () => shareToChat(image));

    actions.appendChild(shareBtn);
    overlay.appendChild(actions);
    card.appendChild(img);
    card.appendChild(overlay);
    chatShareGrid.appendChild(card);
  });
}

function shareToChat(image) {
  const chatBox = document.getElementById('chatBox');
  const article = document.createElement('article');
  article.innerHTML = `
    <small>You • just now</small>
    <p>📸 Shared: <strong>${image.alt_description || 'Study Resource'}</strong></p>
    <p><a href="${image.urls.full}" target="_blank">
      <img src="${image.urls.small}" alt="Resource" style="max-width: 200px; border-radius: 4px; margin-top: 8px;">
    </a></p>
    <small>by ${image.user.name}</small>
  `;
  chatBox.appendChild(article);
  chatBox.scrollTop = chatBox.scrollHeight;

  closeModal(chatShareModal);
  alert('✅ Resource shared with your study group!');

  // Save to profile
  saveResource(image);
}

function showChatError(message) {
  chatShareError.textContent = message;
  chatShareError.style.display = 'block';
}

// ============================================
// SAVE RESOURCES TO PROFILE
// ============================================

function saveResource(image) {
  let saved = JSON.parse(localStorage.getItem('savedResources') || '[]');

  const exists = saved.some(r => r.id === image.id);
  if (exists) {
    alert('This resource is already saved!');
    return;
  }

  saved.push({
    id: image.id,
    title: image.alt_description,
    url: image.urls.small,
    fullUrl: image.urls.full,
    photographer: image.user.name,
    savedAt: new Date().toLocaleString()
  });

  localStorage.setItem('savedResources', JSON.stringify(saved));
  updateSavedResourcesDisplay();
  alert('✅ Resource saved to your profile!');
}

function updateSavedResourcesDisplay() {
  const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
  const container = document.getElementById('savedResourcesContainer');
  const noMsg = document.getElementById('noSavedMsg');
  const viewBtn = document.getElementById('viewSavedResourcesBtn');

  if (!container) return;

  if (saved.length === 0) {
    noMsg.style.display = 'block';
    if (viewBtn) viewBtn.textContent = 'View Saved (0)';
    return;
  }

  noMsg.style.display = 'none';
  if (viewBtn) viewBtn.textContent = `View Saved (${saved.length})`;

  container.innerHTML = '';
  saved.slice(0, 4).forEach(resource => {
    const card = document.createElement('div');
    card.className = 'saved-resource-card';
    card.innerHTML = `
      <a href="${resource.fullUrl}" target="_blank">
        <img src="${resource.url}" alt="${resource.title}">
      </a>
      <div class="resource-info">
        <p class="resource-title">${resource.title}</p>
        <small>${resource.photographer}</small>
      </div>
    `;
    container.appendChild(card);
  });
}

// Load saved resources on page load
document.addEventListener('DOMContentLoaded', updateSavedResourcesDisplay);

// View all saved resources
const viewSavedBtn = document.getElementById('viewSavedResourcesBtn');
if (viewSavedBtn) {
  viewSavedBtn.addEventListener('click', () => {
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
    const modal = document.getElementById('savedResourcesModal');
    const grid = document.getElementById('allSavedResourcesGrid');
    const noMsg = document.getElementById('noResourcesMsg');

    if (saved.length === 0) {
      noMsg.style.display = 'block';
      grid.innerHTML = '';
    } else {
      noMsg.style.display = 'none';
      grid.innerHTML = '';
      saved.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
          <a href="${resource.fullUrl}" target="_blank" style="display: block; width: 100%; height: 100%;">
            <img src="${resource.url}" alt="${resource.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </a>
          <div class="image-overlay">
            <div class="image-info">
              <p class="image-title">${resource.title}</p>
              <p class="image-by">by ${resource.photographer}</p>
            </div>
            <button type="button" class="btn-remove" onclick="removeResource('${resource.id}')">🗑️ Remove</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }
    openModal(modal);
  });
}

window.removeResource = function(imageId) {
  if (confirm('Remove this resource?')) {
    let saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
    saved = saved.filter(r => r.id !== imageId);
    localStorage.setItem('savedResources', JSON.stringify(saved));
    updateSavedResourcesDisplay();
    const modal = document.getElementById('savedResourcesModal');
    if (modal) closeModal(modal);
    viewSavedBtn?.click();
  }
};

// Header search resources button
const searchResourcesHeaderBtn = document.getElementById('searchResourcesHeaderBtn');
if (searchResourcesHeaderBtn) {
  searchResourcesHeaderBtn.addEventListener('click', () => {
    const resourceModal = document.getElementById('resourceSearchModal');
    const resourceInput = document.getElementById('resourceSearchInput');
    if (resourceModal) {
      currentResourceSubject = 'General Study';
      document.getElementById('resourceSubject').textContent = 'Search resources for: General Study';
      resourceInput.value = '';
      document.getElementById('resourceGridModal').innerHTML = '';
      document.getElementById('resourceErrorMsg').style.display = 'none';
      openModal(resourceModal);
      resourceInput.focus();
    }
  });
}
