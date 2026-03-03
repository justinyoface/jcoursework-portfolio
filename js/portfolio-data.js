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
 * - videos: (optional) Object mapping slot numbers to video IDs
 *     Slots with a video ID render an embed instead of an image
 *     Simple:  videos: { 3: "dQw4w9WgXcQ" }  // YouTube, 16:9 default
 *     YouTube: videos: { 3: { id: "dQw4w9WgXcQ", aspect: "3:2" } }
 *     Instagram: videos: { 3: { platform: "instagram", id: "DDQVLHqvlYZ", aspect: "9:16" } }
 *     Videos play inline and are skipped in the lightbox
 * - galleryLayout: Array defining how many images per row and optional column ratios
 *     Use a number for equal-width columns, or a ratio string for custom widths:
 *       - 1        → 1 image (full-width)
 *       - 2        → 2 images (equal-width columns)
 *       - 3        → 3 images (equal-width columns)
 *       - "70:30"  → 2 images (70% / 30% split)
 *       - "30:70"  → 2 images (30% / 70% split)
 *       - "60:40"  → 2 images (60% / 40% split)
 *     Example: [1, "70:30", 2, "30:70"] means:
 *       - Row 1: 1 image (full-width)
 *       - Row 2: 2 images (70/30 split)
 *       - Row 3: 2 images (equal-width)
 *       - Row 4: 2 images (30/70 split)
 *     On mobile, all rows stack to single-column regardless of ratio.
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
function generateGallery(projectNumber, folder, galleryLayout, formats, videos, mobileImages) {
    const gallery = [];
    let imageCounter = 1;

    // Handle both single format (string) and mixed formats (array)
    const formatArray = Array.isArray(formats) ? formats : null;
    const singleFormat = typeof formats === 'string' ? formats : 'jpg';
    const autoDetect = formats === 'auto';

    galleryLayout.forEach(entry => {
        // Determine image count: number = count, string ratio "70:30" = number of parts
        const imagesInRow = typeof entry === 'string' ? entry.split(':').length : entry;

        const row = [];
        for (let i = 0; i < imagesInRow; i++) {
            // Check if this slot is a video
            if (videos && videos[imageCounter]) {
                const entry = videos[imageCounter];
                const videoId = typeof entry === 'string' ? entry : entry.id;
                const aspect = typeof entry === 'object' && entry.aspect ? entry.aspect : '16:9';
                const platform = typeof entry === 'object' && entry.platform ? entry.platform : 'youtube';
                const mobileCover = typeof entry === 'object' && entry.mobileCover ? entry.mobileCover : null;
                row.push({ type: 'video', videoId: videoId, aspect: aspect, platform: platform, mobileCover: mobileCover });
            } else if (autoDetect) {
                // Auto-detect mode: store base path, extension will be resolved at runtime
                const basePath = `images/projects/${folder}/project-${String(projectNumber).padStart(2, '0')}_img-${imageCounter}`;
                if (mobileImages && mobileImages[imageCounter]) {
                    row.push({ type: 'image', src: basePath, mobileSrc: `images/projects/${folder}/${mobileImages[imageCounter]}` });
                } else {
                    row.push(basePath);
                }
            } else {
                // Use specific format from array, or fall back to single format
                const format = formatArray ? (formatArray[imageCounter - 1] || 'jpg') : singleFormat;
                const imagePath = `images/projects/${folder}/project-${String(projectNumber).padStart(2, '0')}_img-${imageCounter}.${format}`;
                if (mobileImages && mobileImages[imageCounter]) {
                    row.push({ type: 'image', src: imagePath, mobileSrc: `images/projects/${folder}/${mobileImages[imageCounter]}` });
                } else {
                    row.push(imagePath);
                }
            }
            imageCounter++;
        }
        gallery.push(row);
    });

    return gallery;
}

