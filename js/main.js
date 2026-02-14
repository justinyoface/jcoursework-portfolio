/* main.js
   - Auto-fit CSS Grid items to their image heights using grid-auto-rows technique
   - Watches for image loads and DOM changes to recalculate spans
*/

function fitPortfolioGrid(){
  const grid = document.querySelector('.portfolio-grid');
  if(!grid) return;

  const getStyles = () => {
    const styles = window.getComputedStyle(grid);
    return {
      rowHeight: parseInt(styles.getPropertyValue('grid-auto-rows')) || 8,
      rowGap: parseInt(styles.getPropertyValue('gap')) || 0
    };
  };

  function resizeAllGridItems(){
    const {rowHeight, rowGap} = getStyles();
    grid.querySelectorAll('.portfolio-item').forEach(item => {
      const img = item.querySelector('img');
      if(!img) return;
      const itemHeight = img.getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = 'span ' + rowSpan;
    });
  }

  // Recalculate when each image loads
  const images = grid.querySelectorAll('img');
  images.forEach(img => {
    if(img.complete){
      // ensure image has final dimensions
      requestAnimationFrame(resizeAllGridItems);
    } else {
      img.addEventListener('load', resizeAllGridItems);
    }
  });

  // Recalculate on window resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeAllGridItems, 120);
  });

  // Observe DOM changes in case portfolio items are injected dynamically
  const mo = new MutationObserver((mutations) => {
    let changed = false;
    for(const m of mutations){
      if(m.addedNodes && m.addedNodes.length) { changed = true; break; }
    }
    if(changed){
      // Attach load listeners to any new images
      grid.querySelectorAll('img').forEach(img => {
        if(!img.__gridFitAttached){
          img.__gridFitAttached = true;
          if(!img.complete) img.addEventListener('load', resizeAllGridItems);
        }
      });
      setTimeout(resizeAllGridItems, 50);
    }
  });
  mo.observe(grid, {childList:true, subtree:true});

  // Initial calculation
  setTimeout(resizeAllGridItems, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  // Masonry grid disabled - using clean row-based grid with CSS only
  // fitPortfolioGrid();
});

/**
 * MAIN JAVASCRIPT FILE
 * Handles all interactive functionality for the portfolio site
 */

// ============================================
// STATE MANAGEMENT
// ============================================
let currentFilter = 'all';

// ============================================
// INITIALIZE PORTFOLIO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderPortfolio();
    initializeFilters();
    initializeFilterSubnav();
    initializeMobileMenu();
});

// ============================================
// RENDER PORTFOLIO GRID
// ============================================
function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';

    // Add all items with scroll-fade class for viewport-aware entrance
    portfolioProjects.forEach((project, index) => {
        project.originalIndex = index;
        const portfolioItem = createPortfolioItem(project, index);
        portfolioItem.classList.add('scroll-fade');
        portfolioGrid.appendChild(portfolioItem);
    });

    // Observe items for scroll-triggered fade-in
    initScrollFade(portfolioGrid);

    // Apply initial filter after a brief delay
    setTimeout(() => applyFilter(currentFilter), 100);
}

function createPortfolioItem(project, index) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.id = project.id;
    item.dataset.tags = project.tags.join(',');
    item.dataset.index = index;
    item.dataset.aspect = 'horizontal'; // Default aspect ratio

    // Create img element
    const img = document.createElement('img');
    img.alt = project.title;
    img.loading = 'lazy';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-item-overlay';
    overlay.innerHTML = `
        <h3 class="portfolio-item-title">${project.title}</h3>
        <div class="portfolio-item-tags">
            ${project.tags.map(tag => `<span class="tag">${formatTagName(tag)}</span>`).join('')}
        </div>
    `;

    // Find thumbnail image with aspect ratio suffix (_h, _v, _sq)
    const projectNum = String(project.id).padStart(2, '0');
    const baseThumbnailPath = `images/projects/${project.folder}/project-${projectNum}_img-1_thumbnail`;

    // Try to find thumbnail with aspect ratio suffix
    findThumbnailWithAspect(baseThumbnailPath, function(thumbnailPath, aspectRatio) {
        img.src = thumbnailPath;
        // Update aspect ratio - CSS handles flex properties via data-aspect attribute
        item.dataset.aspect = aspectRatio;
    }, project.image); // Fallback to original image if no thumbnail found

    item.appendChild(img);
    item.appendChild(overlay);

    item.addEventListener('click', () => {
        window.location.href = '/' + project.slug;
    });

    return item;
}

