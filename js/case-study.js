/**
 * CASE STUDY PAGE JAVASCRIPT
 * Handles rendering of individual project case study pages
 */

// ============================================
// STATE MANAGEMENT
// ============================================
let currentLightboxIndex = 0;
let galleryImageSources = [];
let lightboxScrollDelta = 0;
let isZoomed = false;
let touchStartX = 0;
let touchEndX = 0;
let panX = 0;
let panY = 0;

// ============================================
// INITIALIZE CASE STUDY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const project = getProjectFromURL();

    if (!project) {
        window.location.href = '/';
        return;
    }

    renderCaseStudy(project);
    renderSeeMore(project);
    initializeBackButton();
    initializeMobileMenu();
    initializeLightbox();
    initializeSubnavScroll();
    initScrollFade(document);

    document.title = project.title + ' - Justin Rodriguez';
});

// ============================================
// GET PROJECT FROM URL
// ============================================
function getProjectFromURL() {
    // Try slug-based URL first (e.g., /umaga-brand-illustrations)
    const path = window.location.pathname.replace(/\/$/, '');
    const slug = path.split('/').pop();
    if (slug) {
        const project = portfolioProjects.find(p => p.slug === slug);
        if (project) return project;
    }

    // Fallback to query param (e.g., case-study.html?id=2)
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    if (!isNaN(id)) {
        return portfolioProjects.find(p => p.id === id) || null;
    }

    return null;
}

// ============================================
// RENDER CASE STUDY CONTENT
// ============================================
function renderCaseStudy(project) {
    document.getElementById('caseStudyTitle').textContent = project.title;

    const tagsContainer = document.getElementById('caseStudyTags');
    tagsContainer.innerHTML = project.tags
        .map(tag => `<span class="tag">${formatTagName(tag)}</span>`)
        .join('');

    document.getElementById('caseStudyBody').textContent = project.body || project.description;

    renderGallery(project);
}

// ============================================
// RENDER IMAGE GALLERY
// ============================================
function renderGallery(project) {
    const galleryContainer = document.getElementById('caseStudyGallery');
    const rows = project.gallery || [[project.image]];
    const layout = project.galleryLayout || [];

    // Build flat source list for lightbox
    galleryImageSources = [];
    let flatIndex = 0;

    rows.forEach((row, rowIndex) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'gallery-row scroll-fade';

        const layoutEntry = layout[rowIndex];
        const isManualRatio = typeof layoutEntry === 'string';
        const isAutoCompute = typeof layoutEntry === 'number' && layoutEntry > 1;

        // Set initial grid columns
        if (isManualRatio) {
            rowEl.style.gridTemplateColumns = (typeof getGridColumns === 'function')
                ? getGridColumns(layoutEntry)
                : 'repeat(' + row.length + ', 1fr)';
            rowEl.classList.add('gallery-row--manual');
        } else {
            rowEl.style.gridTemplateColumns = 'repeat(' + row.length + ', 1fr)';
        }

        // Track images in this row for aspect-ratio computation
        const rowImages = [];

        row.forEach((src, colIndex) => {
            const imageSrc = (rowIndex === 0 && colIndex === 0) ? project.image : src;
            galleryImageSources.push(imageSrc);

            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-row-item';

            const imgEl = document.createElement('img');
            imgEl.alt = project.title;
            imgEl.loading = (rowIndex === 0 && colIndex === 0) ? 'eager' : 'lazy';

            // Check if path has no extension (auto-detect mode)
            const hasExtension = /\.(jpg|jpeg|png|gif)$/i.test(imageSrc);

            const idx = flatIndex;
            wrapper.addEventListener('click', () => openLightbox(idx));

            // Fade-in: add .is-loaded when image finishes loading
            function onImageLoad() {
                imgEl.classList.add('is-loaded');
            }

            if (!hasExtension && typeof getImageWithFormat === 'function') {
                // Auto-detect format
                getImageWithFormat(imageSrc, function(resolvedPath) {
                    imgEl.src = resolvedPath;
                    galleryImageSources[idx] = resolvedPath;
                });
            } else {
                // Use provided path
                imgEl.src = imageSrc;
            }

            // Attach load listener for fade-in
            if (imgEl.complete && imgEl.naturalWidth > 0) {
                onImageLoad();
            } else {
                imgEl.addEventListener('load', onImageLoad);
            }

            rowImages.push(imgEl);
            wrapper.appendChild(imgEl);
            rowEl.appendChild(wrapper);
            flatIndex++;
        });

        galleryContainer.appendChild(rowEl);

        // For auto-compute rows (number entries > 1), recompute columns
        // from actual image aspect ratios once all images have loaded
        if (isAutoCompute && rowImages.length > 1) {
            waitForImages(rowImages, function() {
                var aspectRatios = rowImages.map(function(img) {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        return img.naturalWidth / img.naturalHeight;
                    }
                    return 1; // fallback to square
                });
                var columns = aspectRatios.map(function(ar) {
                    return ar.toFixed(4) + 'fr';
                }).join(' ');
                rowEl.style.gridTemplateColumns = columns;
            });
        }
    });
}

