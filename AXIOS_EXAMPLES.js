/**
 * Axios Usage Examples for Image Search
 * This file demonstrates various axios patterns used in the image search feature
 */

// ============================================
// 1. BASIC AXIOS SETUP
// ============================================

/*
// Simple GET request
axios.get('https://api.unsplash.com/search/photos', {
    params: { query: 'nature' },
    headers: { 'Authorization': `Client-ID YOUR_API_KEY` }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
*/

// ============================================
// 2. AXIOS INSTANCE (Used in our code)
// ============================================

/*
const client = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        'Authorization': `Client-ID YOUR_API_KEY`
    },
    timeout: 10000
});

// Now can call simply:
client.get('/search/photos', { params: { query: 'study' } });
*/

// ============================================
// 3. ASYNC/AWAIT PATTERN (Recommended)
// ============================================

/*
async function searchImages(query) {
    try {
        const response = await imageSearchClient.get('/search/photos', {
            params: { 
                query: query,
                page: 1,
                per_page: 20 
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Search failed:', error.message);
    }
}

// Usage:
const results = await searchImages('biology');
*/

// ============================================
// 4. ERROR HANDLING
// ============================================

/*
try {
    const response = await imageSearchClient.get('/search/photos', { params: { query } });
} catch (error) {
    if (error.response) {
        // Server responded with error status
        console.log('Error:', error.response.status); // 401, 403, 404, etc.
        console.log('Data:', error.response.data);
    } else if (error.request) {
        // Request made but no response
        console.log('No response received');
    } else {
        // Error in request setup
        console.log('Error:', error.message);
    }
}
*/

// ============================================
// 5. REQUEST WITH CUSTOM PARAMETERS
// ============================================

/*
const config = {
    params: {
        query: 'landscape',
        page: 1,
        per_page: 30,
        order_by: 'relevant',
        color: 'blue',
        orientation: 'landscape'
    },
    headers: {
        'Accept-Version': 'v1'
    },
    timeout: 15000
};

const response = await imageSearchClient.get('/search/photos', config);
*/

// ============================================
// 6. INTERCEPTORS (For advanced use)
// ============================================

/*
// Request interceptor
imageSearchClient.interceptors.request.use(
    config => {
        console.log('Request:', config);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
imageSearchClient.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);
*/

// ============================================
// 7. MULTIPLE CONCURRENT REQUESTS
// ============================================

/*
// Perform multiple searches at once
const [nature, tech, art] = await Promise.all([
    imageSearchClient.get('/search/photos', { params: { query: 'nature' } }),
    imageSearchClient.get('/search/photos', { params: { query: 'technology' } }),
    imageSearchClient.get('/search/photos', { params: { query: 'art' } })
]);

console.log('Results:', {
    nature: nature.data.results,
    tech: tech.data.results,
    art: art.data.results
});
*/

// ============================================
// 8. PAGINATION
// ============================================

/*
async function getPagedResults(query, page = 1) {
    try {
        const response = await imageSearchClient.get('/search/photos', {
            params: {
                query: query,
                page: page,
                per_page: 20
            }
        });

        console.log(`Page ${page}:`, response.data.results.length, 'images');
        console.log('Total results:', response.data.total);
        
        return response.data;
    } catch (error) {
        console.error('Pagination error:', error.message);
    }
}

// Usage:
const page1 = await getPagedResults('study', 1);
const page2 = await getPagedResults('study', 2);
*/

// ============================================
// 9. REQUEST TIMEOUT EXAMPLE
// ============================================

/*
// This will timeout after 5 seconds
const response = await axios.get('https://api.unsplash.com/search/photos', {
    params: { query: 'test' },
    timeout: 5000  // 5 seconds
}).catch(error => {
    if (error.code === 'ECONNABORTED') {
        console.log('Request timeout');
    }
});
*/

// ============================================
// 10. CANCEL REQUESTS (Advanced)
// ============================================

/*
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// Start request
imageSearchClient.get('/search/photos', {
    params: { query: 'test' },
    cancelToken: source.token
}).catch(error => {
    if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
    }
});

// Cancel the request
source.cancel('User cancelled the request');
*/

// ============================================
// 11. COMPARISON: FETCH VS AXIOS
// ============================================

/*
// FETCH API (Vanilla JavaScript)
fetch('https://api.unsplash.com/search/photos?query=nature', {
    headers: {
        'Authorization': 'Client-ID YOUR_API_KEY'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

// AXIOS (Cleaner and more powerful)
axios.get('https://api.unsplash.com/search/photos', {
    params: { query: 'nature' },
    headers: { 'Authorization': 'Client-ID YOUR_API_KEY' }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));

// Key Differences:
// - Axios auto-transforms JSON
// - Better error handling
// - Request cancellation
// - Interceptors support
// - Timeout by default
// - Auto-stringifies/parses data
*/

// ============================================
// 12. REAL-WORLD USAGE IN OUR APP
// ============================================

/*
// This is exactly what our image-search.js does:

const imageSearchClient = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
    },
    timeout: 10000
});

async function performSearch() {
    try {
        showLoading(true);
        
        const params = {
            query: currentSearchQuery,
            page: currentPage,
            per_page: 20,
            order_by: 'relevant'
        };

        // The key axios call
        const response = await imageSearchClient.get('/search/photos', { params });

        if (!response.data.results || response.data.results.length === 0) {
            showError('No images found');
            return;
        }

        displayImages(response.data.results);
        showLoading(false);

    } catch (error) {
        let message = error.message;
        
        if (error.response?.status === 401) {
            message = 'Invalid API key';
        } else if (error.response?.status === 403) {
            message = 'Rate limit exceeded';
        } else if (error.code === 'ECONNABORTED') {
            message = 'Request timeout';
        }
        
        showError(message);
        showLoading(false);
    }
}
*/

// ============================================
// 13. PERFORMANCE TIPS WITH AXIOS
// ============================================

/*
// 1. Use create() for reusable instances
const client = axios.create({ /* config */ });

// 2. Set reasonable timeouts
axios.defaults.timeout = 10000;

// 3. Use request interceptors for loading state
client.interceptors.request.use(config => {
    showLoading(true);
    return config;
});

// 4. Use response interceptors for cleanup
client.interceptors.response.use(
    response => {
        showLoading(false);
        return response;
    },
    error => {
        showLoading(false);
        return Promise.reject(error);
    }
);

// 5. Implement retry logic
async function retryRequest(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
*/

console.log('Axios Usage Examples loaded. See comments for patterns.');
