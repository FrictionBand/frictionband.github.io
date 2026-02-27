const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const embedEverything = require("eleventy-plugin-embed-everything");

module.exports = function (eleventyConfig) {

  // BUILD TAILWIND CSS
  // Run Tailwind CSS build before Eleventy starts
  eleventyConfig.on("eleventy.before", async () => {
    execSync("npx tailwindcss -i src/assets/css/input.css -o _site/assets/css/tailwind.css --minify", { stdio: "inherit" });
  });

  // PASSTHROUGH

  // Passthrough copy: site assets
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicon");
  eleventyConfig.addPassthroughCopy("src/assets/css");

  // Passthrough copy: media attachments
  eleventyConfig.addPassthroughCopy("src/media");

  // Copy Tobii (Lightbox) CSS and JS to the output folder
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.css": "assets/css/tobii.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@midzer/tobii/dist/tobii.min.js": "assets/js/tobii.min.js" });

  // COLLECTIONS

  // All pages sorted by 'order'
  eleventyConfig.addCollection("pages", function (collections) {
    return collections.getFilteredByTag("pages").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });

  // English pages only
  eleventyConfig.addCollection("pagesEn", function (collections) {
    return collections.getFilteredByTag("pages")
      .filter(item => item.data.lang === "en")
      .sort((a, b) => a.data.order - b.data.order);
  });

  // Finnish pages only
  eleventyConfig.addCollection("pagesFi", function (collections) {
    return collections.getFilteredByTag("pages")
      .filter(item => item.data.lang === "fi")
      .sort((a, b) => a.data.order - b.data.order);
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

  // Filters a collection to keep only items that occur today or in the future, comparing at the day level
  eleventyConfig.addFilter('filterTodayOrLater', function (collection) {
    if (!collection) {
      console.log('filterTodayOrLater: Collection is undefined');
      return [];
    }

    const today = DateTime.local().startOf('day');

    filtered = collection.filter(item => {
      const itemDate = DateTime.fromJSDate(new Date(item.date)).startOf('day');
      return itemDate >= today;
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

  // Shortcodes
  const i18nData = require("./src/_data/i18n.js");

  const nunjucks = require('nunjucks');
  eleventyConfig.addShortcode("contact", function (lang) {
    const ctxLang = lang || (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    // Load the template file for the shortcode
    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'contact.njk');
    let tpl = '';
    try {
      tpl = fs.readFileSync(tplPath, 'utf8');
    } catch (e) {
      // fallback: render an inline button
      const t = (i18nData[ctxLang] && i18nData[ctxLang].contact) ? i18nData[ctxLang].contact : i18nData.en.contact;
      return `<section class="text-center my-16"><button class="email hidden bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-400 transition-colors">${t.button}</button><noscript><p class="text-neutral-300">${t.noscript}</p></noscript></section>`;
    }

    // Render the Nunjucks template string with minimal context
    const rendered = nunjucks.renderString(tpl, {
      i18n: i18nData,
      lang: ctxLang,
      page: (this && this.page) || {}
    });
    return rendered;
  });

  // WATCH TARGETS
  // Watch Tailwind config and CSS input for changes
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("tailwind.config.js");

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
  }
};