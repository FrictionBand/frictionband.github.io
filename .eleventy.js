const fs = require("fs");
const path = require("path");
const embedEverything = require("eleventy-plugin-embed-everything");

module.exports = function (eleventyConfig) {

  // PASSTHROUGH

  // Passthrough copy: site assets
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicon");

  // Passthrough copy: media attachments
  eleventyConfig.addPassthroughCopy("src/media");

  // Copy Tobii (Lightbox) CSS and JS to the output folder
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.css": "assets/css/tobii.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.js": "assets/js/tobii.min.js" });

  // COLLECTIONS

  // Sort pages by frontmatter 'order'
  eleventyConfig.addCollection("pages", function (collections) {
    return collections.getFilteredByTag("pages").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });

  eleventyConfig.addCollection("gallery", function (collectionApi) {
    // Define the directory where your images are stored
    const galleryDir = path.join(__dirname, 'src', 'media', 'gallery');

    // Read the directory for image files
    const imageFiles = fs.readdirSync(galleryDir).filter(file => {
      return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'); // Add more file types if needed
    });

    // Return image paths or further details as needed
    return imageFiles.map(file => {
      return { path: `/media/gallery/${file}` };
    });
  });

  // FILTER

  // Filter non-archived posts
  eleventyConfig.addFilter("filterNonArchived", function (collection) {
    return collection.filter(item => item.data.archived === false);
  });

  // Data filter to display date in Finnish Locale
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setLocale('fi').toLocaleString(DateTime.DATE_SHORT);
  });

  // Filters a collection to keep only items that occur in the future
  eleventyConfig.addFilter('filterFutureDates', function (collection) {
    if (!collection) {
      console.log('filterFutureDates: Collection is undefined');
      return [];
    }

    filtered = collection.filter(item => {
      const itemDate = DateTime.fromJSDate(new Date(item.date));
      const now = DateTime.local();
      const diff = itemDate.diff(now).toObject().milliseconds;
      return diff > 0;
    });

    return filtered
  });

  eleventyConfig.addFilter("newlineToBreak", function (value) {
    return value.replace(/\n/g, '<br>');
  });

  // Extract the filename without extension
  eleventyConfig.addFilter("filenameNoExt", function (path) {
    // Extract the filename from the path
    const filename = path.split('/').pop();
    // Remove the file extension
    return filename.replace(/\.[^/.]+$/, "");
  });


  // EMBED PLUGIN

  eleventyConfig.addPlugin(embedEverything);

  return {
    dir: {
      input: "src",
      output: "_site"
    },
  }
};