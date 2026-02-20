/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-featured. Base: cards. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. UE model: cards-featured-card (image, text).
 * Single horizontal featured card.
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image__image');
  const heading = element.querySelector('.c11n-card__heading h3, h3');
  const body = element.querySelector('.c11n-card__body p, .c11n-card__body');
  const cta = element.querySelector('a.c11n-button, a.c11n-link');

  const cells = [];

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-featured', cells });
  element.replaceWith(block);
}