/**
 * Wait for all images to finish loading, then call the callback.
 * Handles already-cached images (img.complete === true).
 */
function waitForImages(images, callback) {
    var remaining = images.length;
    if (remaining === 0) {
        callback();
        return;
    }

    function checkDone() {
        remaining--;
        if (remaining <= 0) {
            callback();
        }
    }

    images.forEach(function(img) {
        if (img.complete && img.naturalWidth > 0) {
            checkDone();
        } else {
            img.addEventListener('load', checkDone);
            img.addEventListener('error', checkDone);
        }
    });
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
function initializeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    const closeBtn = document.querySelector('.gallery-lightbox-close');
    const prevBtn = document.querySelector('.gallery-lightbox-prev');
    const nextBtn = document.querySelector('.gallery-lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target.closest('.gallery-lightbox-close, .gallery-lightbox-prev, .gallery-lightbox-next, .gallery-lightbox-img')) {
            return;
        }
        closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Close lightbox on scroll/wheel
    document.addEventListener('wheel', handleLightboxScroll, { passive: true });
}

function handleLightboxScroll(e) {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');

    // Only process if lightbox is active and not zoomed
    if (lightbox.classList.contains('active') && !isZoomed) {
        // Accumulate scroll distance (preserve direction)
        lightboxScrollDelta += e.deltaY;

        // Get current scale
        const currentScale = isZoomed ? 2 : 1;
        const baseTransform = 'translate(-50%, -50%)';
        const scrollOffset = lightboxScrollDelta * 0.5; // Dampening factor

        // Apply scroll movement
        lightboxImg.style.transform = `${baseTransform} translateY(${scrollOffset}px) scale(${currentScale})`;

        // Close if scroll threshold exceeded (150 pixels in either direction)
        if (Math.abs(lightboxScrollDelta) > 150) {
            closeLightbox();
        }
    }
}

function openLightbox(index) {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');
    const prevBtn = document.querySelector('.gallery-lightbox-prev');
    const nextBtn = document.querySelector('.gallery-lightbox-next');
    const counter = document.getElementById('galleryLightboxCounter');
    const closeBtn = document.querySelector('.gallery-lightbox-close');

    currentLightboxIndex = index;
    lightboxScrollDelta = 0;
    isZoomed = false;
    panX = 0;
    panY = 0;

    // Reset image transform to centered position
    lightboxImg.style.transform = 'translate(-50%, -50%)';
    lightboxImg.style.transition = '';

    // Set image source
    lightboxImg.src = galleryImageSources[index];
    lightboxImg.alt = 'Gallery image ' + (index + 1);
    counter.textContent = (index + 1) + ' / ' + galleryImageSources.length;

    // Show lightbox with PhotoSwipe-style fade-in
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Start hidden
    lightbox.style.opacity = '0';
    lightbox.style.transition = 'opacity 333ms cubic-bezier(0.4, 0, 0.22, 1)';

    // Force reflow
    lightbox.offsetHeight;

    // Fade in
    lightbox.style.opacity = '1';

    // Show/hide navigation based on image count
    if (galleryImageSources.length === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        counter.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        counter.style.display = 'block';
    }

    // Add zoom click handler
    lightboxImg.style.cursor = 'zoom-in';
    lightboxImg.onclick = toggleZoom;

    // Add touch swipe handlers
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');

    // PhotoSwipe-style fade out
    lightbox.style.transition = 'opacity 333ms cubic-bezier(0.4, 0, 0.22, 1)';
    lightbox.style.opacity = '0';

    // Always reset transform, zoom and pan state
    lightboxImg.style.transform = 'translate(-50%, -50%)';
    isZoomed = false;
    panX = 0;
    panY = 0;

    // Remove event handlers
    lightbox.removeEventListener('touchstart', handleTouchStart);
    lightbox.removeEventListener('touchend', handleTouchEnd);
    lightbox.removeEventListener('mousemove', handleZoomPan);

    // Clean up after fade
    setTimeout(() => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxScrollDelta = 0;
        lightbox.style.opacity = '';
        lightbox.style.transition = '';
        lightboxImg.style.cursor = '';
        lightboxImg.onclick = null;
    }, 333);
}

