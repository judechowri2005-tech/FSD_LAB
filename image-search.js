// Unsplash API Configuration
const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY'; // Get from https://unsplash.com/oauth/applications
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

// Create axios instance with base configuration
const imageSearchClient = axios.create({
    baseURL: UNSPLASH_API_BASE,
    headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
    },
    timeout: 10000
});

// DOM Elements
const imageSearchForm = document.getElementById('imageSearchForm');
const searchInput = document.getElementById('searchInput');
const imageGrid = document.getElementById('imageGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const colorFilter = document.getElementById('colorFilter');
const orientationFilter = document.getElementById('orientationFilter');
const filterOptions = document.getElementById('filterOptions');
const colorSelect = document.getElementById('colorSelect');
const orientationSelect = document.getElementById('orientationSelect');

let currentSearchQuery = '';
let currentPage = 1;

// Toggle filter options visibility
colorFilter.addEventListener('change', () => {
    filterOptions.style.display = colorFilter.checked || orientationFilter.checked ? 'flex' : 'none';
});

orientationFilter.addEventListener('change', () => {
    filterOptions.style.display = colorFilter.checked || orientationFilter.checked ? 'flex' : 'none';
});

// Handle form submission
imageSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a search query');
        return;
    }

    if (!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'YOUR_UNSPLASH_API_KEY') {
        showError('Please configure your Unsplash API key in image-search.js');
        return;
    }

    currentSearchQuery = query;
    currentPage = 1;
    await performSearch();
});

/**
 * Performs the image search using axios
 */
async function performSearch() {
    try {
        showLoading(true);
        hideError();
        
        // Build query parameters
        const params = {
            query: currentSearchQuery,
            page: currentPage,
            per_page: 20,
            order_by: 'relevant'
        };

        // Add optional filters
        if (colorSelect.value) {
            params.color = colorSelect.value;
        }
        if (orientationSelect.value) {
            params.orientation = orientationSelect.value;
        }

        console.log('Performing search with params:', params);

        // Make request using axios
        const response = await imageSearchClient.get('/search/photos', { params });

        console.log('Search results:', response.data);

        if (!response.data.results || response.data.results.length === 0) {
            showError('No images found. Try a different search term.');
            showLoading(false);
            return;
        }

        // Display results
        displayImages(response.data.results, currentPage === 1);
        showLoading(false);

    } catch (error) {
        console.error('Search error:', error);
        
        if (error.response?.status === 401) {
            showError('Invalid API key. Please check your Unsplash API configuration.');
        } else if (error.response?.status === 403) {
            showError('API rate limit exceeded. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            showError('Request timeout. Please try again.');
        } else {
            showError(`Error searching images: ${error.message}`);
        }
        
        showLoading(false);
    }
}

/**
 * Display images in the grid
 */
function displayImages(images, clearGrid = true) {
    if (clearGrid) {
        imageGrid.innerHTML = '';
    }

    images.forEach((image) => {
        const imageCard = createImageCard(image);
        imageGrid.appendChild(imageCard);
    });
}

/**
 * Create an image card element
 */
function createImageCard(image) {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = image.urls.small;
    img.alt = image.alt_description || 'Unsplash image';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const info = document.createElement('div');
    info.className = 'image-info';
    info.innerHTML = `
        <p class="image-title">${image.alt_description || 'Untitled'}</p>
        <p class="image-by">by ${image.user.name}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'image-actions';
    actions.innerHTML = `
        <a href="${image.urls.full}" target="_blank" class="btn-download" title="View Full Resolution">
            Open
        </a>
        <a href="${image.user.portfolio_url || '#'}" target="_blank" class="btn-artist" title="View Artist">
            Artist
        </a>
    `;

    overlay.appendChild(info);
    overlay.appendChild(actions);
    card.appendChild(img);
    card.appendChild(overlay);

    return card;
}

/**
 * Load more images (pagination)
 */
async function loadMore() {
    if (!currentSearchQuery) {
        showError('Please perform a search first');
        return;
    }
    
    currentPage++;
    await performSearch();
}

/**
 * Show loading spinner
 */
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

// Infinite scroll - load more images when user scrolls near bottom
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        // Only auto-load if we have a current search
        if (currentSearchQuery && !loadingSpinner.style.display.includes('none')) {
            return; // Already loading
        }
    }
});

console.log('Image Search module loaded. Configure UNSPLASH_API_KEY to get started.');
