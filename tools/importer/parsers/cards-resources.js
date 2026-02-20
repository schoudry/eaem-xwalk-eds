/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resources. Base: cards. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. UE model: cards-resources-card (image, text).
 * Aggregates all resource cards within .card-container-3 into a single block.
 */
export default function parse(element, { document }) {
  // Find parent container that holds all resource cards
  const container = element.closest('.card-container-3')
    || element.closest('.cmp-container');
  const allCards = container
    ? Array.from(container.querySelectorAll('.card.teaser.card--vertical'))
    : [element];

  // Only process from the first card; remove subsequent cards
  if (allCards.length > 1 && element !== allCards[0]) {
    element.remove();
    return;
  }

  const cells = [];

  allCards.forEach((card) => {
    const img = card.querySelector('.cmp-image__image');
    const heading = card.querySelector('.c11n-card__heading h3, h3');
    const body = card.querySelector('.c11n-card__body p, .c11n-card__body');
    const cta = card.querySelector('a.c11n-button, a.c11n-link');

    // Column 1: image with field hint
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: text with field hint (heading + body + CTA)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) textFrag.appendChild(heading);
    if (body) textFrag.appendChild(body);
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  // Remove remaining cards (already included in block)
  for (let i = 1; i < allCards.length; i++) {
    allCards[i].remove();
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
