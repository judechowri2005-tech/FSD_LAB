/**
 * Peer Chat with Axios Image Resource Sharing
 * Allows study groups to share images and resources in real-time
 */

// ============================================
// STATE & CONFIGURATION
// ============================================

let peerChatState = {
    currentRoom: 'Advanced Data Structures',
    currentUser: 'Jude',
    peers: ['Jude (You)', 'Jack', 'Dean', 'Amara'],
    messages: [],
    sharedResources: []
};

// DOM Elements
const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const chatMessage = document.getElementById('chatMessage');
const attachResourceBtn = document.getElementById('attachResourceBtn');
const resourceModal = document.getElementById('resourceModal');
const searchResourcesBtn = document.getElementById('searchResourcesBtn');
const shareImageBtn = document.getElementById('shareImageBtn');
const viewSharedBtn = document.getElementById('viewSharedBtn');
const resourceSearchInput = document.getElementById('resourceSearchInput');
const searchResourcesInModal = document.getElementById('searchResourcesInModal');
const resourceGrid = document.getElementById('resourceGrid');
const resourceLoading = document.getElementById('resourceLoading');
const recentShared = document.getElementById('recentShared');
const peersList = document.getElementById('peersList');

// ============================================
// CHAT MESSAGING
// ============================================

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatMessage.value.trim();
    
    if (!message) return;

    // Add message to chat
    addMessageToChat(peerChatState.currentUser, message, 'just now');
    
    // Clear input
    chatMessage.value = '';
    chatMessage.style.height = 'auto';
});

/**
 * Add message to chat display
 */
function addMessageToChat(user, text, time = 'just now') {
    const article = document.createElement('article');
    article.className = user === peerChatState.currentUser ? 'message-own' : '';
    
    // Check if message contains image URLs
    const imageUrls = extractImageUrls(text);
    let content = sanitizeText(text);

    article.innerHTML = `
        <small>${user} • ${time}</small>
        <p>${content}</p>
    `;

    // Add image previews if found
    if (imageUrls.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'message-images';
        
        imageUrls.forEach(url => {
            const imgWrapper = document.createElement('a');
            imgWrapper.href = url;
            imgWrapper.target = '_blank';
            imgWrapper.className = 'message-image-link';
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Shared resource';
            
            imgWrapper.appendChild(img);
            imageContainer.appendChild(imgWrapper);
        });
        
        article.appendChild(imageContainer);
    }

    chatBox.appendChild(article);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Extract image URLs from message
 */
function extractImageUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    return text.match(urlRegex) || [];
}

/**
 * Sanitize text to prevent XSS
 */
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// RESOURCE SEARCH & SHARING (AXIOS)
// ============================================

attachResourceBtn.addEventListener('click', () => {
    resourceModal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    resourceSearchInput.focus();
});

searchResourcesInModal.addEventListener('click', async () => {
    const query = resourceSearchInput.value.trim();
    if (!query) {
        alert('Please enter a search query');
        return;
    }

    const fullQuery = `${peerChatState.currentRoom} ${query}`;
    await searchResourcesForShare(fullQuery);
});

resourceSearchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchResourcesInModal.click();
    }
});

/**
 * Search for resources using axios
 */
