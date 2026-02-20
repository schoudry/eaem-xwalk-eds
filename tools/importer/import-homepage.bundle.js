var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-image__image");
      const heading = slide.querySelector(".cmp-hero-spot__title");
      const descriptionEl = slide.querySelector(".cmp-hero-spot__description");
      const ctaLink = slide.querySelector(".cmp-hero-spot__action-link");
      const mediaFrag = document.createDocumentFragment();
      if (img) {
        mediaFrag.appendChild(document.createComment(" field:media_image "));
        mediaFrag.appendChild(img);
      }
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_text "));
      if (heading) contentFrag.appendChild(heading);
      if (descriptionEl) {
        const mainDesc = descriptionEl.querySelector(":scope > p");
        if (mainDesc) contentFrag.appendChild(mainDesc);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        p.appendChild(ctaLink);
        contentFrag.appendChild(p);
      }
      cells.push([mediaFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-login.js
  function parse2(element, { document }) {
    const grid = element.querySelector(":scope > .aem-Grid");
    const containers = grid ? Array.from(grid.querySelectorAll(":scope > .container.responsivegrid")) : [];
    const col1 = document.createDocumentFragment();
    if (containers[0]) {
      const heading = containers[0].querySelector("h1");
      const para = containers[0].querySelector(".cmp-richtext p");
      if (heading) col1.appendChild(heading);
      if (para) col1.appendChild(para);
    }
    const col2 = document.createDocumentFragment();
    if (containers[1]) {
      const buttons = containers[1].querySelectorAll("a.cmp-button");
      buttons.forEach((btn) => {
        var _a, _b;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = btn.href;
        a.textContent = ((_b = (_a = btn.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || btn.textContent.trim();
        p.appendChild(a);
        col2.appendChild(p);
      });
      const richLinks = containers[1].querySelectorAll(".cmp-richtext a");
      const seen = /* @__PURE__ */ new Set();
      richLinks.forEach((link) => {
        const href = link.href;
        if (!seen.has(href)) {
          seen.add(href);
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = link.textContent.trim();
          p.appendChild(a);
          col2.appendChild(p);
        }
      });
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-login", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-goals.js
  function parse3(element, { document }) {
    const container = element.closest("#container-d6b4e839ac") || element.closest(".cmp-container");
    const allCards = container ? Array.from(container.querySelectorAll(".card.teaser.card--vertical")) : [element];
    if (allCards.length > 1 && element !== allCards[0]) {
      element.remove();
      return;
    }
    const cells = [];
    allCards.forEach((card) => {
      const img = card.querySelector(".cmp-image__image");
      const heading = card.querySelector(".c11n-card__heading h3, h3");
      const body = card.querySelector(".c11n-card__body p, .c11n-card__body");
      const cta = card.querySelector("a.c11n-button, a.c11n-link");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading) textFrag.appendChild(heading);
      if (body) textFrag.appendChild(body);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    for (let i = 1; i < allCards.length; i++) {
      allCards[i].remove();
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-goals", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-products.js
  function parse4(element, { document }) {
    var _a, _b;
    const grid = element.querySelector(":scope > .aem-Grid");
    const containers = grid ? Array.from(grid.querySelectorAll(":scope > .container.responsivegrid")) : [];
    const col1 = document.createDocumentFragment();
    if (containers[0]) {
      const heading = containers[0].querySelector("h2");
      const para = containers[0].querySelector(".cmp-richtext p");
      const button = containers[0].querySelector("a.cmp-button");
      const richLink = containers[0].querySelector(".cmp-richtext--primary-link .cmp-richtext a");
      if (heading) col1.appendChild(heading);
      if (para) col1.appendChild(para);
      if (button) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = button.href;
        a.textContent = ((_b = (_a = button.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || button.textContent.trim();
        p.appendChild(a);
        col1.appendChild(p);
      }
      if (richLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = richLink.href;
        a.textContent = richLink.textContent.trim();
        p.appendChild(a);
        col1.appendChild(p);
      }
    }
    const col2 = document.createDocumentFragment();
    if (containers[1]) {
      const list = containers[1].querySelector("ul.cmp-list");
      if (list) {
        const ul = document.createElement("ul");
        const items = list.querySelectorAll(".cmp-list__item");
        items.forEach((item) => {
          const link = item.querySelector("a.cmp-list__item-link");
          const title = item.querySelector(".cmp-list__item-title");
          if (link && title) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.href;
            a.textContent = title.textContent.trim();
            li.appendChild(a);
            ul.appendChild(li);
          }
        });
        col2.appendChild(ul);
      }
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-products", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-video.js
  function parse5(element, { document }) {
    var _a, _b;
    const grid = element.querySelector(":scope > .aem-Grid");
    const containers = grid ? Array.from(grid.querySelectorAll(":scope > .container.responsivegrid")) : [];
    const col1 = document.createDocumentFragment();
    if (containers[0]) {
      const heading = containers[0].querySelector("h2");
      const para = containers[0].querySelector(".cmp-richtext p");
      const button = containers[0].querySelector("a.cmp-button");
      if (heading) col1.appendChild(heading);
      if (para) col1.appendChild(para);
      if (button) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = button.href;
        a.textContent = ((_b = (_a = button.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || button.textContent.trim();
        p.appendChild(a);
        col1.appendChild(p);
      }
    }
    const col2 = document.createDocumentFragment();
    if (containers[1]) {
      const videoImg = containers[1].querySelector(".cmp-videoplayer--image, .cmp-videoplayer img");
      if (videoImg) {
        col2.appendChild(videoImg);
      }
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse6(element, { document }) {
    const grid = element.querySelector(":scope > .aem-Grid");
    const containers = grid ? Array.from(grid.querySelectorAll(":scope > .container.responsivegrid")) : [];
    const col1 = document.createDocumentFragment();
    if (containers[0]) {
      const heading = containers[0].querySelector("h2");
      const para = containers[0].querySelector(".cmp-richtext p:not(:has(a))");
      const linkEl = containers[0].querySelector(".cmp-richtext a");
      if (heading) col1.appendChild(heading);
      if (para) col1.appendChild(para);
      if (linkEl) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = linkEl.href;
        a.textContent = linkEl.textContent.trim();
        p.appendChild(a);
        col1.appendChild(p);
      }
    }
    const col2 = document.createDocumentFragment();
    if (containers[1]) {
      const richtexts = containers[1].querySelectorAll(".cmp-richtext");
      richtexts.forEach((rt) => {
        const p = rt.querySelector("p");
        if (p && p.textContent.trim()) {
          col2.appendChild(p);
        }
      });
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-featured.js
  function parse7(element, { document }) {
    const img = element.querySelector(".cmp-image__image");
    const heading = element.querySelector(".c11n-card__heading h3, h3");
    const body = element.querySelector(".c11n-card__body p, .c11n-card__body");
    const cta = element.querySelector("a.c11n-button, a.c11n-link");
    const cells = [];
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(img);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading);
    if (body) textFrag.appendChild(body);
    if (cta) {
      const p = document.createElement("p");
      p.appendChild(cta);
      textFrag.appendChild(p);
    }
    cells.push([imageFrag, textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resources.js
  function parse8(element, { document }) {
    const container = element.closest(".card-container-3") || element.closest(".cmp-container");
    const allCards = container ? Array.from(container.querySelectorAll(".card.teaser.card--vertical")) : [element];
    if (allCards.length > 1 && element !== allCards[0]) {
      element.remove();
      return;
    }
    const cells = [];
    allCards.forEach((card) => {
      const img = card.querySelector(".cmp-image__image");
      const heading = card.querySelector(".c11n-card__heading h3, h3");
      const body = card.querySelector(".c11n-card__body p, .c11n-card__body");
      const cta = card.querySelector("a.c11n-button, a.c11n-link");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading) textFrag.appendChild(heading);
      if (body) textFrag.appendChild(body);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    for (let i = 1; i < allCards.length; i++) {
      allCards[i].remove();
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse9(element, { document }) {
    const innerGrid = element.querySelector("#container-474ec65b54 > .aem-Grid") || element.querySelector(".cmp-container--fixed.cmp-container--videohero .cmp-container > .aem-Grid");
    const containers = innerGrid ? Array.from(innerGrid.querySelectorAll(":scope > .container.responsivegrid")) : [];
    const col1 = document.createDocumentFragment();
    if (containers[0]) {
      const img = containers[0].querySelector(".cmp-image__image");
      if (img) col1.appendChild(img);
    }
    const col2 = document.createDocumentFragment();
    if (containers[1]) {
      const heading = containers[1].querySelector("h2");
      if (heading) col2.appendChild(heading);
      const richtexts = containers[1].querySelectorAll(".cmp-richtext");
      richtexts.forEach((rt) => {
        const p = rt.querySelector("p");
        if (p && p.textContent.trim()) {
          col2.appendChild(p);
        }
      });
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vanguard-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-videoplayer--warning-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "dialog.cmp-modal",
        "div.modal",
        ".disclosure-fragment"
      ]);
      const alertBanner = element.querySelector("div.alert.text");
      if (alertBanner && alertBanner.textContent.trim() === "") {
        alertBanner.remove();
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="adsrvr.org"]',
        'div[id^="batBeacon"]',
        "iframe#universal_pixel"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#c11n-icon-sticker-sheet"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-carousel__actions",
        ".cmp-carousel__indicators"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/vanguard-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const { document } = payload;
    const template = payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;
    const sections = template.sections;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: [["style", section.style]]
        });
        sectionEl.append(sectionMetadata);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-login": parse2,
    "cards-goals": parse3,
    "columns-products": parse4,
    "columns-video": parse5,
    "columns-stats": parse6,
    "cards-featured": parse7,
    "cards-resources": parse8,
    "columns-banner": parse9
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Vanguard Investor homepage with financial services overview, investment options, and account access",
    urls: [
      "https://investor.vanguard.com/"
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".cmp-carousel--hero",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Login Bar",
        selector: "#login-section",
        style: null,
        blocks: ["columns-login"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Goals Cards",
        selector: "#container-d6b4e839ac",
        style: null,
        blocks: ["cards-goals"],
        defaultContent: ["#container-d6b4e839ac .cmp-richtext"]
      },
      {
        id: "section-4",
        name: "Investment Products",
        selector: "#container-3cf0286f4d",
        style: null,
        blocks: ["columns-products"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Empowering Investors",
        selector: "#hp-youre-in-good-company",
        style: null,
        blocks: ["columns-video"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Discover Benefits CTA",
        selector: "#Account-types-overview-ready-to-open-account--section",
        style: "dark",
        blocks: [],
        defaultContent: [
          "#Account-types-overview-ready-to-open-account--section .cmp-richtext",
          "#Account-types-overview-ready-to-open-account--section .cmp-button"
        ]
      },
      {
        id: "section-7",
        name: "Good Company Stats",
        selector: "#container-d881faf327",
        style: "dark",
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Helpful Resources",
        selector: "#container-6a4d79438a",
        style: null,
        blocks: ["cards-featured", "cards-resources"],
        defaultContent: ["#container-6a4d79438a > .aem-Grid > .richtext:first-child"]
      },
      {
        id: "section-9",
        name: "J.D. Power Award Banner",
        selector: ".cmp-experiencefragment--2025-jd-power-award-banner",
        style: "light-grey",
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Start Investing CTA",
        selector: "#marketing-bar-article",
        style: "dark-red",
        blocks: [],
        defaultContent: [
          "#marketing-bar-article .cmp-richtext",
          "#marketing-bar-article .cmp-button"
        ]
      },
      {
        id: "section-11",
        name: "Disclaimers",
        selector: "#hp-footer-info",
        style: null,
        blocks: [],
        defaultContent: ["#hp-footer-info .cmp-richtext"]
      }
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".cmp-carousel--hero"]
      },
      {
        name: "columns-login",
        instances: ["#login-section"]
      },
      {
        name: "cards-goals",
        instances: ["#container-d6b4e839ac .card.teaser.card--vertical"]
      },
      {
        name: "columns-products",
        instances: ["#container-3cf0286f4d"]
      },
      {
        name: "columns-video",
        instances: ["#hp-youre-in-good-company"]
      },
      {
        name: "columns-stats",
        instances: ["#container-d881faf327"]
      },
      {
        name: "cards-featured",
        instances: [".card.teaser.card--horizontal"]
      },
      {
        name: "cards-resources",
        instances: [".card-container-3 .card.teaser.card--vertical"]
      },
      {
        name: "columns-banner",
        instances: [".cmp-experiencefragment--2025-jd-power-award-banner"]
      }
    ]
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
        try {
          transform2.call(null, "afterTransform", main, __spreadProps(__spreadValues({}, payload), {
            template: PAGE_TEMPLATE
          }));
        } catch (e) {
          console.error("Section transformer failed:", e);
        }
      }
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(pathname || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
