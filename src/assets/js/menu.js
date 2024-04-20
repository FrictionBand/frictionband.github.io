document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const menu = document.getElementById('menu');
    // Also close the menu when the "gigs" link is clicked, as it will just 
    // jump in the page and therefore not close the menu by reloading 
    const gigsLink = document.getElementById('gigs-link');

    // Function to toggle menu visibility
    const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
    };

    // Function to hide menu
    const hideMenu = () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    };

    // Function show menuToggle 
    const showMenuToggle = () => {
        if (menuToggle.classList.contains('hidden')) {
            menuToggle.classList.remove('hidden');
        }
    }
    // Show Menu
    const showMenu = () => {
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', hideMenu);
    gigsLink.addEventListener('click', hideMenu);

    // Event listener for Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            hideMenu();
        }
    });

    // Only show the menu toggle and logo link if JavaScript is enabled.
    showMenuToggle()
    showMenu()
});