async function searchResourcesForShare(query) {
    try {
        resourceLoading.style.display = 'flex';
        resourceGrid.innerHTML = '';

        if (!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'YOUR_UNSPLASH_API_KEY') {
            resourceGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="color: #c33;">API key not configured</p>
                    <small>Configure UNSPLASH_API_KEY in image-search.js</small>
                </div>
            `;
            resourceLoading.style.display = 'none';
            return;
        }

        const params = {
            query: query,
            page: 1,
            per_page: 12,
            order_by: 'relevant'
        };

        // Use axios client from image-search.js
        const response = await imageSearchClient.get('/search/photos', { params });

        if (!response.data.results || response.data.results.length === 0) {
            resourceGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p>No resources found for "${query}"</p>
                </div>
            `;
            resourceLoading.style.display = 'none';
            return;
        }

        displayResourcesForSharing(response.data.results);
        resourceLoading.style.display = 'none';

    } catch (error) {
        console.error('Search error:', error);
        resourceGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #c33;">
                <p>Error searching resources: ${error.message}</p>
            </div>
        `;
        resourceLoading.style.display = 'none';
    }
}

/**
 * Display resources for sharing in modal
 */
function displayResourcesForSharing(images) {
    resourceGrid.innerHTML = '';

    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'resource-card-modal';
        card.innerHTML = `
            <img src="${image.urls.small}" alt="${image.alt_description || 'Resource'}">
            <div class="resource-card-overlay">
                <button type="button" class="btn-share-to-chat">
                    📤 Share to Chat
                </button>
            </div>
        `;

        const shareBtn = card.querySelector('.btn-share-to-chat');
        shareBtn.addEventListener('click', () => {
            shareResourceToChat(image);
        });

        resourceGrid.appendChild(card);
    });
}

/**
 * Share resource to chat
 */
function shareResourceToChat(image) {
    // Create message with image
    const message = `
📸 Shared a study resource:
**${image.alt_description || 'Resource Image'}**
by ${image.user.name}

${image.urls.full}
    `.trim();

    addMessageToChat(peerChatState.currentUser, message, 'just now');

    // Save to shared resources
    peerChatState.sharedResources.push({
        id: image.id,
        title: image.alt_description,
        url: image.urls.small,
        fullUrl: image.urls.full,
        photographer: image.user.name,
        sharedBy: peerChatState.currentUser,
        timestamp: new Date().toLocaleTimeString()
    });

    // Update recent shared widget
    updateRecentShared();

    // Close modal
    resourceModal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');

    // Show success
    alert('✅ Resource shared with peers!');
}

/**
 * Update recent shared resources display
 */
function updateRecentShared() {
    recentShared.innerHTML = '';

    // Show last 3 shared resources
    const recent = peerChatState.sharedResources.slice(-3).reverse();

    if (recent.length === 0) {
        recentShared.innerHTML = '<p style="color: #999; font-size: 0.9rem;">No resources shared yet</p>';
        return;
    }

    recent.forEach(resource => {
        const item = document.createElement('div');
        item.className = 'recent-shared-item';
        item.innerHTML = `
            <a href="${resource.fullUrl}" target="_blank" class="recent-shared-thumb">
                <img src="${resource.url}" alt="${resource.title}">
            </a>
            <div class="recent-shared-info">
                <p class="recent-title">${resource.title}</p>
                <small>${resource.sharedBy}</small>
            </div>
        `;
        recentShared.appendChild(item);
    });
}

// ============================================
// QUICK ACTION BUTTONS
// ============================================

searchResourcesBtn.addEventListener('click', () => {
    resourceModal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    resourceSearchInput.value = peerChatState.currentRoom;
    resourceSearchInput.focus();
});

shareImageBtn.addEventListener('click', () => {
    resourceModal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    resourceSearchInput.focus();
});

viewSharedBtn.addEventListener('click', () => {
    if (peerChatState.sharedResources.length === 0) {
        alert('No resources shared yet. Search and share one!');
        return;
    }

    // Create a view of all shared resources
    let html = '<h3>📌 All Shared Resources</h3><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">';
    
    peerChatState.sharedResources.forEach(resource => {
        html += `
            <a href="${resource.fullUrl}" target="_blank" title="${resource.title}">
                <img src="${resource.url}" alt="${resource.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;">
            </a>
        `;
    });

    html += '</div>';
    
    // Show in an alert or modal
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.setAttribute('aria-hidden', 'false');
    viewModal.innerHTML = `
        <div class="modal-content modal-large">
            <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            ${html}
            <p style="text-align: center; margin-top: 20px;">
                <button onclick="this.closest('.modal').remove()" class="btn-close-modal">Close</button>
            </p>
        </div>
    `;
    
    document.body.appendChild(viewModal);
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) viewModal.remove();
    });
});

// ============================================
// MODAL CLOSE HANDLERS
// ============================================

document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
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
// AUTO-EXPAND TEXTAREA
// ============================================

chatMessage.addEventListener('input', () => {
    chatMessage.style.height = 'auto';
    chatMessage.style.height = Math.min(chatMessage.scrollHeight, 120) + 'px';
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Peer Chat initialized');
    console.log('Study Room:', peerChatState.currentRoom);
    console.log('Active Peers:', peerChatState.peers);
});
