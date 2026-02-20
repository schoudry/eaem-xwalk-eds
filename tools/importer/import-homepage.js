/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsLoginParser from './parsers/columns-login.js';
import cardsGoalsParser from './parsers/cards-goals.js';
import columnsProductsParser from './parsers/columns-products.js';
import columnsVideoParser from './parsers/columns-video.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsFeaturedParser from './parsers/cards-featured.js';
import cardsResourcesParser from './parsers/cards-resources.js';
import columnsBannerParser from './parsers/columns-banner.js';

// TRANSFORMER IMPORTS
import vanguardCleanupTransformer from './transformers/vanguard-cleanup.js';
import vanguardSectionsTransformer from './transformers/vanguard-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-login': columnsLoginParser,
  'cards-goals': cardsGoalsParser,
  'columns-products': columnsProductsParser,
  'columns-video': columnsVideoParser,
  'columns-stats': columnsStatsParser,
  'cards-featured': cardsFeaturedParser,
  'cards-resources': cardsResourcesParser,
  'columns-banner': columnsBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  vanguardCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Vanguard Investor homepage with financial services overview, investment options, and account access',
  urls: [
    'https://investor.vanguard.com/',
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.cmp-carousel--hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Login Bar',
      selector: '#login-section',
      style: null,
      blocks: ['columns-login'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Goals Cards',
      selector: '#container-d6b4e839ac',
      style: null,
      blocks: ['cards-goals'],
      defaultContent: ['#container-d6b4e839ac .cmp-richtext'],
    },
    {
      id: 'section-4',
      name: 'Investment Products',
      selector: '#container-3cf0286f4d',
      style: null,
      blocks: ['columns-products'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Empowering Investors',
      selector: '#hp-youre-in-good-company',
      style: null,
      blocks: ['columns-video'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Discover Benefits CTA',
      selector: '#Account-types-overview-ready-to-open-account--section',
      style: 'dark',
      blocks: [],
      defaultContent: [
        '#Account-types-overview-ready-to-open-account--section .cmp-richtext',
        '#Account-types-overview-ready-to-open-account--section .cmp-button',
      ],
    },
    {
      id: 'section-7',
      name: 'Good Company Stats',
      selector: '#container-d881faf327',
      style: 'dark',
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Helpful Resources',
      selector: '#container-6a4d79438a',
      style: null,
      blocks: ['cards-featured', 'cards-resources'],
      defaultContent: ['#container-6a4d79438a > .aem-Grid > .richtext:first-child'],
    },
    {
      id: 'section-9',
      name: 'J.D. Power Award Banner',
      selector: '.cmp-experiencefragment--2025-jd-power-award-banner',
      style: 'light-grey',
      blocks: ['columns-banner'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Start Investing CTA',
      selector: '#marketing-bar-article',
      style: 'dark-red',
      blocks: [],
      defaultContent: [
        '#marketing-bar-article .cmp-richtext',
        '#marketing-bar-article .cmp-button',
      ],
    },
    {
      id: 'section-11',
      name: 'Disclaimers',
      selector: '#hp-footer-info',
      style: null,
      blocks: [],
      defaultContent: ['#hp-footer-info .cmp-richtext'],
    },
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.cmp-carousel--hero'],
    },
    {
      name: 'columns-login',
      instances: ['#login-section'],
    },
    {
      name: 'cards-goals',
      instances: ['#container-d6b4e839ac .card.teaser.card--vertical'],
    },
    {
      name: 'columns-products',
      instances: ['#container-3cf0286f4d'],
    },
    {
      name: 'columns-video',
      instances: ['#hp-youre-in-good-company'],
    },
    {
      name: 'columns-stats',
      instances: ['#container-d881faf327'],
    },
    {
      name: 'cards-featured',
      instances: ['.card.teaser.card--horizontal'],
    },
    {
      name: 'cards-resources',
      instances: ['.card-container-3 .card.teaser.card--vertical'],
    },
    {
      name: 'columns-banner',
      instances: ['.cmp-experiencefragment--2025-jd-power-award-banner'],
    },
  ],
};

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Execute section transformer (adds <hr> breaks and section-metadata)
    if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        vanguardSectionsTransformer.call(null, 'afterTransform', main, {
          ...payload,
          template: PAGE_TEMPLATE,
        });
      } catch (e) {
        console.error('Section transformer failed:', e);
      }
    }

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path
    const pathname = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(pathname || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
