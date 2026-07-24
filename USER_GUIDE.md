# 📸 How to Use - Image Search Feature

## Step-by-Step Guide

### 1️⃣ Access the Feature

**Via Navigation Menu:**
- Look for **"Image Search"** in the top navigation bar
- Click it to go to the search page

**Direct URL:**
- Open `image-search.html` in your browser

### 2️⃣ Enter Search Query

```
┌─────────────────────────────────────┐
│  Search for images...               │
│  [Type your query here]          [Search]
└─────────────────────────────────────┘
```

Examples:
- `biology` - Find biology-related images
- `calculus` - Calculus study materials
- `history timeline` - Historical content
- `presentation templates` - Design inspiration
- `study notes` - Study-related images

### 3️⃣ (Optional) Add Filters

```
☑ Show color filter
☑ Show orientation filter

Color:          [Any Color ▼]
Orientation:    [Any Orientation ▼]
```

**Color Options:**
- Black & White
- Black, White, Yellow, Orange, Red
- Purple, Green, Blue

**Orientation Options:**
- Landscape (wide)
- Portrait (tall)
- Square (equal)

### 4️⃣ Click Search

The page will:
1. Show a loading spinner 🔄
2. Connect to Unsplash API via axios
3. Retrieve matching images
4. Display them in a grid

### 5️⃣ View Results

Images appear in a responsive grid:

```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Image 1 │ │ Image 2 │ │ Image 3 │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Image 4 │ │ Image 5 │ │ Image 6 │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
```

Each image shows:
- Thumbnail preview
- Image title
- Photographer name
- Two action buttons

### 6️⃣ Interact with Images

**Hover over an image to see options:**

```
        Image Title Here
         by John Smith
     
    [🔗 Open]  [👤 Artist]
```

**🔗 Open Button:**
- Opens the full-resolution version in a new tab
- Save it to your device if needed
- Perfect for presentations

**👤 Artist Button:**
- Opens the photographer's profile
- Learn more about their work
- Follow them on Unsplash

### 7️⃣ Search Again

- Modify your search term
- Click Search again
- Results will update
- Previous results are cleared

## Common Tasks

### Task: Find Images for Biology Project

```
1. Click "Image Search" in nav
2. Type: "cells biology" or "dna"
3. Optional: Set Color = Blue, Green
4. Click "Search"
5. Click "🔗 Open" on best images
6. Download or screenshot for project
```

### Task: Find Presentation Background

```
1. Type: "abstract background" or "minimal design"
2. Optional: Set Orientation = Landscape
3. Click "Search"
4. Choose image with right colors/style
5. Right-click → "Save image as..."
6. Use in presentation
```

### Task: Find Study Material Illustration

```
1. Search for specific topic (e.g., "photosynthesis")
2. Enable Color Filter, pick colors
3. Browse results
4. Click "👤 Artist" to see photographer's portfolio
5. Use best image in study notes
```

## Understanding Axios in the Background

When you search, here's what happens:

```
You Type "biology"
        ↓
    Click Search
        ↓
    JavaScript captures query
        ↓
    axios creates HTTP request
        ↓
    Sends to: https://api.unsplash.com/search/photos?query=biology
        ↓
    Unsplash API processes request
        ↓
    Returns JSON with image URLs and metadata
        ↓
    axios receives response
        ↓
    JavaScript extracts image data
        ↓
    Images display in grid
        ↓
    ✨ You see the results!
```

**Key axios Features Working:**
- ✅ Automatic header injection (API key)
- ✅ JSON auto-parsing
- ✅ Error handling
- ✅ 10-second timeout
- ✅ Request parameters building

## Error Messages & Solutions

### "Invalid API key"
**Problem:** API key not configured
**Solution:** Edit `image-search.js` line 2, add your key

### "API rate limit exceeded"
**Problem:** Too many requests in 1 hour
**Solution:** Wait 1 hour, or upgrade Unsplash plan

### "Request timeout"
**Problem:** Server took too long to respond
**Solution:** Try again, or try different search term

### "No images found"
**Problem:** Search term has no results
**Solution:** Try a different or simpler search term

## Tips & Tricks

### 💡 Pro Tips

1. **Specific searches are better**
   - ❌ "study" - too vague
   - ✅ "molecular structure" - specific

2. **Use filters for quality**
   - Filters narrow results
   - Faster to find what you need

3. **Check artist profiles**
   - Click "👤 Artist"
   - See all their photos
   - Find more similar content

4. **Combine with presentation tools**
   - Use images in PowerPoint
   - Add to Google Slides
   - Include in Canva designs

### ⚡ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit search (when focused on input) |
| `Escape` | Close any overlays |

## Browser Compatibility

Works on:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

**Requirements:**
- JavaScript enabled
- Internet connection
- Modern browser

## Mobile Usage

On phones and tablets:

1. Tap search bar
2. Type search query (phone keyboard appears)
3. Tap "Search" button
4. Grid adapts to screen size
5. Tap images to see options
6. Images open in new tab

The grid automatically resizes:
- 📱 Phone: 1-2 columns
- 📱 Tablet: 2-3 columns  
- 💻 Desktop: 4-5 columns

## Data Privacy

- ✅ No personal data collected
- ✅ Only send search queries to Unsplash
- ✅ No cookies used
- ✅ Local browser cache only
- ✅ Your searches aren't stored

## Performance

- **First search:** 1-2 seconds
- **Subsequent searches:** Instant (cached)
- **Images load:** As you scroll
- **No page lag:** Optimized code

## Frequently Asked Questions

**Q: Can I download images?**
A: Yes! Click "🔗 Open" → right-click → Save

**Q: Can I use images commercially?**
A: Check Unsplash license (most are free)

**Q: Why no results for my search?**
A: Try simpler terms or different keywords

**Q: How many images can I search?**
A: 50/hour limit for free Unsplash tier

**Q: Can I save favorite images?**
A: Not yet - bookmark page or screenshot

**Q: Does it work offline?**
A: No - needs internet for API

## Need Help?

1. Check browser console (F12) for errors
2. Read `QUICK_START.md` for setup
3. See `IMAGE_SEARCH_SETUP.md` for details
4. View `AXIOS_EXAMPLES.js` for code patterns

---

**That's it! You're ready to search! 🚀📚**
