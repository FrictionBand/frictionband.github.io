document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');

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

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', hideMenu);

    // Event listener for Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            hideMenu();
        }
    });
});
