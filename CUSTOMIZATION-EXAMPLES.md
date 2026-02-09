# Customization Examples

Common customizations you might want to make to personalize your portfolio.

## Color Schemes

### Example 1: Dark Mode
In `css/styles.css`, change the root variables to:

```css
:root {
    --color-primary: #ffffff;      /* White text */
    --color-secondary: #000000;    /* Black background */
    --color-text: #ffffff;
    --color-background: #1a1a1a;   /* Dark gray */
    --color-border: #333333;
    --color-hover: #cccccc;
}
```

### Example 2: Accent Color
Add a brand color while keeping minimalist look:

```css
:root {
    --color-primary: #000000;
    --color-secondary: #ffffff;
    --color-accent: #0066ff;       /* Add accent color */
    --color-text: #000000;
    --color-background: #ffffff;
    --color-border: #e0e0e0;
    --color-hover: #0066ff;        /* Use accent for hover */
}
```

Then use `var(--color-accent)` in your CSS where you want the accent color.

### Example 3: Warm Minimal
Subtle warm tones instead of pure black/white:

```css
:root {
    --color-primary: #2b2b2b;      /* Warm dark gray */
    --color-secondary: #fafaf8;    /* Warm white */
    --color-text: #2b2b2b;
    --color-background: #fafaf8;
    --color-border: #e8e6e1;       /* Warm gray */
    --color-hover: #5a5a5a;
}
```

## Typography Changes

### Use Custom Font
At the top of `css/styles.css`, add:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

Popular font combinations:
- **Modern**: Inter, Helvetica Neue
- **Classic**: Playfair Display, Georgia
- **Creative**: Space Grotesk, Raleway
- **Editorial**: Crimson Text, Lora

### Adjust Font Sizes
Find these selectors in `css/styles.css` and modify:

```css
.hero-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);  /* Larger hero title */
}

.portfolio-item-title {
    font-size: 1.2rem;  /* Larger project titles */
}

.lightbox-title {
    font-size: 2.5rem;  /* Larger lightbox titles */
}
```

## Layout Modifications

### Wider Max Width
For larger screens, increase the max width:

```css
:root {
    --max-width: 2400px;  /* Default is 1800px */
}
```

### More/Fewer Columns
Change the grid columns:

```css
.portfolio-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    /* Larger minmax value = fewer columns */
    /* Smaller minmax value = more columns */
}
```

### Tighter/Looser Spacing
Adjust gaps between items:

```css
.portfolio-grid {
    gap: var(--spacing-xl);  /* Larger gaps */
    /* or */
    gap: var(--spacing-sm);  /* Tighter gaps */
}
```

## Adding New Sections

### About Section
Add after the hero section in `index.html`:

```html
<section class="about" id="about">
    <div class="about-content">
        <h2>About Me</h2>
        <p>Your bio and description here...</p>
    </div>
</section>
```

Then style in `css/styles.css`:

```css
.about {
    padding: var(--spacing-xl) var(--grid-gutter-mobile);
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about h2 {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
}
```

### Contact Section
Add before the footer in `index.html`:

```html
<section class="contact" id="contact">
    <div class="contact-content">
        <h2>Get In Touch</h2>
        <p>Email: <a href="mailto:your@email.com">your@email.com</a></p>
    </div>
</section>
```

## Filter Button Styles

### Rounded Pills Style
In `css/styles.css`, modify `.filter-btn`:

```css
.filter-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    border: 2px solid var(--color-primary);
    border-radius: 50px;  /* Fully rounded */
    /* ... rest of styles ... */
}
```

### Underline Style
Replace border with underline:

```css
.filter-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    transition: border-color var(--transition-speed);
}

.filter-btn.active,
.filter-btn:hover {
    background-color: transparent;
    border-bottom-color: var(--color-primary);
}
```

## Project Card Styles

### Add Borders
Give project items visible borders:

```css
.portfolio-item {
    border: 1px solid var(--color-border);
    /* ... rest of styles ... */
}
```

### Different Hover Effect
Change the hover behavior:

```css
.portfolio-item:hover {
    transform: scale(1.05);  /* Scale instead of lift */
    box-shadow: none;
    border-color: var(--color-primary);
}
```

### Show Overlay Always
Make the title always visible instead of on hover:

```css
.portfolio-item-overlay {
    transform: translateY(0);  /* Always visible */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.portfolio-item:hover .portfolio-item-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}
```

## Lightbox Customizations

### Side-by-Side Layout
Already set for desktop, but you can force it:

```css
@media (min-width: 768px) {
    .lightbox-content {
        grid-template-columns: 1.5fr 1fr;  /* Adjust ratio */
    }
}
```

### Dark Lightbox Background
Make it fully opaque:

```css
.lightbox {
    background-color: rgba(0, 0, 0, 1);  /* Fully black */
}
```

### Center-Aligned Text in Lightbox
```css
.lightbox-info {
    text-align: center;
}

.lightbox-tags {
    justify-content: center;
}
```

## Animation Adjustments

### Faster Transitions
```css
:root {
    --transition-speed: 0.15s;  /* Default is 0.3s */
}
```

### Disable Stagger Effect
In `js/main.js`, find the `applyFilter` function and change:

```javascript
// Remove stagger:
setTimeout(() => {
    item.classList.remove('hidden');
}, 0);  // Change from: index * 50
```

### Add Fade-In on Page Load
In `css/styles.css`, add:

```css
.portfolio-item {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## Mobile-Specific Adjustments

### Hide Certain Elements on Mobile
```css
@media (max-width: 767px) {
    .hero-logo {
        max-width: 200px;  /* Smaller hero logo on mobile */
    }

    .filter-section {
        position: static;  /* Don't stick on mobile */
    }
}
```

### Adjust Mobile Grid
```css
@media (max-width: 767px) {
    .portfolio-grid {
        grid-template-columns: 1fr;  /* Single column */
        /* or */
        grid-template-columns: repeat(2, 1fr);  /* Two columns */
    }
}
```

## Advanced: Dynamic Filter Generation

Instead of manually adding filter buttons, generate them from tags:

In `js/main.js`, add this function and call it on load:

```javascript
function generateFilterButtons() {
    const tags = getAllTags();
    const filterContainer = document.querySelector('.filter-container');

    // Clear existing filters except "All"
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">ALL</button>';

    // Generate filter buttons
    tags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = tag;
        button.textContent = formatTagName(tag).toUpperCase();
        filterContainer.appendChild(button);
    });

    // Re-initialize filters
    initializeFilters();
}

// Call it after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    generateFilterButtons();  // Add this
    renderPortfolio();
    // ... rest of initialization
});
```

---

Remember: After making changes, refresh your browser (Cmd/Ctrl + Shift + R for hard refresh) to see updates!