// Find thumbnail image and detect aspect ratio from filename suffix
function findThumbnailWithAspect(basePath, callback, fallbackImage) {
    const aspectSuffixes = ['_h', '_v', '_sq'];
    const formats = ['jpg', 'png', 'gif'];
    let found = false;

    // Generate all possible combinations to try
    const combinations = [];
    aspectSuffixes.forEach(suffix => {
        formats.forEach(format => {
            combinations.push({
                path: `${basePath}${suffix}.${format}`,
                aspect: suffix === '_h' ? 'horizontal' : suffix === '_v' ? 'vertical' : 'square'
            });
        });
    });

    let currentIndex = 0;

    function tryNext() {
        if (currentIndex >= combinations.length) {
            // No thumbnail found, use fallback
            if (fallbackImage) {
                // Check if fallback has extension
                const hasExtension = /\.(jpg|jpeg|png|gif)$/i.test(fallbackImage);
                if (!hasExtension && typeof getImageWithFormat === 'function') {
                    getImageWithFormat(fallbackImage, function(resolvedPath) {
                        callback(resolvedPath, 'horizontal');
                    });
                } else {
                    callback(fallbackImage, 'horizontal');
                }
            }
            return;
        }

        const combo = combinations[currentIndex];
        const testImg = new Image();

        testImg.onload = function() {
            if (!found) {
                found = true;
                callback(combo.path, combo.aspect);
            }
        };

        testImg.onerror = function() {
            currentIndex++;
            tryNext();
        };

        testImg.src = combo.path;
    }

    tryNext();
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterSection = document.querySelector('.filter-section');
    const filterToggle = document.querySelector('.filter-toggle');
    const filterToggleText = document.querySelector('.filter-toggle-text');

    // Toggle filter buttons visibility
    const filterIcon = filterToggle ? filterToggle.querySelector('.filter-toggle-icon') : null;
    const iconOpen = 'images/icons/remove_24dp_1F1F1F_FILL0_wght200.svg';
    const iconClosed = 'images/icons/filter_list_24dp_1F1F1F_FILL0_wght200.svg';

    function updateFilterIcon() {
        if (filterIcon) {
            filterIcon.src = filterSection.classList.contains('filters-open') ? iconOpen : iconClosed;
        }
    }

    function closeFilters() {
        // Set explicit height so CSS can transition from it
        filterSection.style.height = filterSection.offsetHeight + 'px';
        // Force reflow before adding closing class
        filterSection.offsetHeight;
        filterSection.classList.add('filters-closing');
        setTimeout(function() {
            filterSection.classList.remove('filters-open', 'filters-closing');
            filterSection.style.height = '';
            updateFilterIcon();
        }, 500);
    }

    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            if (filterSection.classList.contains('filters-open')) {
                closeFilters();
            } else {
                filterSection.classList.remove('filters-closing');
                filterSection.classList.add('filters-open');
                updateFilterIcon();
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update toggle label text
            if (filterToggleText) {
                const name = this.textContent.charAt(0) + this.textContent.slice(1).toLowerCase();
                filterToggleText.textContent = 'Filter: ' + name;
            }

            // Collapse filter container
            closeFilters();

            // Apply filter
            currentFilter = filter;
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    const items = document.querySelectorAll('.portfolio-item');
    const grid = document.getElementById('portfolioGrid');

    // Phase 1: fade out items that should hide
    items.forEach(item => {
        const tags = item.dataset.tags.split(',');
        const shouldShow = filter === 'all' || tags.includes(filter);
        if (!shouldShow && !item.classList.contains('hidden')) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
        }
    });

    // Phase 2: after fade-out, collapse hidden and reset visible with scroll-fade
    setTimeout(() => {
        items.forEach(item => {
            const tags = item.dataset.tags.split(',');
            const shouldShow = filter === 'all' || tags.includes(filter);

            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.opacity = '';
                item.style.transform = '';
                // Reset scroll-fade so observer can re-trigger
                item.classList.remove('is-visible');
                item.classList.add('scroll-fade');
            } else {
                item.classList.add('hidden');
                item.style.opacity = '';
                item.style.transform = '';
            }
        });

        // Re-observe visible items for scroll-fade entrance
        initScrollFade(grid);

        // Balance last row after animations complete
        setTimeout(balanceLastRow, 600);
    }, 300);
}