function showPrevImage() {
    if (isZoomed) return; // Don't navigate while zoomed
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImageSources.length) % galleryImageSources.length;
    updateLightboxImage();
    resetLightboxTransform();
}

function showNextImage() {
    if (isZoomed) return; // Don't navigate while zoomed
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImageSources.length;
    updateLightboxImage();
    resetLightboxTransform();
}

function resetLightboxTransform() {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');
    lightboxScrollDelta = 0;
    isZoomed = false;
    panX = 0;
    panY = 0;
    lightboxImg.style.transform = 'translate(-50%, -50%)';
    lightboxImg.style.cursor = 'zoom-in';
    // Remove mouse move listener if active
    lightbox.removeEventListener('mousemove', handleZoomPan);
}

function toggleZoom(e) {
    e.stopPropagation(); // Prevent closing lightbox
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');

    if (isZoomed) {
        // Zoom out
        lightboxImg.style.transition = 'transform 333ms cubic-bezier(0.4, 0, 0.22, 1)';
        lightboxImg.style.transform = 'translate(-50%, -50%) scale(1)';
        lightboxImg.style.cursor = 'zoom-in';
        isZoomed = false;
        panX = 0;
        panY = 0;
        // Remove mouse move listener
        lightbox.removeEventListener('mousemove', handleZoomPan);
    } else {
        // Zoom in
        lightboxImg.style.transition = 'transform 333ms cubic-bezier(0.4, 0, 0.22, 1)';
        lightboxImg.style.transform = 'translate(-50%, -50%) scale(2)';
        lightboxImg.style.cursor = 'zoom-out';
        isZoomed = true;
        // Add mouse move listener for panning
        lightbox.addEventListener('mousemove', handleZoomPan);
    }
}

