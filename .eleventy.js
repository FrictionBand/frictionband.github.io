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
  // `contact` shortcode: accepts optional `label` (string) and optional `lang`.
  // Usage examples in Nunjucks markdown:
  //   {% contact "Get in touch" %}
  //   {% contact "Ota yhteyttä", "fi" %}
  // If `label` is omitted, we fall back to i18n strings.
  eleventyConfig.addShortcode("contact", function (label, lang) {
    const ctxLang = lang || (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    // Load the template file for the shortcode
    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'contact.njk');
    let tpl = '';
    try {
      tpl = fs.readFileSync(tplPath, 'utf8');
    } catch (e) {
      // fallback: render an inline button using fixed placeholders (no i18n)
      const labelText = label || 'contact';
      const noscriptText = 'contact: friction.helsinki at gmail dot com';
      return `<section class="text-center my-16"><button class="email hidden bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${labelText}</button><noscript><p class="text-neutral-300">${noscriptText}</p></noscript></section>`;
    }

    // Render the Nunjucks template string with minimal context; pass label/noscript through
    const rendered = nunjucks.renderString(tpl, {
      i18n: i18nData,
      lang: ctxLang,
      label: label,
      noscript: undefined,
      page: (this && this.page) || {}
    });
    return rendered;
  });

  // Book shortcode: renders the booking button (language-aware)
  eleventyConfig.addShortcode("book", function (lang) {
    const ctxLang = lang || (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'book.njk');
    let tpl = '';
    try {
      tpl = fs.readFileSync(tplPath, 'utf8');
    } catch (e) {
      // fallback inline anchor using a fixed placeholder 'services' (no i18n)
      const href = ctxLang === 'fi' ? '/fi/services/' : '/services/';
      const labelText = 'services';
      return `<section class="text-center my-16"><a href="${href}" class="inline-block bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-500 transition-colors">${labelText}</a></section>`;
    }
    const rendered = require('nunjucks').renderString(tpl, { lang: ctxLang, i18n: i18nData });
    return rendered;
  });

  // Email (no-JS) shortcode: inline mailto fallback (no separate template file)
  // Requires a `text` parameter which will be used as the link text.
  // Usage: {% email_no_js "Contact us" %}
  eleventyConfig.addShortcode("email_no_js", function (text) {
    if (!text || String(text).trim().length === 0) {
      throw new Error('email_no_js shortcode requires a non-empty text parameter');
    }
    return `<noscript><p class="text-neutral-300">${String(text)}</p></noscript>`;
  });

  // Lead paired-shortcode: prominent introductory paragraph
  eleventyConfig.addPairedShortcode("lead", function (content, lang) {
    const ctxLang = lang || (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'lead.njk');
    let tpl = '';
    try {
      tpl = fs.readFileSync(tplPath, 'utf8');
    } catch (e) {
      // fallback inline paragraph
      return `<p class="text-lg md:text-xl font-semibold text-neutral-100 leading-tight">${content}</p>`;
    }

    return nunjucks.renderString(tpl, { content: content, text: content, i18n: i18nData, lang: ctxLang });
  });

  // CTA shortcode: renders Book + Contact buttons together
  // Accepts optional parameters: bookLabel, contactLabel
  // Usage: {% cta %} or {% cta "Book text", "Contact text" %}
  eleventyConfig.addShortcode("cta", function (bookLabel, contactLabel) {
    const ctxLang = (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    const bookTplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'book.njk');
    const contactTplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'contact.njk');
    let bookTpl = '';
    let contactTpl = '';
    try {
      bookTpl = fs.readFileSync(bookTplPath, 'utf8');
    } catch (e) {
      bookTpl = '';
    }
    try {
      contactTpl = fs.readFileSync(contactTplPath, 'utf8');
    } catch (e) {
      contactTpl = '';
    }

    const bookHtml = bookTpl ? nunjucks.renderString(bookTpl, { i18n: i18nData, lang: ctxLang, label: bookLabel }) : '';
    // If contactLabel not provided, use fixed placeholder 'contact'
    const contactHtml = contactTpl ? nunjucks.renderString(contactTpl, { i18n: i18nData, lang: ctxLang, label: (contactLabel || 'contact') }) : '';

    return `<section class="my-8"><div class="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center"><div class="md:w-auto">${bookHtml}</div><div class="md:w-auto">${contactHtml}</div></div></section>`;
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
    let out = `<div class="columns-1 md:columns-2 lg:columns-3 gap-2 not-prose mt-10">`;
    for (const src of images) {
      const safeSrc = src.replace(/"/g, '%22');
      out += `<a href="${safeSrc}" class="lightbox block mb-2 break-inside-avoid"><img src="${safeSrc}" alt="" class="w-full object-cover" loading="lazy"></a>`;
    }
    out += `</div>`;
    return out;
  });

  // Gigs shortcode: render upcoming gigs, optional limit parameter
  eleventyConfig.addShortcode("gigs", function (limit, showDescription) {
    const ctxLang = (this && this.ctx && this.ctx.lang) || (this.page && this.page.data && this.page.data.lang) || 'en';
    const { DateTime } = require('luxon');
    // Collections can be available directly on `this.collections` or inside `this.ctx.collections`
    let allGigs = [];
    try {
      if (this && this.collections && this.collections.gigs) {
        allGigs = this.collections.gigs;
      } else if (this && this.ctx && this.ctx.collections && this.ctx.collections.gigs) {
        allGigs = this.ctx.collections.gigs;
      } else if (global && global.collections && global.collections.gigs) {
        allGigs = global.collections.gigs;
      }
    } catch (e) {
      allGigs = [];
    }

    // Filter to today or later (day-level)
    const today = DateTime.local().startOf('day');
    const future = allGigs.filter(item => {
      try {
        const itemDate = DateTime.fromJSDate(new Date(item.date)).startOf('day');
        return itemDate >= today;
      } catch (e) {
        return false;
      }
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const count = (typeof limit === 'number' || (typeof limit === 'string' && limit.match(/^\d+$/))) ? parseInt(limit, 10) : null;
    // showDescription defaults to true; allow passing 'false' or false
    let showDesc = true;
    if (typeof showDescription !== 'undefined') {
      if (typeof showDescription === 'string') {
        const s = showDescription.toLowerCase();
        showDesc = !(s === 'false' || s === '0' || s === 'no');
      } else {
        showDesc = Boolean(showDescription);
      }
    }
    const items = count ? future.slice(0, count) : future;

    if (!items || items.length === 0) return '';

    // Render via shortcodes/gigs.njk so markup lives in one place
    const tplPath = path.join(__dirname, 'src', '_includes', 'shortcodes', 'gigs.njk');
    try {
      const tpl = fs.readFileSync(tplPath, 'utf8');

      // Prepare simplified items for template
      const prepared = items.map(gig => {
        // Always format dates using Finnish locale for consistent presentation
        const locale = 'fi';
        let dateStr = '';
        try {
          dateStr = DateTime.fromJSDate(new Date(gig.date)).setLocale(locale).toLocaleString(DateTime.DATE_SHORT);
        } catch (e) {
          dateStr = gig.date || '';
        }
        return {
          dateStr,
          title: (gig.data && gig.data.title) ? gig.data.title : '',
          // short description/frontmatter teaser (new field)
          short: (gig.data && gig.data.shortDescription) ? gig.data.shortDescription : null,
          // full content (rendered template content or raw content)
          content: gig.templateContent || gig.content || '',
          time: (gig.data && gig.data.time) ? gig.data.time : null,
          gmaps: (gig.data && gig.data.gmaps) ? gig.data.gmaps : null,
          location: (gig.data && gig.data.location) ? gig.data.location : null,
          fblink: (gig.data && gig.data.fblink) ? gig.data.fblink : null,
          weblink: (gig.data && gig.data.weblink) ? gig.data.weblink : null,
        };
      });

      return nunjucks.renderString(tpl, { items: prepared, i18n: i18nData, lang: ctxLang, showDescription: showDesc });
    } catch (e) {
      // fallback to inline rendering
      const heading = (i18nData[ctxLang] && i18nData[ctxLang].gigs && i18nData[ctxLang].gigs.upcoming) ? i18nData[ctxLang].gigs.upcoming : (i18nData.en && i18nData.en.gigs && i18nData.en.gigs.upcoming) || 'Upcoming Gigs';
      let out = `<section><div class="prose"><h1 class="mt-16 mb-10" id="gigs">${heading}</h1></div>`;
      for (const gig of items) {
        // Use Finnish locale for date formatting
        const locale = 'fi';
        let dateStr = '';
        try {
          dateStr = DateTime.fromJSDate(new Date(gig.date)).setLocale(locale).toLocaleString(DateTime.DATE_SHORT);
        } catch (e) {
          dateStr = gig.date || '';
        }
        const title = (gig.data && gig.data.title) ? gig.data.title : '';
        const short = (gig.data && gig.data.shortDescription) ? gig.data.shortDescription : null;
        const content = gig.templateContent || gig.content || '';
        out += `\n\n<h2 class="mb-2 text-neutral-100 font-semibold">${dateStr} - ${title}</h2>`;
        if (short) {
          out += `\n\n<div class="text-neutral-300 mb-2">${short}</div>`;
        }
        // full content only shown when showDescription is true
        if (showDesc && content) {
          out += `\n\n<div class="text-neutral-300 mb-2">${content}</div>`;
        }
        out += `\n<ul class="mb-8">`;
        if (gig.data && gig.data.time) {
          out += `<li class="text-neutral-300"><i class="fa-regular fa-clock w-5 text-center"></i> <span class=" ">${gig.data.time}</span></li>`;
        }
        if (gig.data && gig.data.gmaps) {
          out += `<li class="text-neutral-300"><i class="fas fa-map-marker-alt w-5 text-center"></i> <a href="${gig.data.gmaps}" class="text-primary-600 hover:text-primary-500">${gig.data.location || gig.data.gmaps}</a></li>`;
        }
        if (gig.data && gig.data.fblink) {
          out += `<li class="text-neutral-300"><i class="fab fa-facebook-f w-5 text-center"></i> <a href="${gig.data.fblink}" class="text-primary-600 hover:text-primary-500">${gig.data.fblink}</a></li>`;
        }
        if (gig.data && gig.data.weblink) {
          out += `<li class="text-neutral-300"><i class="fa-solid fa-link w-5 text-center"></i> <a href="${gig.data.weblink}" class="text-primary-600 hover:text-primary-500">${gig.data.weblink}</a></li>`;
        }
        out += `</ul>`;
      }
      out += `</section>`;
      return out;
    }
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