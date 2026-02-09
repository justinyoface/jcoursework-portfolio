# Image Organization Guide

## Overview

Your portfolio uses two different image organization systems:
1. **Project Images** - Complex gallery system with automatic loading
2. **Static Images** - Simple, direct references for logos, profile photos, etc.

---

## 📁 Folder Structure

```
images/
├── logos/              ← Site logos (header, hero, footer)
├── about/              ← About page images (profile, bio photos)
├── projects/           ← Portfolio project galleries
│   ├── project-01_coursepeace-illustrations/
│   │   ├── project-01_img-1.jpg
│   │   ├── project-01_img-2.jpg
│   │   └── ...
│   ├── project-02_umaga-brand-illustrations/
│   └── ...
└── blog/               ← Blog post images (if needed)
```

---

## 1️⃣ LOGO IMAGES

### Header Logo (`logos/jcoursework-logo.png`)
- **Location**: Top navigation bar on all pages
- **Recommended Size**: 200-400px width
- **Format**: PNG with transparent background
- **To Update**: Simply replace the file with your logo

### Hero Logo (`logos/jcoursework-logo-hero.png`)
- **Location**: Large centered logo on homepage
- **Recommended Size**: 600-800px width
- **Format**: PNG with transparent background
- **To Update**: Replace the file with your hero logo

### Footer Logo (`logos/jcoursework_logo-reversed.png`)
- **Location**: Footer on all pages
- **Recommended Size**: 400-600px width
- **Format**: PNG (ideally light colored for dark backgrounds)
- **To Update**: Replace with your footer logo

---

## 2️⃣ ABOUT PAGE IMAGES

**Location**: `images/about/`

### Profile Photo (`about/profile.jpg`)
- **Usage**: Bio section on About page
- **Recommended Size**: 800-1200px width
- **Format**: JPG for photos
- **Aspect Ratio**: Square (1:1) or portrait works well
- **To Update**:
  ```
  1. Save your photo as: images/about/profile.jpg
  2. That's it! The about.html already references this path
  ```

### Adding More About Images (Optional)

If you want to add more images to the About page:
```
images/about/
├── profile.jpg           ← Main profile photo
├── studio.jpg            ← Workspace photo
├── team.jpg              ← Team photo
└── behind-the-scenes.jpg ← BTS content
```

Then reference them in [about.html](file:///Users/justinfactor/jcoursework-portfolio/about.html):
```html
<img src="images/about/studio.jpg" alt="Studio workspace">
```

---

## 3️⃣ PROJECT GALLERY IMAGES

**Location**: `images/projects/`

### Automated System

Portfolio projects use a **smart folder system** that automatically generates image paths.

### Folder Structure
```
projects/
└── project-XX_project-name/
    ├── project-XX_img-1.jpg  ← Thumbnail & Hero (REQUIRED)
    ├── project-XX_img-2.jpg
    ├── project-XX_img-3.jpg
    └── ...
```

### Naming Rules

✅ **Correct:**
- `project-01_img-1.jpg`
- `project-01_img-2.jpg`
- `project-02_img-1.png`
- `project-03_img-1.gif`

❌ **Incorrect:**
- `project-1_img-1.jpg` (needs leading zero)
- `project-01-img-1.jpg` (use underscore, not dash)
- `project-01_image-1.jpg` (must be "img")
- `IMG_1234.jpg` (wrong format entirely)

### Image Specifications

#### Photos & Illustrations (JPG/PNG)
- **Minimum**: 1000px width
- **Recommended**: 1500-2000px width
- **Max File Size**: 2MB per image
- **Aspect Ratio**: Square (1:1) for best grid display
- **Format**: JPG for photos, PNG for graphics with transparency

#### Motion Graphics (GIF)
- **Size**: 800-1200px width
- **Max File Size**: 5MB
- **Frame Rate**: 24-30 fps
- **Duration**: 2-5 seconds (looping)

### To Add Project Images:

1. **Place images** in the correct project folder
   ```
   images/projects/project-01_coursepeace-illustrations/
   ├── project-01_img-1.jpg
   ├── project-01_img-2.jpg
   └── project-01_img-3.jpg
   ```

2. **Update gallery layout** in [portfolio-data.js](file:///Users/justinfactor/jcoursework-portfolio/js/portfolio-data.js)
   ```javascript
   galleryLayout: [1, 2]  // 3 total images: 1 hero, then 2 in a row
   ```

3. **Done!** Images load automatically

---

## 4️⃣ IMAGE OPTIMIZATION

Before adding ANY image to your site:

### Optimization Checklist
1. ✅ **Compress** - Use [TinyPNG.com](https://tinypng.com) or [Squoosh.app](https://squoosh.app)
2. ✅ **Resize** - Scale to recommended dimensions
3. ✅ **Format** - Choose JPG for photos, PNG for graphics, GIF for animations
4. ✅ **Quality** - 80-85% quality is the sweet spot

### Recommended Tools
- **TinyPNG** - Easy drag-and-drop compression
- **Squoosh** - Advanced control over compression settings
- **ImageOptim** (Mac) - Batch optimization
- **GIMP/Photoshop** - Export for web feature

---

## 5️⃣ QUICK REFERENCE

| Image Type | Location | Naming | Update Method |
|------------|----------|--------|---------------|
| **Header Logo** | `images/logos/` | `jcoursework-logo.png` | Replace file directly |
| **Profile Photo** | `images/about/` | `profile.jpg` | Replace file directly |
| **Project Gallery** | `images/projects/project-XX_name/` | `project-XX_img-#.jpg` | Add files + update portfolio-data.js |
| **Custom Static** | `images/about/` or `images/blog/` | Any descriptive name | Add file + reference in HTML |

---

## 6️⃣ COMPARISON: Project vs Static Images

### Use PROJECT System for:
- ✅ Portfolio case studies with multiple images
- ✅ Image galleries that need specific layouts
- ✅ Work you want to showcase with thumbnails

### Use STATIC System for:
- ✅ Profile photos
- ✅ About page images
- ✅ Blog post images
- ✅ One-off images that don't need galleries
- ✅ Any image that appears once on a single page

---

## 💡 Best Practices

1. **Consistency** - Keep similar aspect ratios across related images
2. **Performance** - Optimize all images before uploading
3. **Naming** - Use descriptive, lowercase names with hyphens
4. **Formats** - JPG for photos, PNG for graphics, GIF for simple animations
5. **Alt Text** - Always provide meaningful descriptions
6. **Testing** - Check images on different screen sizes

---

## 🔗 Additional Resources

- [Project Structure Guide](file:///Users/justinfactor/jcoursework-portfolio/images/projects/PROJECT-STRUCTURE-GUIDE.md) - Detailed guide for portfolio projects
- [portfolio-data.js](file:///Users/justinfactor/jcoursework-portfolio/js/portfolio-data.js) - Where to configure project galleries

---

**Questions?** Update this guide as you discover new patterns or needs!
