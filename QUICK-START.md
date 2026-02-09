# Quick Start Guide

Get your portfolio live in 5 simple steps!

## 1. Add Your Logos (2 minutes)

```
images/logos/jcoursework-logo.png       ← Header logo (200-400px wide)
images/logos/jcoursework-logo-hero.png  ← Hero logo (600-800px wide)
```

## 2. Add Portfolio Images (5 minutes)

- Drop all project images into `images/projects/`
- Formats: JPG, PNG, GIF
- Size: 1000-2000px width recommended

## 3. Add Your Projects (10 minutes)

Open `js/portfolio-data.js` and add projects:

```javascript
{
    id: 10,
    title: "My Amazing Project",
    image: "images/projects/my-project.jpg",
    tags: ["graphic-design"],
    description: "Describe your project here..."
},
```

## 4. Update Links (2 minutes)

In `index.html`, update:
- Instagram URL (line 33)
- Shop URL (line 43)
- Blog URL (line 44)
- Footer social links (lines 95-97)

## 5. Test Locally (1 minute)

- Open `index.html` in your browser
- Click through projects
- Test filtering buttons
- Verify mobile menu works

## You're Done!

Now deploy using:
- **Netlify**: Drag & drop the folder to netlify.com
- **GitHub Pages**: Push to GitHub, enable in Settings
- **Vercel**: Run `vercel` in the terminal

---

## Common First-Time Questions

**Q: How do I add a new tag?**
A: Add it to a project's tags array, then add a filter button in index.html

**Q: Can projects have multiple tags?**
A: Yes! Use: `tags: ["graphic-design", "illustration"]`

**Q: How do I change colors?**
A: Edit the `:root` variables at the top of `css/styles.css`

**Q: What if I have 100+ projects?**
A: Consider adding categories or pagination (see README for ideas)

**Q: Can I use this for commercial work?**
A: Yes, it's built for you to use freely!

---

Need more help? Check the full [README.md](README.md) file.
