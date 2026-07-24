# 🚀 Quick Start Guide - Axios Image Search

## What You Get

A **fully functional image search feature** for StudyHive using axios! Users can:
- 🔍 Search for images by keyword
- 🎨 Filter by color and orientation  
- 📱 Use on any device (responsive)
- 🎯 Click to view full resolution
- 👤 Visit photographer profiles

## Files Added

| File | Purpose |
|------|---------|
| `image-search.html` | Search page UI |
| `image-search.js` | Axios-based search logic |
| `image-search.css` | Styling |
| `package.json` | Dependencies (axios) |
| `IMAGE_SEARCH_SETUP.md` | Detailed setup guide |
| `AXIOS_EXAMPLES.js` | Axios usage patterns |

## Setup (2 steps)

### Step 1: Get API Key
1. Go to https://unsplash.com/oauth/applications
2. Create new app → Accept terms → Create
3. Copy your **Access Key**

### Step 2: Configure Key
Open **image-search.js** line 2:

```javascript
// BEFORE:
const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY';

// AFTER:
const UNSPLASH_API_KEY = 'YOUR_ACTUAL_KEY_HERE';
```

**That's it! You're done.** 🎉

## Usage

1. Click **"Image Search"** in the navigation menu
2. Enter a search term (e.g., "biology", "calculus")
3. Click **Search**
4. Browse results and click "Open" to view full resolution
5. (Optional) Enable color/orientation filters for advanced search

## Axios Features Used

✅ **axios.create()** - Reusable client with config  
✅ **Interceptors** - Automatic headers injection  
✅ **Error handling** - Catches all error types  
✅ **Timeout** - 10 second limit  
✅ **Async/await** - Clean syntax  

## Key Code Example

```javascript
// Create configured client
const imageSearchClient = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
    },
    timeout: 10000
});

// Make request
const response = await imageSearchClient.get('/search/photos', {
    params: {
        query: 'study',
        page: 1,
        per_page: 20,
        color: 'blue',
        orientation: 'landscape'
    }
});

// Process results
displayImages(response.data.results);
```

## Testing Without API Key

To test the UI without configuring an API key:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run: `displayImages([{urls:{small:'https://via.placeholder.com/300',full:'#'},alt_description:'Test',user:{name:'Demo',portfolio_url:'#'}}])`
4. You'll see a placeholder image

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Invalid API key" | Check API key in image-search.js (line 2) |
| "Rate limit exceeded" | Free tier is 50 requests/hour |
| No images load | Clear browser cache, check internet |
| Blank page | Check browser console (F12) for errors |

## Optional: Install Locally

To use local axios instead of CDN:

```bash
npm install
```

Then in `image-search.html` line 108, change:
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

To:
```html
<script src="./node_modules/axios/dist/axios.min.js"></script>
```

## Next Steps

Once it's working:
- [ ] Add more filters (size, date, etc.)
- [ ] Create saved collections
- [ ] Add download functionality
- [ ] Integrate with presentation builder
- [ ] Add user rating/favorites

## Support

- See **IMAGE_SEARCH_SETUP.md** for detailed guide
- See **AXIOS_EXAMPLES.js** for code patterns
- Unsplash API docs: https://unsplash.com/documentation
- Axios docs: https://axios-http.com/

---

**Have fun! Happy searching! 🎓📚**
