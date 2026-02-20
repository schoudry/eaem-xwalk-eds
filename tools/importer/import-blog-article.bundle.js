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

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/transformers/blogspot-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".body-fauxcolumns",
        ".content-fauxcolumns",
        ".tabs-outer"
      ]);
      const emptyParas = element.querySelectorAll("p");
      emptyParas.forEach((p) => {
        const text = p.textContent.trim();
        if (text === "" && p.children.length <= 1 && p.querySelector("br")) {
          p.remove();
        }
      });
      const separators = element.querySelectorAll(".separator");
      separators.forEach((sep) => {
        const text = sep.textContent.trim();
        if (text === "" && !sep.querySelector("img")) {
          sep.remove();
        }
      });
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".post-footer",
        "#comments",
        ".blog-pager",
        ".post-feeds",
        ".column-left-outer",
        ".column-right-outer",
        ".post-header",
        "iframe",
        "link",
        "noscript",
        "meta"
      ]);
      const emptyDivs = element.querySelectorAll(".clear, .date-outer > .date-header");
      emptyDivs.forEach((el) => el.remove());
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/import-blog-article.js
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "Blog article page from Experience AEM Blogspot with technical AEM tutorial content",
    urls: [
      "https://experience-aem.blogspot.com/2026/01/aem-cloud-service-github-actions-workflow-sync-code-github-repo-adobe-cloud-git-repo.html"
    ],
    blocks: [],
    sections: [
      {
        id: "section-1",
        name: "Article Content",
        selector: ".post-body.entry-content",
        style: null,
        blocks: [],
        defaultContent: [
          "h3.post-title.entry-title",
          ".post-body.entry-content p",
          ".post-body.entry-content .separator img",
          ".post-body.entry-content div"
        ]
      }
    ]
  };
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
  var import_blog_article_default = {
    /**
     * Main transformation function for blog-article template.
     * All content is default content (headings, paragraphs, images, preformatted code).
     * No block parsers needed - transformer handles chrome removal only.
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_blog_article_exports);
})();
