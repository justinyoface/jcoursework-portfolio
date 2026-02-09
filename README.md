# Justin Rodriguez Portfolio Website

A modern, responsive portfolio website with filtering, lightbox functionality, and easy customization. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Grid Layout** - Adapts beautifully to all screen sizes
- **Project Filtering** - Filter by Graphic Design, Illustration, Animation, or view All
- **Lightbox Gallery** - Click any project to view full details with descriptions
- **Keyboard Navigation** - Use arrow keys to navigate lightbox, ESC to close
- **Mobile-Friendly** - Full mobile menu and touch-optimized interactions
- **Easy to Customize** - Simple data structure for adding/editing projects
- **Black & White Minimalist Design** - Matching your current Squarespace aesthetic

## Project Structure

```
jcoursework-portfolio/
│
├── index.html              # Main HTML file
├── README.md              # This file
│
├── css/
│   └── styles.css         # All styling
│
├── js/
│   ├── portfolio-data.js  # Portfolio projects data (EDIT THIS TO ADD PROJECTS)
│   └── main.js           # Interactive functionality
│
└── images/
    ├── logos/
    │   ├── jcoursework-logo.png       # Header logo
    │   └── jcoursework-logo-hero.png  # Hero section logo
    │
    └── projects/
        ├── project-1.jpg
        ├── project-2.jpg
        └── ...            # Your portfolio images go here
```

## Step-by-Step Setup Guide

### Step 1: Add Your Logos

1. Save your **header logo** as `images/logos/jcoursework-logo.png`
   - This appears in the top navigation
   - Recommended size: 200-400px width, transparent background

2. Save your **hero logo** as `images/logos/jcoursework-logo-hero.png`
   - This appears in the hero section
   - Recommended size: 600-800px width, transparent background

### Step 2: Add Your Portfolio Project Images

1. Place all your portfolio images in the `images/projects/` folder
2. Supported formats: JPG, PNG, GIF (for animations)
3. Recommended size: 1000-2000px width for best quality
4. Name them clearly (e.g., `brand-design-project.jpg`, `character-illustration.png`)

### Step 3: Add Your Projects to the Portfolio

1. Open `js/portfolio-data.js` in a text editor
2. Find the `portfolioProjects` array
3. Add your project using this template:

```javascript
{
    id: 10,  // Increment this number for each new project
    title: "Your Project Title",
    image: "images/projects/your-image-name.jpg",
    tags: ["graphic-design"],  // Choose: graphic-design, illustration, animation
    description: "A detailed description of your project. This appears in the lightbox when users click on the project. Explain the concept, your process, and what makes this work special."
}
```

**Important Notes:**
- Add a comma `,` after each project except the last one
- The `id` must be unique for each project
- Use the exact tag names: `"graphic-design"`, `"illustration"`, `"animation"`
- You can assign multiple tags: `tags: ["graphic-design", "illustration"]`

### Step 4: Customize Colors (Optional)

The site uses your black and white color scheme by default. To customize:

1. Open `css/styles.css`
2. Find the `:root` section at the top
3. Modify these variables:

```css
:root {
    --color-primary: #000000;      /* Main black color */
    --color-secondary: #ffffff;    /* White background */
    --color-text: #000000;         /* Text color */
    --color-background: #ffffff;   /* Page background */
    --color-border: #e0e0e0;      /* Subtle borders */
    --color-hover: #333333;       /* Hover state */
}
```

### Step 5: Update Navigation Links

1. Open `index.html`
2. Find the `<nav class="nav">` section
3. Update links:
   - **Instagram**: Replace `https://instagram.com` with your Instagram URL
   - **Shop**: Replace `#shop` with your shop URL
   - **Blog**: Replace `#blog` with your blog URL (e.g., Substack)

## Adding More Tags

As your portfolio grows, you can add new filter categories:

### Step 1: Add the Tag to Your Projects

In `js/portfolio-data.js`:

```javascript
{
    id: 15,
    title: "Web Design Project",
    image: "images/projects/web-project.jpg",
    tags: ["web-design"],  // New tag!
    description: "..."
}
```

### Step 2: Add Filter Button

