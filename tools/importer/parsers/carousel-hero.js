/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero. Base: carousel. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. UE model: carousel-hero-item (media_image, content_text).
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.cmp-image__image');
    const heading = slide.querySelector('.cmp-hero-spot__title');
    const descriptionEl = slide.querySelector('.cmp-hero-spot__description');
    const ctaLink = slide.querySelector('.cmp-hero-spot__action-link');

    // Column 1: media_image (media_imageAlt is collapsed into img alt attribute)
    const mediaFrag = document.createDocumentFragment();
    if (img) {
      mediaFrag.appendChild(document.createComment(' field:media_image '));
      mediaFrag.appendChild(img);
    }

    // Column 2: content_text (richtext: heading + description + CTA)
    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(' field:content_text '));
    if (heading) contentFrag.appendChild(heading);
    if (descriptionEl) {
      const mainDesc = descriptionEl.querySelector(':scope > p');
      if (mainDesc) contentFrag.appendChild(mainDesc);
    }
    if (ctaLink) {
      const p = document.createElement('p');
      p.appendChild(ctaLink);
      contentFrag.appendChild(p);
    }

    cells.push([mediaFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
