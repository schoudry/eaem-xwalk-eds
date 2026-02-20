/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-goals. Base: cards. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. UE model: cards-goals-card (image, text).
 * Aggregates all goal cards within #container-d6b4e839ac into a single block.
 */
export default function parse(element, { document }) {
  // Find parent container that holds all goal cards
  const container = element.closest('#container-d6b4e839ac')
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-goals', cells });
  element.replaceWith(block);
}
