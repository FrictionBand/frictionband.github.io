module.exports = function (eleventyConfig) {

  // Passthrough copy: site assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Passthrough copy: media attachments
  eleventyConfig.addPassthroughCopy("src/media");

  // Sort pages by frontmatter 'order'
  eleventyConfig.addCollection("page", function (collections) {
    return collections.getFilteredByTag("page").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });

  // Pinned posts
  eleventyConfig.addFilter("filterPinned", function (collection) {
    return collection.filter(item => item.data.pinned === true);
  });

  // Debug filter
  eleventyConfig.addFilter("dumpPost", function (collection) {
    return collection.map(item => ({
      url: item.url,
      data: {
        title: item.data.title,
        pinned: item.data.pinned
      }
    }));
  });

  // Data filter to display date in Finnish Locale
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setLocale('fi').toLocaleString(DateTime.DATE_SHORT);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    pathPrefix: "/friction-helsinki-website/",
  }
};