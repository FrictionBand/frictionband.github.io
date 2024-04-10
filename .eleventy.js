module.exports = function (eleventyConfig) {


  // PASSTHROUGH

  // Passthrough copy: site assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Passthrough copy: media attachments
  eleventyConfig.addPassthroughCopy("src/media");

  // COLLECTIONS

  // Sort pages by frontmatter 'order'
  eleventyConfig.addCollection("page", function (collections) {
    return collections.getFilteredByTag("page").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });

  // FILTER

  // Pinned posts filter
  eleventyConfig.addFilter("filterPinned", function (collection) {
    return collection.filter(item => item.data.pinned === true);
  });

  // Data filter to display date in Finnish Locale
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setLocale('fi').toLocaleString(DateTime.DATE_SHORT);
  });

  // PLUGINS

  const embedEverything = require("eleventy-plugin-embed-everything");
  eleventyConfig.addPlugin(embedEverything);


  return {
    dir: {
      input: "src",
      output: "_site"
    },
    pathPrefix: "/friction-helsinki-website/",
  }
};