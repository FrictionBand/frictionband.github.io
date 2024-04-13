const fs = require("fs");
const path = require("path");
const embedEverything = require("eleventy-plugin-embed-everything");

module.exports = function (eleventyConfig) {

  // PASSTHROUGH

  // Passthrough copy: site assets
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/videos");

  // Passthrough copy: media attachments
  eleventyConfig.addPassthroughCopy("src/media");

  // Copy Tobii (Lightbox) CSS and JS to the output folder
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.css": "assets/css/tobii.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.js": "assets/js/tobii.min.js" });

  // COLLECTIONS

  // Sort pages by frontmatter 'order'
  eleventyConfig.addCollection("page", function (collections) {
    return collections.getFilteredByTag("page").sort(function (a, b) {
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
    pathPrefix: "/friction-helsinki-website/",
  }
};