/**
 * ABOUT PAGE JAVASCRIPT
 * Handles mobile menu for the about page
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
});

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
