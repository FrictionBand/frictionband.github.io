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
  eleventyConfig.addPassthroughCopy("src/assets/audio");
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
      return (a.data.order ?? Infinity) - (b.data.order ?? Infinity);
    });
  });

  // English pages only
  eleventyConfig.addCollection("pagesEn", function (collections) {
    return collections.getFilteredByTag("pages")
      .filter(item => item.data.lang === "en")
      .sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity));
  });

  // Finnish pages only
  eleventyConfig.addCollection("pagesFi", function (collections) {
    return collections.getFilteredByTag("pages")
      .filter(item => item.data.lang === "fi")
      .sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity));
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
  const nunjucks = require('nunjucks');

  // Contact button shortcode. Usage: {% contact "Get in touch" %}
  eleventyConfig.addShortcode("contact", function (label) {
    if (!label || !String(label).trim()) throw new Error('contact shortcode requires a label parameter');
    return `<section class="text-center my-12 md:my-16 mx-2"><button class="js-only-contact email hidden bg-primary-600 text-white hover:text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${label}</button></section>`;
  });

  // General purpose link button shortcode. Usage: {% link_button "/path/", "Label" %}
  eleventyConfig.addShortcode("link_button", function (linkHref, linkText) {
    if (!linkHref || !String(linkHref).trim() || !linkText || !String(linkText).trim()) {
      throw new Error('link_button shortcode requires linkHref and linkText parameters');
    }
    return `<section class="text-center my-4 md:my-16 mx-2"><a href="${linkHref}" class="inline-block bg-primary-600 text-white hover:text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${linkText}</a></section>`;
  });

  // Noscript text shortcode. Usage: {% noscript_text "Contact us" %}
  eleventyConfig.addShortcode("noscript_text", function (text) {
    if (!text || String(text).trim().length === 0) throw new Error('noscript_text shortcode requires a non-empty text parameter');
    return `<noscript><p class="text-neutral-300">${String(text)}</p></noscript>`;
  });

  // CTA shortcode: link button + contact button side by side.
  // Usage: {% cta "/services/", "Learn more", "Get in touch" %}
  eleventyConfig.addShortcode("cta", function (linkHref, linkText, contactText) {
    if (!linkHref || !linkText || !contactText) throw new Error('cta shortcode requires linkHref, linkText, and contactText');
    const linkBtn = `<a href="${linkHref}" class="inline-block bg-primary-600 text-white hover:text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${linkText}</a>`;
    const contactBtn = `<button class="js-only-contact email hidden bg-primary-600 text-white hover:text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${contactText}</button>`;
    return `<section class="my-8 md:my-16"><div class="flex flex-row flex-wrap items-center gap-4 justify-center"><div class="w-auto">${linkBtn}</div><div class="w-auto">${contactBtn}</div></div></section>`;
  });

  // Right-align paired shortcode. Usage: {% right %}content{% endright %}
  eleventyConfig.addPairedShortcode("right", function (content) {
    return `<div class="text-right">${content}</div>`;
  });

  // Gallery shortcode: accepts multiple image paths and renders a masonry grid
  // Usage: {% gallery "/media/gallery/img1.jpg", "/media/gallery/img2.jpg" %}
  eleventyConfig.addShortcode("gallery", function () {
    // `arguments` contains all passed image paths
    const args = Array.prototype.slice.call(arguments);
    // Filter out any undefined/null values
    const images = args.filter(Boolean).map(src => String(src).trim());
    if (!images || images.length === 0) return '';

    // Build the gallery HTML: wrapper div with `grid not-prose mt-10`, each item is a link with class `lightbox grid-item`
    // CSS `columns` gives a masonry-like layout natively — no Masonry.js needed.
    // Each item uses `break-inside-avoid` so images never split across columns.
    // `.lightbox` class is picked up by Tobii (already loaded via base.njk).
    let out = `<div class="columns-2 md:columns-2 lg:columns-3 gap-2 not-prose mt-10">`;
    for (const src of images) {
      const safeSrc = src.replace(/"/g, '%22');
      out += `<a href="${safeSrc}" class="lightbox block mb-2 break-inside-avoid"><img src="${safeSrc}" alt="" class="w-full object-cover" loading="lazy"></a>`;
    }
    out += `</div>`;
    return out;
  });

  // Gigs shortcode: render upcoming gigs.
  // Usage: {% gigs 3, false, "Upcoming Gigs" %} or {% gigs 3, false, "Upcoming Jams", "jam" %} or {% gigs 3, false, "Upcoming Jams", "jam", false %}
  eleventyConfig.addShortcode("gigs", function (limit, showDescription, heading, type, linkCards) {
    if (!heading) throw new Error('gigs shortcode requires a heading parameter');
    const { DateTime } = require('luxon');

    let allGigs = [];
    if (this && this.collections && this.collections.gigs) {
      allGigs = this.collections.gigs;
    } else if (this && this.ctx && this.ctx.collections && this.ctx.collections.gigs) {
      allGigs = this.ctx.collections.gigs;
    }

    // Filter to today or later (day-level)
    const today = DateTime.local().startOf('day');
    const future = allGigs.filter(item => {
      const itemDate = DateTime.fromJSDate(new Date(item.date)).startOf('day');
      if (itemDate < today) return false;
      // Optional type filter (e.g. type: "jam")
      if (type && item.data && item.data.type !== type) return false;
      return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const count = (typeof limit === 'number' || (typeof limit === 'string' && limit.match(/^\d+$/))) ? parseInt(limit, 10) : null;
    let showDesc = true;
    if (typeof showDescription !== 'undefined') {
      showDesc = typeof showDescription === 'string'
        ? !['false', '0', 'no'].includes(showDescription.toLowerCase())
        : Boolean(showDescription);
    }
    const items = count ? future.slice(0, count) : future;

    if (!items || items.length === 0) return '';

    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'gigs.njk');
    const tpl = fs.readFileSync(tplPath, 'utf8');

    const prepared = items.map(gig => {
      let dateStr = '';
      try {
        dateStr = DateTime.fromJSDate(new Date(gig.date)).setLocale('fi').toLocaleString(DateTime.DATE_SHORT);
      } catch (e) {
        dateStr = gig.date || '';
      }
      return {
        dateStr,
        url: gig.url || null,
        title: (gig.data && gig.data.title) ? gig.data.title : '',
        short: (gig.data && gig.data.shortDescription) ? gig.data.shortDescription : null,
        content: gig.templateContent || gig.content || '',
        time: (gig.data && gig.data.time) ? gig.data.time : null,
        gmaps: (gig.data && gig.data.gmaps) ? gig.data.gmaps : null,
        location: (gig.data && gig.data.location) ? gig.data.location : null,
        fblink: (gig.data && gig.data.fblink) ? gig.data.fblink : null,
        weblink: (gig.data && gig.data.weblink) ? gig.data.weblink : null,
        image: (gig.data && gig.data.image) ? gig.data.image : null,
        type: (gig.data && gig.data.type) ? gig.data.type : null,
      };
    });

    const shouldLink = linkCards !== false && linkCards !== 'false';
    return nunjucks.renderString(tpl, { items: prepared, heading, showDescription: showDesc, linkCards: shouldLink });
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