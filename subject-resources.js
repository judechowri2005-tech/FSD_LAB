/**
 * Subject Resources - StudyHive Peer-to-Peer Image Sharing
 * Allows study groups to search and share educational resources
 */

// ============================================
// CONFIGURATION & STATE
// ============================================

const SUBJECT_CONFIG = {
    'Advanced Data Structures': {
        keywords: ['tree', 'graph', 'hash table', 'balancing', 'BST', 'AVL tree', 'rotation'],
        description: 'Diagrams and visual explanations for data structure concepts'
    },
    'Operating Systems II': {
        keywords: ['process', 'threading', 'scheduling', 'memory management', 'kernel', 'synchronization'],
        description: 'Visual guides for OS concepts and system architecture'
    },
    'Algorithms &amp; Complexity': {
        keywords: ['sorting', 'searching', 'Big O', 'complexity analysis', 'recursion', 'dynamic programming'],
        description: 'Algorithm visualizations and complexity demonstrations'
    },
    'Machine Learning Systems': {
        keywords: ['neural network', 'classification', 'regression', 'training', 'optimization', 'deep learning'],
        description: 'ML concepts, architectures, and model visualizations'
    }
};

let currentSubject = 'Advanced Data Structures';
let currentSearchQuery = '';
let sharedImages = {};
let currentShareImage = null;

// DOM Elements
const subjectTabs = document.querySelectorAll('.subject-tab');
const subjectTitle = document.getElementById('subjectTitle');
const subjectDescription = document.getElementById('subjectDescription');
const subjectSearchForm = document.getElementById('subjectSearchForm');
const subjectSearchInput = document.getElementById('subjectSearchInput');
const quickTopics = document.getElementById('quickTopics');
const imageGrid = document.getElementById('imageGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const sharedImagesList = document.getElementById('sharedImagesList');
const noShared = document.getElementById('noShared');
const shareModal = document.getElementById('shareModal');
const shareImageInfo = document.getElementById('shareImageInfo');
const shareMessage = document.getElementById('shareMessage');
const confirmShareBtn = document.getElementById('confirmShareBtn');
const shareStatus = document.getElementById('shareStatus');

// ============================================
// SUBJECT TAB NAVIGATION
// ============================================

subjectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        subjectTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update current subject
        currentSubject = tab.dataset.subject;
        updateSubjectDisplay();
        
        // Clear search
        subjectSearchInput.value = '';
        imageGrid.innerHTML = '';
        hideError();
    });
});

/**
 * Update the display based on selected subject
 */
function updateSubjectDisplay() {
    const config = SUBJECT_CONFIG[currentSubject];
    
    if (config) {
        subjectTitle.textContent = currentSubject;
        subjectDescription.textContent = config.description;
        
        // Update quick topic suggestions
        updateQuickTopics(config.keywords);
        
        // Load shared images for this subject
        loadSharedImagesForSubject();
    }
}

/**
 * Update quick topic suggestions
 */
function updateQuickTopics(keywords) {
    quickTopics.innerHTML = '';
    keywords.slice(0, 4).forEach(keyword => {
        const tag = document.createElement('button');
        tag.type = 'button';
        tag.className = 'topic-tag';
        tag.textContent = keyword;
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            subjectSearchInput.value = keyword;
            subjectSearchForm.dispatchEvent(new Event('submit'));
        });
        quickTopics.appendChild(tag);
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

subjectSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = subjectSearchInput.value.trim();
    
    if (!query) {
        showError('Please enter a search query');
        return;
    }

    currentSearchQuery = query;
    
    // Combine subject and query for better results
    const fullQuery = `${currentSubject} ${query}`;
    
    await performSubjectSearch(fullQuery);
});

/**
 * Perform axios-based subject search using existing imageSearchClient
 */
async function performSubjectSearch(query) {
    try {
        showLoading(true);
        hideError();
        
        const params = {
            query: query,
            page: 1,
            per_page: 20,
            order_by: 'relevant'
        };

        console.log(`Searching for: ${query}`);

        // Use the axios client from image-search.js
        const response = await imageSearchClient.get('/search/photos', { params });

        if (!response.data.results || response.data.results.length === 0) {
            showError(`No resources found for "${currentSearchQuery}". Try different keywords.`);
            showLoading(false);
            return;
        }

        // Display results with share buttons
        displaySubjectImages(response.data.results);
        showLoading(false);

    } catch (error) {
        console.error('Search error:', error);
        
        if (error.response?.status === 401) {
            showError('API key not configured. Please see setup guide.');
        } else if (error.response?.status === 403) {
            showError('Too many requests. Please wait before searching again.');
        } else if (error.code === 'ECONNABORTED') {
            showError('Search timed out. Please try again.');
        } else {
            showError(`Error searching resources: ${error.message}`);
        }
        
        showLoading(false);
    }
}