In `index.html`, find `<section class="filter-section">` and add:

```html
<button class="filter-btn" data-filter="web-design">WEB DESIGN</button>
```

**Suggested Additional Tags:**
- `"photography"`
- `"web-design"`
- `"3d-modeling"`
- `"typography"`
- `"branding"`
- `"ui-ux"`
- `"packaging"`
- `"editorial"`

## Project Descriptions Best Practices

When writing descriptions in the lightbox:

1. **Be Specific** - Mention the client, purpose, or context
2. **Explain Your Process** - Share your creative approach
3. **Highlight Techniques** - Mention tools, styles, or methods used
4. **Keep It Concise** - 2-4 sentences is ideal
5. **Tell a Story** - What problem did this solve? What inspired it?

**Example Good Description:**

```javascript
description: "A brand identity system created for EcoBlend Coffee, a sustainable coffee roaster. The design emphasizes organic shapes and earthy tones to reflect their commitment to environmental responsibility. Deliverables included logo design, packaging, and brand guidelines."
```

## Lightbox Features

The lightbox automatically includes:
- **Full-size image display**
- **Project title**
- **All assigned tags**
- **Full description**
- **Previous/Next navigation** (only shows projects in current filter)
- **Keyboard controls** (← → arrows to navigate, ESC to close)
- **Click outside to close**

## Responsive Design

The site automatically adapts to different screen sizes:

- **Mobile** (< 768px): Single column grid, hamburger menu
- **Tablet** (768px - 1199px): 2-3 column grid
- **Desktop** (1200px+): 3-4 column grid

## Browser Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)
- Safari (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select main branch → Save
5. Your site will be live at `username.github.io/repository-name`

### Option 2: Netlify (Free)

1. Drag and drop the `jcoursework-portfolio` folder to [Netlify](https://app.netlify.com)
2. Site goes live immediately with a custom URL
3. Optional: Connect a custom domain

### Option 3: Vercel (Free)

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project folder
3. Follow prompts to deploy

### Option 4: Traditional Web Hosting

1. Upload all files via FTP to your web host
2. Ensure `index.html` is in the root directory

## Customization Tips

### Change Font

In `css/styles.css`, modify the `--font-primary` variable:

```css
--font-primary: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
```

Don't forget to add the font import at the top of the CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

### Adjust Grid Spacing

Modify these variables in `:root`:

```css
--spacing-md: 2rem;  /* Gap between projects */
```

### Change Hover Effects

Find `.portfolio-item:hover` in the CSS and adjust:

```css
.portfolio-item:hover {
    transform: translateY(-8px);  /* Lift amount */
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);  /* Shadow */
}
```

## Troubleshooting

### Images Not Showing

- Check file paths are correct and match exactly (case-sensitive)
- Ensure images are in the `images/projects/` folder
- Verify image file extensions match (`.jpg` vs `.JPG`)

### Filtering Not Working

- Ensure tags in `portfolio-data.js` match filter button `data-filter` attributes exactly
- Check for typos: `"graphic-design"` not `"graphic design"`
- Verify commas are placed correctly in the JavaScript array

### Lightbox Not Opening

- Check browser console for JavaScript errors (F12 → Console tab)
- Ensure `portfolio-data.js` is loaded before `main.js`
- Verify the script tags are in the correct order in `index.html`

## Performance Tips

1. **Optimize Images**: Use tools like [TinyPNG](https://tinypng.com) to compress images
2. **Lazy Loading**: Already implemented for images
3. **Use WebP Format**: Modern browsers support WebP for smaller file sizes
4. **Limit Project Count**: Consider pagination if you have 50+ projects

## Future Enhancements

Consider adding:
- **Search functionality** for projects
- **Load more** button for pagination
- **Social sharing** buttons
- **Contact form**
- **Analytics** (Google Analytics, Plausible)
- **Dark mode toggle**
- **Project categories** (in addition to tags)

## Support

For questions or issues:
- Check this README thoroughly
- Review code comments in each file
- Test in different browsers
- Check browser console for error messages

---

**Built for Justin Rodriguez** | Modern Portfolio System
Version 1.0 | 2026
