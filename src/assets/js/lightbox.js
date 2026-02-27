/**
 * Wrap consecutive <img> elements in a CSS-columns masonry container
 * and Tobii-compatible <a class="lightbox"> links.
 * Only operates when `window.enableLightbox` is true on the page.
 * Images already inside an <a class="lightbox"> (e.g. from the gallery shortcode)
 * are skipped automatically.
 */

function wrapImagesInMasonryGrid(images) {
    if (images.length === 0) return;
    const wrapper = document.createElement('div');
    // CSS columns = native masonry-like layout, no JS library needed
    wrapper.className = 'columns-2 md:columns-3 not-prose mt-10 gap-2';
    images[0].parentNode.insertBefore(wrapper, images[0]);
    images.forEach(img => wrapper.appendChild(img));
}

function wrapImagesInLinks(images) {
    images.forEach(img => {
        // Skip images already wrapped in a lightbox anchor
        if (img.closest('a.lightbox')) return;
        const link = document.createElement('a');
        link.href = img.src;
        link.className = 'lightbox block mb-2 break-inside-avoid';
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
    });
}

function groupAdjacentImages(images) {
    let currentGroup = [];
    let lastImg = null;

    images.forEach((img, index) => {
        if (lastImg && img.previousElementSibling === lastImg) {
            currentGroup.push(img);
        } else {
            wrapImagesInMasonryGrid(currentGroup);
            currentGroup = [img];
        }
        lastImg = img;
        if (index === images.length - 1) wrapImagesInMasonryGrid(currentGroup);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Auto-group Markdown images into masonry+lightbox when the page opts in
    if (window.enableLightbox) {
        // Exclude images already inside a shortcode gallery
        const mdImgs = Array.from(document.querySelectorAll('img'))
            .filter(img => !img.closest('a.lightbox'));
        groupAdjacentImages(mdImgs);
        wrapImagesInLinks(mdImgs);
    }

    // Always init Tobii when there are .lightbox links on the page
    // (covers both enableLightbox pages AND the gallery shortcode)
    if (document.querySelector('a.lightbox')) {
        new Tobii({ counter: false, zoom: false });
    }
});
