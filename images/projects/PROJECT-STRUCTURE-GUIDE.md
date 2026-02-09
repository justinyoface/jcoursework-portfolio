# Project Image Structure Guide

## Folder Naming Convention

Each project has its own folder using this format:
```
project-XX_project-name
```

Examples:
- `project-01_coursepeace-illustrations`
- `project-02_umaga-brand-illustrations`
- `project-10_website-redesign`

## Image Naming Convention

Inside each project folder, name your images:
```
project-XX_img-1.jpg
project-XX_img-2.jpg
project-XX_img-3.jpg
...etc
```

**Important:**
- The `XX` must match your project number (with leading zero if needed)
- The first image (`img-1`) is always:
  - The thumbnail shown on the homepage
  - The hero image at the top of the case study page
- Images are displayed in numerical order
- Supported formats: `.jpg`, `.png`, `.gif`

## Example Structure

```
images/projects/
├── project-01_coursepeace-illustrations/
│   ├── project-01_img-1.jpg  ← Thumbnail & Hero
│   ├── project-01_img-2.jpg
│   ├── project-01_img-3.jpg
│   └── project-01_img-4.jpg
│
├── project-02_umaga-brand-illustrations/
│   ├── project-02_img-1.jpg  ← Thumbnail & Hero
│   ├── project-02_img-2.jpg
│   ├── project-02_img-3.jpg
│   ├── project-02_img-4.jpg
│   └── project-02_img-5.jpg
│
└── project-03_motion-graphics-reel/
    ├── project-03_img-1.gif  ← Can be GIF for motion
    ├── project-03_img-2.gif
    └── project-03_img-3.jpg
```

## How It Works

1. **Place your images** in the correct project folder with the naming convention
2. **Update portfolio-data.js** with your gallery layout:
   ```javascript
   {
       id: 1,
       title: "CoursePeace Illustrations",
       folder: "project-01_coursepeace-illustrations",
       tags: ["illustration"],
       description: "Project description...",
       body: "Detailed project description...",
       galleryLayout: [1, 2, 1, 3]  // Define your layout
   }
   ```

3. **Gallery Layout** determines how images are arranged:
   - `[1]` = 1 full-width image
   - `[1, 2]` = First row: 1 image, Second row: 2 images
   - `[1, 2, 1, 3]` = Row 1: 1 image, Row 2: 2 images, Row 3: 1 image, Row 4: 3 images
   - `[1, 2, 3, 4]` = Each row has progressively more columns

## Gallery Layout Examples

### Simple Hero + Grid
```javascript
galleryLayout: [1, 2, 2, 2]
// Loads 7 images total:
//   Row 1: img-1 (full-width hero)
//   Row 2: img-2, img-3
//   Row 3: img-4, img-5
//   Row 4: img-6, img-7
```

### Feature Heavy
```javascript
galleryLayout: [1, 1, 1, 2]
// Loads 5 images total:
//   Row 1: img-1 (full-width)
//   Row 2: img-2 (full-width)
//   Row 3: img-3 (full-width)
//   Row 4: img-4, img-5
```

### Mixed Grid
```javascript
galleryLayout: [1, 2, 3, 4, 2, 1]
// Loads 13 images total with varying columns
```

## Tips

- **Optimize images** before uploading (compress, resize)
- **Square images** (1:1 ratio) work best for grid consistency
- **Minimum width**: 1000px recommended
- **File size**: Keep under 2MB per image
- **GIFs**: Great for motion projects, keep under 5MB
- **Consistency**: Try to maintain similar aspect ratios across a project

## Adding a New Project

1. Create new folder: `project-10_your-project-name`
2. Add images: `project-10_img-1.jpg`, `project-10_img-2.jpg`, etc.
3. Update `js/portfolio-data.js` with your project details
4. Adjust `galleryLayout` to match your image arrangement
5. Save and refresh your browser!

## Changing Gallery Layout

You can easily rearrange how images display by updating the `galleryLayout` array in `portfolio-data.js`:

```javascript
// Before: All images in 2-column grid
galleryLayout: [2, 2, 2, 2]  // 8 images

// After: Feature first image, then grid
galleryLayout: [1, 2, 2, 2, 1]  // 8 images
```

No need to rename or move image files - just change the layout array!
