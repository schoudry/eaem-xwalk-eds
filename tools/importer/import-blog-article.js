/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import blogspotCleanupTransformer from './transformers/blogspot-cleanup.js';

// TRANSFORMER REGISTRY
const transformers = [
  blogspotCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'Blog article page from Experience AEM Blogspot with technical AEM tutorial content',
  urls: [
    'https://experience-aem.blogspot.com/2026/01/aem-cloud-service-github-actions-workflow-sync-code-github-repo-adobe-cloud-git-repo.html',
  ],
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Article Content',
      selector: '.post-body.entry-content',
      style: null,
      blocks: [],
      defaultContent: [
        'h3.post-title.entry-title',
        '.post-body.entry-content p',
        '.post-body.entry-content .separator img',
        '.post-body.entry-content div',
      ],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function for blog-article template.
   * All content is default content (headings, paragraphs, images, preformatted code).
   * No block parsers needed - transformer handles chrome removal only.
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. No block parsing needed - all content is default content

    // 3. Execute afterTransform transformers (remove non-authorable chrome)
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