// ============================================
// FILTER SUBNAV SCROLL VISIBILITY
// ============================================
function initializeFilterSubnav() {
    const filterSection = document.querySelector('.filter-section');
    const hero = document.querySelector('.hero');
    let lastScrollY = window.scrollY;
    let isFixed = false;

    // Spacer to prevent layout shift when filter becomes fixed
    const spacer = document.createElement('div');
    spacer.style.display = 'none';
    filterSection.parentNode.insertBefore(spacer, filterSection.nextSibling);

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        // The scroll position where the filter's flow position aligns with fixed top: 70px
        const stickyPoint = heroBottom - 70;

        if (currentScrollY >= stickyPoint) {
            // Past the stick point — make filter fixed
            if (!isFixed) {
                spacer.style.height = filterSection.offsetHeight + 'px';
                spacer.style.display = 'block';
                filterSection.classList.add('filter-section--fixed');
                isFixed = true;
            }

            // Stay visible for 150px, then hide on scroll down; show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > stickyPoint + 150) {
                filterSection.classList.add('filter-section--hidden');
            } else if (currentScrollY <= lastScrollY) {
                filterSection.classList.remove('filter-section--hidden');
            }
        } else {
            // Near/above hero — return to normal flow
            if (isFixed) {
                filterSection.classList.remove('filter-section--fixed');
                filterSection.classList.remove('filter-section--hidden');
                spacer.style.display = 'none';
                isFixed = false;
            }
        }

        lastScrollY = currentScrollY;
    });
}

// ============================================
// BALANCE LAST ROW (ensure min 2 items per row)
// ============================================
function balanceLastRow() {
    const items = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden)'));
    if (items.length < 2) return;

    // Reset any previously forced wraps
    items.forEach(item => item.classList.remove('force-wrap'));

    // Wait for layout to settle
    requestAnimationFrame(() => {
        // Group items by their Y position (row)
        const rows = [];
        let currentRowTop = null;
        let currentRow = [];

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemTop = Math.round(rect.top);

            if (currentRowTop === null || Math.abs(itemTop - currentRowTop) > 10) {
                // New row
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                }
                currentRow = [item];
                currentRowTop = itemTop;
            } else {
                // Same row
                currentRow.push(item);
            }
        });

        // Don't forget the last row
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        // If last row has only 1 item and there's a previous row with 2+ items
        if (rows.length >= 2) {
            const lastRow = rows[rows.length - 1];
            const prevRow = rows[rows.length - 2];

            if (lastRow.length === 1 && prevRow.length >= 2) {
                // Force the last item of previous row to wrap down
                const itemToWrap = prevRow[prevRow.length - 1];
                itemToWrap.classList.add('force-wrap');
            }
        }
    });
}

// Re-balance on window resize
let balanceTimer;
window.addEventListener('resize', () => {
    clearTimeout(balanceTimer);
    balanceTimer = setTimeout(balanceLastRow, 150);
});

function formatTagName(tag) {
    return tag
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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

        // Close menu when clicking on any link
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
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// LAZY LOADING IMAGES (Optional Enhancement)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get all unique tags from portfolio projects
 */
function getAllTags() {
    const tags = new Set();
    portfolioProjects.forEach(project => {
        project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c Portfolio Site Loaded Successfully! ', 'background: #000; color: #fff; padding: 8px; font-size: 14px;');
console.log(`Total Projects: ${portfolioProjects.length}`);
console.log(`Available Tags: ${getAllTags().join(', ')}`);
