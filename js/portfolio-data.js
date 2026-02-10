/**
 * PORTFOLIO DATA STRUCTURE
 *
 * This file contains all your portfolio projects.
 * Each project has the following properties:
 *
 * - id: Unique identifier (number)
 * - title: Project name (string)
 * - folder: Folder name in images/projects/ (e.g., "project-01_coursepeace")
 * - imageFormat: (OPTION 1) Single format for ALL images in this project (optional)
 *     Options: 'jpg', 'png', 'gif', 'auto'
 *     Default: 'auto' if not specified (automatically detects format)
 *     Example: imageFormat: "gif"
 *     Use 'auto' to let the system find images with any format
 * - imageFormats: (OPTION 2) Array of formats for MIXED format projects (optional)
 *     Specify the format for each image in order
 *     Example: imageFormats: ["gif", "jpg", "jpg", "png", "gif"]
 *     Use this when you want to mix JPG, PNG, and GIF in the same project
 * - tags: Array of tags for filtering (array of strings)
 * - description: Short description shown on portfolio grid (string)
 * - body: Longer body copy for the case study page (string)
 * - galleryLayout: Array of numbers defining how many images per row
 *     Example: [1, 2, 1, 3] means:
 *       - Row 1: 1 image (full-width)
 *       - Row 2: 2 images (2 columns)
 *       - Row 3: 1 image (full-width)
 *       - Row 4: 3 images (3 columns)
 *     Images are automatically numbered: project-XX_img-1, project-XX_img-2, etc.
 *     The first image (img-1) is always the thumbnail and hero image
 *
 * AVAILABLE TAGS (you can add more):
 * - "design"
 * - "illustration"
 * - "motion"
 */

// ============================================
// HELPER FUNCTION: Generate Gallery from Layout
// ============================================
function generateGallery(projectNumber, folder, galleryLayout, formats) {
    const gallery = [];
    let imageCounter = 1;

    // Handle both single format (string) and mixed formats (array)
    const formatArray = Array.isArray(formats) ? formats : null;
    const singleFormat = typeof formats === 'string' ? formats : 'jpg';
    const autoDetect = formats === 'auto';

    galleryLayout.forEach(imagesInRow => {
        const row = [];
        for (let i = 0; i < imagesInRow; i++) {
            if (autoDetect) {
                // Auto-detect mode: store base path, extension will be resolved at runtime
                const basePath = `images/projects/${folder}/project-${String(projectNumber).padStart(2, '0')}_img-${imageCounter}`;
                row.push(basePath);
            } else {
                // Use specific format from array, or fall back to single format
                const format = formatArray ? (formatArray[imageCounter - 1] || 'jpg') : singleFormat;
                const imagePath = `images/projects/${folder}/project-${String(projectNumber).padStart(2, '0')}_img-${imageCounter}.${format}`;
                row.push(imagePath);
            }
            imageCounter++;
        }
        gallery.push(row);
    });

    return gallery;
}

// ============================================
// HELPER FUNCTION: Auto-detect Image Format
// ============================================
function getImageWithFormat(basePath, callback) {
    const suffixes = ['_h', '_v', '_sq', ''];
    const formats = ['jpg', 'png', 'gif'];
    const combinations = [];

    suffixes.forEach(function(suffix) {
        formats.forEach(function(format) {
            combinations.push(basePath + suffix + '.' + format);
        });
    });

    let currentIndex = 0;

    function tryNext() {
        if (currentIndex >= combinations.length) {
            callback(basePath + '.jpg'); // Fallback to jpg if none found
            return;
        }

        const testPath = combinations[currentIndex];
        const img = new Image();

        img.onload = function() {
            callback(testPath);
        };

        img.onerror = function() {
            currentIndex++;
            tryNext();
        };

        img.src = testPath;
    }

    tryNext();
}