/**
 * Display images with share buttons (peer-to-peer feature)
 */
function displaySubjectImages(images) {
    imageGrid.innerHTML = '';

    images.forEach((image) => {
        const card = createSubjectImageCard(image);
        imageGrid.appendChild(card);
    });
}

/**
 * Create image card with share button for study group
 */
function createSubjectImageCard(image) {
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
        <p class="image-title">${image.alt_description || 'Resource Image'}</p>
        <p class="image-by">by ${image.user.name}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'image-actions';
    
    const openBtn = document.createElement('a');
    openBtn.href = image.urls.full;
    openBtn.target = '_blank';
    openBtn.className = 'btn-download';
    openBtn.title = 'View Full Resolution';
    openBtn.innerHTML = '🔗 Open';
    
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn-share-resource';
    shareBtn.title = 'Share with Study Group';
    shareBtn.innerHTML = '📤 Share';
    shareBtn.addEventListener('click', () => {
        openShareModal(image);
    });

    actions.appendChild(openBtn);
    actions.appendChild(shareBtn);

    overlay.appendChild(info);
    overlay.appendChild(actions);
    card.appendChild(img);
    card.appendChild(overlay);

    return card;
}

// ============================================
// PEER SHARING FUNCTIONALITY
// ============================================

/**
 * Open share modal for a specific image
 */
function openShareModal(image) {
    currentShareImage = image;
    shareImageInfo.innerHTML = `
        <strong>${image.alt_description || 'Resource Image'}</strong><br>
        <small>by ${image.user.name}</small>
    `;
    shareMessage.value = '';
    shareStatus.textContent = '';
    
    const modal = document.getElementById('shareModal');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
}

/**
 * Share image with study group (peer-to-peer)
 */
confirmShareBtn.addEventListener('click', () => {
    if (!currentShareImage) return;

    const note = shareMessage.value.trim();
    const imageData = {
        id: currentShareImage.id,
        url: currentShareImage.urls.small,
        fullUrl: currentShareImage.urls.full,
        title: currentShareImage.alt_description,
        photographer: currentShareImage.user.name,
        note: note,
        sharedBy: 'You', // In production, use actual username
        sharedAt: new Date().toLocaleTimeString(),
        subject: currentSubject
    };

    // Initialize shared images for subject if needed
    if (!sharedImages[currentSubject]) {
        sharedImages[currentSubject] = [];
    }

    // Add to shared images
    sharedImages[currentSubject].push(imageData);

    // Save to localStorage for persistence
    saveSharedImagesToStorage();

    // Show success message
    shareStatus.textContent = '✅ Shared with your study group!';
    shareStatus.style.color = '#22c55e';

    // Close modal after delay
    setTimeout(() => {
        const modal = document.getElementById('shareModal');
        modal.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('modal-open');
        
        // Refresh shared images display
        loadSharedImagesForSubject();
    }, 1500);
});

/**
 * Load and display shared images for current subject
 */
function loadSharedImagesForSubject() {
    sharedImagesList.innerHTML = '';
    
    // Load from localStorage
    const stored = localStorage.getItem('studyHiveSharedImages');
    if (stored) {
        sharedImages = JSON.parse(stored);
    }

    const subjectShared = sharedImages[currentSubject] || [];

    if (subjectShared.length === 0) {
        noShared.style.display = 'block';
        return;
    }

    noShared.style.display = 'none';

    subjectShared.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'shared-image-card';
        card.innerHTML = `
            <a href="${image.fullUrl}" target="_blank" class="shared-image-thumb">
                <img src="${image.url}" alt="${image.title}">
            </a>
            <div class="shared-image-info">
                <p class="shared-title">${image.title}</p>
                ${image.note ? `<p class="shared-note">"${image.note}"</p>` : ''}
                <small>Shared by ${image.sharedBy} at ${image.sharedAt}</small>
            </div>
            <button type="button" class="btn-remove-shared" title="Remove from group" onclick="removeSharedImage('${currentSubject}', ${index})">
                ✕
            </button>
        `;
        sharedImagesList.appendChild(card);
    });
}

/**
 * Remove shared image from group
 */
window.removeSharedImage = function(subject, index) {
    if (!sharedImages[subject]) return;
    
    if (confirm('Remove this resource from the group?')) {
        sharedImages[subject].splice(index, 1);
        saveSharedImagesToStorage();
        loadSharedImagesForSubject();
    }
};

/**
 * Save shared images to localStorage
 */
function saveSharedImagesToStorage() {
    localStorage.setItem('studyHiveSharedImages', JSON.stringify(sharedImages));
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

// ============================================
// MODAL CLOSE HANDLER
// ============================================

document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.documentElement.classList.remove('modal-open');
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('modal-open');
    }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    updateSubjectDisplay();
    loadSharedImagesForSubject();
    console.log('Subject Resources module initialized');
});
