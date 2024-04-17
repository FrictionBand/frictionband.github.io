/**
 * Wraps given images in a masonry-style grid.
 * @param {NodeList} images - NodeList of image elements to be wrapped.
 */
function wrapImagesInMasonryGrid(images) {
    if (images.length > 0) {
        const wrapper = document.createElement('div');
        wrapper.className = 'columns-2 md:columns-3 not-prose mt-5';
        images[0].parentNode.insertBefore(wrapper, images[0]);

        images.forEach(img => {
            wrapper.appendChild(img);
        });
    }
}

/**
 * Wraps individual images in links with a 'lightbox' class if not already wrapped.
 * @param {NodeList} images - NodeList of image elements to wrap in links.
 */
function wrapImagesInLinks(images) {
    images.forEach(img => {
        if (img.parentNode.tagName !== 'A') {
            const link = document.createElement('a');
            link.setAttribute('href', img.src);
            link.setAttribute('class', 'lightbox');
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
            img.setAttribute('style', 'margin-bottom: 1rem');
        }
    });
}

/**
 * Groups adjacent images together for masonry layout.
 * @param {NodeList} images - NodeList of all image elements on the page.
 */
function groupAdjacentImages(images) {
    let currentGroup = [];
    let lastImage = null;

    images.forEach((img, index) => {
        if (lastImage && img.previousElementSibling === lastImage) {
            currentGroup.push(img);
        } else {
            wrapImagesInMasonryGrid(currentGroup);
            currentGroup = [img];
        }
        lastImage = img;

        // Wrap the last group of images if needed
        if (index === images.length - 1) {
            wrapImagesInMasonryGrid(currentGroup);
        }
    });
}

/**
 * Main function to setup lightbox links if enabled.
 */
function setupLightboxLinks() {
    if (window.enableLightbox) {  // Ensure 'enableLightbox' is globally defined
        const images = document.querySelectorAll('img');  // Select all image elements
        groupAdjacentImages(images);
        wrapImagesInLinks(images);

        // Initialize Lightbox plugin (Tobii) with specific options
        const tobii = new Tobii({
            counter: false,
            zoom: false
        });
    }
}

// Event listener for when the document is fully loaded
document.addEventListener('DOMContentLoaded', setupLightboxLinks);