const portfolioProjects = [
    {
        id: 1,
        title: "CoursePeace",
        slug: "coursepeace",
        folder: "project-01_coursepeace",
        tags: ["illustration"],
        description: "An art series celebrating creative culture through various peace signs holding objects that represent different crafts and pop culture.",
        body: "An art series celebrating creative culture through various peace signs holding objects that represent different crafts and pop culture.",
        galleryLayout: [1]  // Total: 1 images
    },
    {
        id: 2,
        title: "Umaga Brand Illustrations",
        slug: "umaga-brand-illustrations",
        folder: "project-02_umaga-brand-illustrations",
        tags: ["illustration"],
        description: "A series of whimsical character illustrations created for a children's book project, featuring vibrant colors and expressive designs.",
        body: "A series of whimsical character illustrations created for a children's book project, featuring vibrant colors and expressive designs.",
        galleryLayout: [2]  // Total: 2 images
    },
    {
        id: 3,
        title: "Drip Collective Tee",
        slug: "drip-collective-tee",
        folder: "project-03_drip-collective-tee",
        tags: ["illustration"],
        description: "A t-shirt design for Chicago-based coffee shop Drip Collective mixing coffee with inspiration from Chicago House music.",
        body: "A t-shirt design for Chicago-based coffee shop Drip Collective mixing coffee with inspiration from Chicago House music.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 4,
        title: "Artwork Wear Animation",
        slug: "artwork-wear-animation",
        folder: "project-04_artwork-wear-animation",
        tags: ["motion", "illustration"],
        description: "An animated illustration that explores the idea that fashion in a digital expression doesn't have to conform to the physics of reality. Illustrated in Photoshop and animated in Adobe Animate and After Effects.",
        body: "An animated illustration that explores the idea that fashion in a digital expression doesn't have to conform to the physics of reality. Illustrated in Photoshop and animated in Adobe Animate and After Effects.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 5,
        title: "Coursework Fruits of Labor",
        slug: "coursework-fruits-of-labor",
        folder: "project-05_coursework-fruits-of-labor",
        tags: ["illustration"],
        description: "A detailed digital portrait study exploring light, shadow, and color harmony using contemporary illustration techniques.",
        body: "A detailed digital portrait study exploring light, shadow, and color harmony using contemporary illustration techniques.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 6,
        title: "Hebru Brand Studios",
        slug: "hebru-brand-studios",
        folder: "project-06_hebru-brand-studios",
        tags: ["motion", "illustration"],
        description: "Marketing and apparel design work for Hebru Brand Studios and their NYC pop-up.",
        body: "I had the opportunity to intern with artist Hebru Brantley’s brand  Hebru Brand Studios as a designer and worked on various apparel designs and marketing materials that led up to their pop up shop in NYC. An unforgettable experience..",
        galleryLayout: [2, 2, 2, 2, 2, 2]  // Total: 12 images
    },
    {
        id: 7,
        title: "Coursework Kid Print",
        slug: "coursework-kid-print",
        folder: "project-07_coursework-kid-print",
        tags: ["illustration"],
        description: "Product packaging design for an organic coffee brand, featuring minimalist aesthetics and eco-friendly design principles.",
        body: "Product packaging design for an organic coffee brand, featuring minimalist aesthetics and eco-friendly design principles.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 8,
        title: "SPC Packaging Design",
        slug: "spc-packaging-design",
        folder: "project-08_SPC-packaging-design",
        tags: ["design", "illustration"],
        description: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        body: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 9,
        title: "This Is What Asian Looks Like",
        slug: "this-is-what-asian-looks-like",
        folder: "project-09_This-Is-What-Asian-Looks-Like",
        tags: ["design"],
        description: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        body: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 10,
        title: "SPC x Nine Bar T-Shirt",
        slug: "spc-x-nine-bar-t-shirt",
        folder: "project-10_SPCxNine-Bar-T-Shirt",
        tags: ["illustration"],
        description: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        body: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        galleryLayout: [1]  // Total: 1 image
    },
    {
        id: 11,
        title: "Coursework King Marie Tee",
        slug: "coursework-king-marie-tee",
        folder: "project-11_Coursework-King-Marie-Tee",
        tags: ["illustration"],
        description: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        body: "Micro-interactions and smooth UI transitions designed to enhance user experience in a mobile application interface.",
        galleryLayout: [1]  // Total: 1 image
    },
];

// ============================================
// AUTO-GENERATE IMAGE AND GALLERY PROPERTIES
// ============================================
portfolioProjects.forEach(project => {
    if (project.folder && project.galleryLayout) {
        // Support: imageFormats array, imageFormat string, or 'auto' for detection
        const formats = project.imageFormats || project.imageFormat || 'auto';
        const isAuto = formats === 'auto';
        const firstFormat = Array.isArray(formats) ? formats[0] : (isAuto ? '' : formats);

        // Generate thumbnail path (always img-1)
        const basePath = `images/projects/${project.folder}/project-${String(project.id).padStart(2, '0')}_img-1`;
        project.image = isAuto ? basePath : `${basePath}.${firstFormat}`;
        project._imageAuto = isAuto; // Flag for runtime detection

        // Generate gallery from layout
        project.gallery = generateGallery(project.id, project.folder, project.galleryLayout, formats);
    }
});

