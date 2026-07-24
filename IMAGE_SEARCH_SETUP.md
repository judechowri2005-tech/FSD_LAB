# Image Search Implementation Guide

## Overview
This implementation adds a **complete image search feature** to StudyHive using **axios** as the HTTP client to fetch images from the Unsplash API.

## Features Implemented

✅ **Axios Integration**
- Created axios instance with base configuration
- Automatic request/response handling
- Built-in error handling and timeout management

✅ **Image Search Functionality**
- Search for images by keyword
- Filter by color and orientation
- Real-time loading indicators
- Error handling with user-friendly messages

✅ **UI/UX Components**
- Responsive image grid layout
- Image cards with hover overlays
- Click-through links to full resolution
- Artist attribution and links

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Optimized grid layout for different screen sizes

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This installs axios (CDN is also loaded in image-search.html as fallback).

### 2. Get Unsplash API Key

1. Go to **https://unsplash.com/oauth/applications**
2. Create a new application
3. Accept the terms and create the app
4. Copy your **Access Key**

### 3. Configure API Key

Edit **image-search.js** and replace:

```javascript
const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY';
```

With your actual Unsplash API key:

```javascript
const UNSPLASH_API_KEY = 'your_actual_api_key_here';
```

### 4. Access the Feature

Open **image-search.html** in your browser or navigate to it via the "Image Search" link in the navigation menu.

## File Structure

```
.
├── image-search.html          # Main search page (HTML)
├── image-search.js            # Axios-based search logic (JavaScript)
├── image-search.css           # Styling for search feature (CSS)
├── package.json               # Dependencies (includes axios)
├── index.html                 # Updated with Image Search nav link
└── script.js                  # Existing modal and form logic
```

## How It Works

### Axios Configuration
```javascript
const imageSearchClient = axios.create({
    baseURL: UNSPLASH_API_BASE,
    headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
    },
    timeout: 10000
});
```

### Search Request
```javascript
const response = await imageSearchClient.get('/search/photos', { 
    params: {
        query: searchQuery,
        page: 1,
        per_page: 20,
        color: selectedColor,
        orientation: selectedOrientation
    }
});
```

### Error Handling
- ❌ Invalid API key → Clear error message
- ❌ Rate limit exceeded → Helpful message
- ❌ Network timeout → Automatic retry suggestion
- ❌ No results found → Prompt for new search

## Key Axios Features Used

1. **Interceptors** - Automatic auth header injection
2. **Timeout** - 10 second request timeout
3. **Base URL** - Simplified endpoint calls
4. **Promise-based** - Clean async/await syntax
5. **Error Response** - Detailed error information

## API Endpoints Used

- `GET /search/photos` - Search for images with filters

## Filters Available

### Color Filters
- Black & White
- Black, White, Yellow, Orange
- Red, Purple, Green, Blue

### Orientation Filters
- Landscape
- Portrait
- Square

## Usage Examples

### Basic Search
1. Enter a search term (e.g., "biology")
2. Click "Search"
3. Browse results

### Advanced Search
1. Enable "Show color filter" and/or "Show orientation filter"
2. Select desired filters
3. Perform search
4. Results will respect your filters

### View Full Image
Click the "🔗 Open" button on any image card to view the full resolution version.

### Visit Artist Profile
Click the "👤 Artist" button to visit the photographer's Unsplash profile.

## Customization

### Change API Provider
To use a different image API (Pixabay, Pexels, etc.), modify:
- `image-search.js` - API endpoint and parameters
- `image-search.html` - Filter options if needed
- Authentication headers in axios config

### Modify Grid Layout
In `image-search.css`, adjust:
```css
.image-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    /* Change minmax values for different card sizes */
}
```

### Add More Filters
1. Add filter checkbox in `image-search.html`
2. Add filter select/option in `.filter-options`
3. Update filter logic in `image-search.js` `performSearch()` function

## Troubleshooting

### "Invalid API key" Error
- Check that `UNSPLASH_API_KEY` is correctly set in `image-search.js`
- Verify API key from Unsplash dashboard
- Ensure there are no extra spaces

### "API rate limit exceeded"
- Unsplash free tier: 50 requests/hour
- Wait before making more requests, or
- Upgrade to a paid plan for higher limits

### Images Not Loading
- Check browser console for errors (F12)
- Verify internet connection
- Clear browser cache and reload
- Check CORS settings (should work on all domains)

### No Results Found
- Try different search terms
- Use simpler keywords
- Check spelling

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

Requires:
- JavaScript enabled
- Fetch API or XMLHttpRequest support
- CORS support

## Performance Tips

1. **Lazy Loading** - Images load only when visible
2. **Pagination** - Load 20 images at a time (not all)
3. **Timeout** - 10 second timeout prevents hanging
4. **Caching** - Browser automatically caches images

## Security Notes

- API key is visible in frontend code
- Consider using backend proxy in production
- Unsplash API key has rate limits per IP

## Next Steps

### Features You Could Add:
- [ ] Save favorite images to local storage
- [ ] Create collections of related images
- [ ] Share image links with team members
- [ ] Download images directly to device
- [ ] Image cropping/editing before use
- [ ] Integration with presentation tool

### Backend Integration:
- [ ] Store searched images in database
- [ ] Track image usage statistics
- [ ] Create admin dashboard
- [ ] Implement user image uploads

## Support & Resources

- **Unsplash API Docs**: https://unsplash.com/documentation
- **Axios Docs**: https://axios-http.com/docs/intro
- **MDN Web Docs**: https://developer.mozilla.org/

## Notes

- This implementation uses a CDN version of axios as fallback
- npm install is optional (CDN works standalone)
- To use local axios after npm install:
  - Change `<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>`
  - To `<script src="./node_modules/axios/dist/axios.min.js"></script>`

---

**Happy searching! 🔍📚**