// Parse a galleryLayout entry into a CSS grid-template-columns value
function getGridColumns(entry) {
    if (typeof entry === 'string') {
        // Ratio string like "70:30" → "70fr 30fr"
        return entry.split(':').map(function(n) { return n.trim() + 'fr'; }).join(' ');
    }
    // Number like 2 → "repeat(2, 1fr)"
    return 'repeat(' + entry + ', 1fr)';
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
        title: "Coursework x King Marie Tee",
        slug: "coursework-king-marie-tee",
        folder: "project-01_Coursework-King-Marie-Tee",
        tags: ["illustration"],
        description: "A T-shirt collaboration between Coursework and artist King Marie. This t-shirt was created to raise awareness and funds for hurricane relief efforts in the Philippines for Typhoon Rai in 2021.",
        body: "A T-shirt collaboration between Coursework and artist and DJ King Marie. This t-shirt was created to raise awareness and funds for hurricane relief efforts in the Philippines for Typhoon Rai in 2021. The graphic tee showcases a box being parachuted down from a plane to represent the idea of relief and support for those affected by the typhoon. This box is known as a \"Balikbayan box\" which is a care package shipped by Filipinos living abroad (balikbayans) to their families in the Philippines. Lookbook photography by Tori Howard and art direction by Justin Rodriguez.",
        galleryLayout: [2, 2, 2, 2, 2, 2, 2]  // Total: 14 images
    },
    {
        id: 2,
        title: "SPC x Nine Bar T-Shirt",
        slug: "spc-x-nine-bar-t-shirt",
        folder: "project-02_SPCxNine-Bar-T-Shirt",
        tags: ["illustration"],
        description: "A collaborative T-shirt design for Side Practice Coffee and Nine Bar. Side Practice Coffee is well known for uplifting and showcasing minority-owned businesses and creatives, so this design was made to help showcase Nine Bar's pop-up event.",
        body: "A collaborative T-shirt design for Side Practice Coffee and Nine Bar. Side Practice Coffee is well known for uplifting and showcasing minority-owned businesses and creatives, so this design was made to help showcase Nine Bar's pop-up event.",
        galleryLayout: [2]  // Total: 2 images
    },
    {
        id: 3,
        title: "This Is What Asian Looks Like",
        slug: "this-is-what-asian-looks-like",
        folder: "project-03_This-Is-What-Asian-Looks-Like",
        tags: ["design"],
        description: "Graphic design work for an event celebrating AAPI month put on by DJ and artist King Marie. This event showcases Asian creatives with the goal of breaking the stereotype of what it means to be Asian.",
        body: [
            "Graphic design work for an event celebrating Asian American Pacific Islander (AAPI) month hosted by DJ and artist King Marie. This event showcases Asian creatives with the goal of breaking the stereotype of what it means to be Asian.",
            "The typographically-driven design uses bold type and characters overlaid on the faces of Asian Americans to express the frustration of being stereotyped as an Asian and the desire to be seen for who you are."
        ],
        galleryLayout: [2, 3]  // Total: 5 images
    },
    {
        id: 4,
        title: "Moonshot SPC Packaging Design",
        slug: "moonshot-spc-packaging-design",
        folder: "project-04_moonshot-spc-packaging-design",
        tags: ["design", "illustration"],
        description: "Illustrative packaging design for Side Practice Coffee—a coffee company that uplifts and showcases minority-owned businesses and creatives. The concept of the illustrative pattern expresses various crafts or practices of the creative community that SPC uplifts.",
        body: "Illustrative packaging design for Side Practice Coffee—a coffee company that uplifts and showcases minority-owned businesses and creatives. The concept of the illustrative pattern expresses various crafts or practices of the creative community that SPC uplifts.",
        galleryLayout: [2]  // Total: 2 images
    },
    {
        id: 5,
        title: "Kick Push Kid Print",
        slug: "kick-push-kid-print",
        folder: "project-05_kick-push-kid-print",
        tags: ["illustration"],
        description: "A limited editioned screen-printed character illustration for Coursework with nods to The Adventures of Tin Tin.",
        body: [
            "A limited-edition screen-printed poster for my brand Coursework. The Kick Push Kid illustration mixes my appreciation for the art of The Adventures of Tin Tin with my love of skateboarding.",
            "Screen printed by All Star Press in Chicago."
        ],
        galleryLayout: [2, 2, 2]  // Total: 6 images
    },
    {
        id: 6,
        title: "Hebru Brand Studios",
        slug: "hebru-brand-studios",
        folder: "project-06_hebru-brand-studios",
        tags: ["motion", "illustration", "design"],
        description: "Marketing and apparel design work for Hebru Brand Studios and their NYC pop-up.",
        body: "Various graphics for social media marketing, events and apparel design for Hebru Brantley's brand Hebru Brand Studios. I worked embedded within their creative team alongside a junior designer I managed to execute on the various projects leading up to their NYC pop-up event in May of 2018.",
        galleryLayout: [2, 2, 2, 2, 2, 2]  // Total: 12 images
    },
    {
        id: 7,
        title: "Coursework Fresh Produce Only",
        slug: "coursework-fresh-produce-only",
        folder: "project-07_coursework-fresh-produce-only",
        tags: ["illustration"],
        description: "A collection for my brand Coursework that revolved around the motif of using fruit stickers as a play on of words to connect produce such as fruits to producing art.",
        body: "A collection for my brand Coursework that revolved around the motif of using fruit stickers as a play on of words to connect produce such as fruits to the concept of producing art. The collection consists of graphic tees, cut and sewn garments, headwear and a tote bag. Lookbook photography by Tori Howard and JP Calubaquib.",
        galleryLayout: [2, 3, 3, 3, 2, 1, 2, 1],  // Total: 17 items (16 images + 1 video)
        videos: { 16: { platform: "instagram", id: "DDQVLHqvlYZ", aspect: "9:16", mobileCover: "project-07_img-16_video-cover-mobile_v.jpg" } },
        mobileImages: { 17: "project-07_img-17_m_v.jpg" }
    },
    {
        id: 8,
        title: "Artwork Wear Animation",
        slug: "artwork-wear-animation",
        folder: "project-08_artwork-wear-animation",
        tags: ["motion", "illustration"],
        description: "An animated illustration that explores the idea that fashion in a digital expression doesn't have to conform to the physics of reality. Illustrated in Photoshop and animated in Adobe Animate and After Effects.",
        body: "An animated illustration that explores the idea that fashion in a digital expression doesn't have to conform to the physics of reality. Illustrated in Photoshop and animated in Adobe Animate and After Effects.",
        galleryLayout: [2, 1]  // Total: 3 images
    },
    {
        id: 9,
        title: "Perculator Tee",
        slug: "perculator-tee",
        folder: "project-09_perculator-tee",
        tags: ["illustration"],
        description: "A t-shirt design for Chicago-based coffee shop Drip Collective mixing coffee with inspiration from Chicago House music.",
        body: "A t-shirt design for Chicago-based coffee shop Drip Collective mixing coffee with inspiration from Chicago House music. The design plays on the lyrics of the iconic Chicago House song \"Perculator\" by Cajmere while mixing it with a redesign of the Bialetti coffee brand character.",
        galleryLayout: [2, 1, 1],  // Total: 4 images
        mobileImages: { 3: "project-09_img-3_m_h.jpg", 4: "project-09_img-4_m_h.jpg" }
    },
    {
        id: 10,
        title: "Umaga Brand Graphics",
        slug: "umaga-brand-graphics",
        folder: "project-10_umaga-brand-graphics",
        tags: ["illustration", "design"],
        description: "Environmental interior graphics for Chicago-based Filipino bakery Umaga. These illustrations serve as supporting interior decor.",
        body: "Environmental interior graphics for Chicago-based Filipino bakery Umaga. I was approached by Umaga's interior designer prior to the opening of their shop to create graphics that would compliment the interior design of the space while also serving as supporting brand elements.",
        galleryLayout: [2, 2, 3, 2, 2],  // Total: 11 images
    },
    {
        id: 11,
        title: "CoursePeaces",
        slug: "coursepeaces",
        folder: "project-11_coursepeaces",
        tags: ["illustration", "design"],
        description: "An art series celebrating creative culture through various peace signs holding objects that represent different crafts and pop culture.",
        body: [
            "CoursePeaces is an art series that celebrates creative culture ranging from art prints, a NFT collection, apparel and a designer toy figure. The concept derives from the play on of words of \"art piece\" and \"art\" \"peace\" and the art consists of peace signs holding various objects that represent different crafts and nods to pop culture, nostalgia and my inspirations. Over a span of two years, I illustrated 760 elements that were combined in a variety of compositions to create 5,000 unique artworks. Video by Carlo Liou of Rise Above & Prosper, a Chicago-based creative production company.",
            "Visit the CoursePeace NFT mint website <a href=\"https://mint.coursepeace.com/\" target=\"_blank\" rel=\"noopener noreferrer\">here</a>."
        ],
        galleryLayout: [1, 2, 2, 2, 2, 2, 2, 2],  // Total: 15 items (13 images + 2 videos)
        videos: {
            1: { id: "iZ8uMAwoz8k", aspect: "16:9" },
            7: { id: "14J-stFQ5PQ", aspect: "3:2" }
        }
    },
    {
        id: 12,
        title: "Filipinx",
        slug: "filipinx",
        folder: "project-12_filipinx",
        tags: ["design"],
        description: "An event celebrating Filipino-American History Month hosted by artist and DJ King Marie and owner of Classick Studios in Chicago, Chris Inumerable.",
        body: "An event celebrating Filipino-American History Month showcasing some of the best Filipino-American artists and DJs. Hosted by artist and DJ, King Marie and owner of Classick Studios in Chicago, Chris Inumerable. I was tasked with the creative direction and design of the event marketing and merchandise. To celebrate Filipino-American culture, I wanted to tap into a shared experience that the community could all resonate with—karaoke. Many of us grow up in homes with karaoke machines that you'll bust out at a family party. I wanted the graphics to nod to that shared connection. Event photography by Rici (@filmedbyrici), video by Luis Danao.",
        galleryLayout: [2, 1, 2, 3, 2, 2, 2, 2, 2],  // Total: 18 items (15 images + 3 videos)
        videos: {
            2: { platform: "instagram", id: "DPWnpsnkRD-", aspect: "9:16", mobileCover: "project-12_img-2_video-cover-mobile_v.jpg" },
            9: { id: "cyXwdcPNkXQ", aspect: "16:9" },
            18: { platform: "instagram", id: "DPrUyaojUni", aspect: "9:16", mobileCover: "project-12_img-18_video-cover-mobile_v.jpg" }
        }
    },
    {
        id: 13,
        title: "Magnificent Mondo",
        slug: "magnificent-mondo",
        folder: "project-13_magnificent-mondo",
        tags: ["illustration", "design"],
        description: "A children's book written by Brian C. Rodriguez and illustrated by Justin Rodriguez about a pigeon who dreams of becoming the greatest magician despite those who doubt him. It's a story about self belief and following your dreams without permission.",
        body: "Magnificent Mondo is a children's book written by Brian C. Rodriguez and illustrated by Justin Rodriguez about a pigeon who dreams of becoming the greatest magician despite those who doubt him. It's a story about self belief and following your dreams without permission. As the illustrator and designer, I worked on character design, original illustrations, logo design and book design. We also created merch as rewards for our Kickstarter which we successfully funded in December of 2025.",
        galleryLayout: [2, 2, 2, 1, 1, 1, 1, 2, 3, 2],  // Total: 17 items (16 images + 1 video)
        videos: { 10: { id: "bOZCbIjtvKs", aspect: "16:9" } }
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
        project.gallery = generateGallery(project.id, project.folder, project.galleryLayout, formats, project.videos, project.mobileImages);
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
- [1, 2] = Row 1: 1 image, Row 2: 2 equal-width images
- [1, 2, 1, 3] = Row 1: 1 image, Row 2: 2 images, Row 3: 1 image, Row 4: 3 images

CUSTOM COLUMN RATIOS:
Use a ratio string instead of a number to control column widths:
- [1, "70:30"] = Row 1: full-width, Row 2: 70%/30% split
- [1, "30:70", "60:40"] = Row 1: full-width, Row 2: 30%/70%, Row 3: 60%/40%
- ["80:20", 2] = Row 1: 80%/20% split, Row 2: 2 equal-width images

Available ratios: "50:50", "60:40", "40:60", "70:30", "30:70", "80:20", "20:80"
(or any custom numbers — they're used as fr units)

On mobile (< 768px), all rows stack to single-column automatically.

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