function handleZoomPan(e) {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');

    // Get mouse position relative to lightbox
    const rect = lightbox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate pan offset based on mouse position
    // Center is 0, edges are +/- 50% of the zoom range
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Pan range: allow movement up to 50% of image size in each direction
    const panRangeX = (rect.width * 0.5);
    const panRangeY = (rect.height * 0.5);

    // Calculate pan position (inverted so image moves opposite to cursor)
    panX = -((x - centerX) / centerX) * panRangeX;
    panY = -((y - centerY) / centerY) * panRangeY;

    // Apply transform without transition for smooth following
    lightboxImg.style.transition = 'none';
    lightboxImg.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(2)`;
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPrevImage();
        }
    }
}

function updateLightboxImage() {
    const img = document.getElementById('galleryLightboxImg');
    const counter = document.getElementById('galleryLightboxCounter');

    // PhotoSwipe-style fade transition
    img.style.transition = 'opacity 333ms cubic-bezier(0.4, 0, 0.22, 1)';
    img.style.opacity = '0';

    setTimeout(() => {
        img.src = galleryImageSources[currentLightboxIndex];
        img.alt = 'Gallery image ' + (currentLightboxIndex + 1);
        counter.textContent = (currentLightboxIndex + 1) + ' / ' + galleryImageSources.length;

        // Reset zoom state
        isZoomed = false;
        img.style.transform = 'translate(-50%, -50%)';
        img.style.cursor = 'zoom-in';

        // Fade in
        img.style.opacity = '1';
    }, 333);
}

// ============================================
// RENDER "SEE MORE PROJECTS"
// ============================================
function renderSeeMore(currentProject) {
    const grid = document.getElementById('seeMoreGrid');
    const nextProjects = getNextProjects(currentProject, 3);

    nextProjects.forEach(project => {
        const card = document.createElement('a');
        card.className = 'see-more-card scroll-fade';
        card.href = '/' + project.slug;

        // Create image container
        const imageDiv = document.createElement('div');
        imageDiv.className = 'see-more-card-image';

        // Create image element
        const img = document.createElement('img');
        img.alt = project.title;
        img.loading = 'lazy';

        // Check if path has no extension (auto-detect mode)
        const hasExtension = /\.(jpg|jpeg|png|gif)$/i.test(project.image);

        if (!hasExtension && typeof getImageWithFormat === 'function') {
            // Auto-detect format
            getImageWithFormat(project.image, function(resolvedPath) {
                img.src = resolvedPath;
            });
        } else {
            // Use provided path
            img.src = project.image;
        }

        imageDiv.appendChild(img);

        // Create title
        const title = document.createElement('h3');
        title.className = 'see-more-card-title';
        title.textContent = project.title;

        card.appendChild(imageDiv);
        card.appendChild(title);
        grid.appendChild(card);
    });
}

// ============================================
// GET NEXT N PROJECTS (with wraparound)
// ============================================
function getNextProjects(currentProject, count) {
    const currentIndex = portfolioProjects.findIndex(p => p.id === currentProject.id);
    const results = [];

    for (let i = 1; i <= count; i++) {
        const nextIndex = (currentIndex + i) % portfolioProjects.length;
        results.push(portfolioProjects[nextIndex]);
    }

    return results;
}

// ============================================
// SUBNAV SCROLL VISIBILITY
// ============================================
function initializeSubnavScroll() {
    const subnav = document.querySelector('.case-study-subnav');
    let lastScrollY = window.scrollY;
    let isFixed = false;

    // Cache the sticky point before any positioning changes
    const stickyPoint = Math.max(0, subnav.offsetTop - 70);

    // Spacer to prevent layout shift when subnav becomes fixed
    const spacer = document.createElement('div');
    spacer.style.display = 'none';
    subnav.parentNode.insertBefore(spacer, subnav.nextSibling);

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY >= stickyPoint) {
            // Past the stick point — make subnav fixed
            if (!isFixed) {
                spacer.style.height = subnav.offsetHeight + 'px';
                spacer.style.marginTop = getComputedStyle(subnav).marginTop;
                spacer.style.display = 'block';
                subnav.classList.add('case-study-subnav--fixed');
                isFixed = true;
            }

            // Stay visible for 150px, then hide on scroll down; show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > stickyPoint + 150) {
                subnav.classList.add('case-study-subnav--hidden');
            } else if (currentScrollY <= lastScrollY) {
                subnav.classList.remove('case-study-subnav--hidden');
            }
        } else {
            // At the top — return to normal flow
            if (isFixed) {
                subnav.classList.remove('case-study-subnav--fixed');
                subnav.classList.remove('case-study-subnav--hidden');
                spacer.style.display = 'none';
                isFixed = false;
            }
        }

        lastScrollY = currentScrollY;
    });
}

// ============================================
// BACK BUTTON
// ============================================
function initializeBackButton() {
    const backBtn = document.getElementById('backButton');

    backBtn.addEventListener('click', function(e) {
        e.preventDefault();

        if (document.referrer && document.referrer.includes(window.location.host)) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    });
}

// ============================================
// SCROLL FADE-IN (Intersection Observer)
// ============================================
function initScrollFade(container) {
    const elements = container.querySelectorAll('.scroll-fade');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// MOBILE MENU
// ============================================
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isOpen = navList.classList.toggle('active');
            this.classList.toggle('active');
            header.classList.toggle('menu-open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        const allLinks = document.querySelectorAll('.nav-link, .social-link');
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }
}

// ============================================
// UTILITY: FORMAT TAG NAME
// ============================================
function formatTagName(tag) {
    return tag
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