// ============================================
// HOW TO ADD A NEW PROJECT
// ============================================
/*

STEP 1: Create a new project folder in images/projects/
        Use the naming convention: project-XX_project-name
        Example: project-10_website-redesign

STEP 2: Add your images to the folder with this naming convention:
        - project-10_img-1.jpg  (thumbnail & hero image)
        - project-10_img-2.jpg
        - project-10_img-3.jpg
        - etc.

        Supported formats: .jpg, .png, .gif
        You can now MIX formats in the same project!

STEP 3: Copy a template and add it to the portfolioProjects array above:

RECOMMENDED - Auto-Detect Format (easiest, works with any format):
    {
        id: 10,
        title: "Your Project Title",
        folder: "project-10_project-name",
        // No imageFormat needed! System auto-detects .jpg, .png, or .gif
        tags: ["design"],
        description: "Short description for the portfolio grid.",
        body: "Longer body copy for the case study page.",
        galleryLayout: [1, 2, 1, 3]
    },

OPTION A - Single Format (if you want to specify):
    {
        id: 10,
        title: "Your Project Title",
        folder: "project-10_project-name",
        imageFormat: "jpg",  // Explicitly set to jpg, png, or gif
        tags: ["design"],
        description: "Short description for the portfolio grid.",
        body: "Longer body copy for the case study page.",
        galleryLayout: [1, 2, 1, 3]
    },

OPTION B - Mixed Formats (different format per image):
    {
        id: 10,
        title: "Your Project Title",
        folder: "project-10_project-name",
        imageFormats: ["gif", "jpg", "jpg", "png", "gif", "jpg", "jpg"],  // One per image
        tags: ["design"],
        description: "Short description for the portfolio grid.",
        body: "Longer body copy for the case study page.",
        galleryLayout: [1, 2, 1, 3]  // Total: 7 images
    },

GALLERY LAYOUT GUIDE:
The galleryLayout array defines how many images appear in each row:
- [1] = 1 row with 1 image (full-width)
- [1, 2] = Row 1: 1 image, Row 2: 2 images
- [1, 2, 1, 3] = Row 1: 1 image, Row 2: 2 images, Row 3: 1 image, Row 4: 3 images

Maximum 6 images per row.

IMAGES ARE LOADED IN ORDER:
With imageFormats: ["gif", "jpg", "png", "jpg"] and galleryLayout: [1, 2, 1]
  - Row 1: project-10_img-1.gif (full-width)
  - Row 2: project-10_img-2.jpg, project-10_img-3.png
  - Row 3: project-10_img-4.jpg (full-width)

MIXED FORMAT EXAMPLE:
Your project folder might look like:
    project-10_mixed-media/
    ├── project-10_img-1.gif   ← Hero animation
    ├── project-10_img-2.jpg   ← Static photo
    ├── project-10_img-3.jpg   ← Static photo
    ├── project-10_img-4.png   ← Graphic with transparency
    └── project-10_img-5.gif   ← Detail animation

Then in your project data:
    imageFormats: ["gif", "jpg", "jpg", "png", "gif"],
    galleryLayout: [1, 2, 2]  // 5 images total

STEP 4: Make sure to add a comma after the previous project entry

STEP 5: Save this file

*/

// ============================================
// HOW TO ADD NEW TAGS
// ============================================
/*

STEP 1: Add your new tag to a project in the tags array:
    tags: ["design", "your-new-tag"]

STEP 2: Add a filter button in index.html in the filter-container section:
    <button class="filter-btn" data-filter="your-new-tag">YOUR NEW TAG</button>

STEP 3: The filter will automatically work with your new tag!

EXAMPLE NEW TAGS:
- "photography"
- "web-design"
- "3d-modeling"
- "typography"
- "branding"
- "ui-ux"

*/

// ============================================
// ADVANCED: MULTIPLE TAGS PER PROJECT
// ============================================
/*

You can assign multiple tags to a single project:

    {
        id: 15,
        title: "Hybrid Project",
        image: "images/projects/hybrid.jpg",
        tags: ["design", "illustration", "motion"],
        description: "This project combines multiple disciplines.",
        body: "Detailed description of the hybrid project for the case study page.",
        gallery: [
            ["images/projects/hybrid-hero.jpg"],
            ["images/projects/hybrid-2.jpg", "images/projects/hybrid-3.jpg"],
            ["images/projects/hybrid-4.jpg", "images/projects/hybrid-5.jpg", "images/projects/hybrid-6.jpg"]
        ]
    }

This project will appear when filtering by ANY of those tags!

*/
