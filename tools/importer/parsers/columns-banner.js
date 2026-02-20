/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-banner. Base: columns. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. Columns v1 resource type - no field hinting.
 * Two columns: award badge image | heading+description+links
 */
export default function parse(element, { document }) {
  // The banner is deeply nested; find the inner grid with the two column containers
  const innerGrid = element.querySelector('#container-474ec65b54 > .aem-Grid')
    || element.querySelector('.cmp-container--fixed.cmp-container--videohero .cmp-container > .aem-Grid');
  const containers = innerGrid
    ? Array.from(innerGrid.querySelectorAll(':scope > .container.responsivegrid'))
    : [];

  // Column 1: award badge image
  const col1 = document.createDocumentFragment();
  if (containers[0]) {
    const img = containers[0].querySelector('.cmp-image__image');
    if (img) col1.appendChild(img);
  }

  // Column 2: heading, bold description, fine print with links
  const col2 = document.createDocumentFragment();
  if (containers[1]) {
    const heading = containers[1].querySelector('h2');
    if (heading) col2.appendChild(heading);

    const richtexts = containers[1].querySelectorAll('.cmp-richtext');
    richtexts.forEach((rt) => {
      const p = rt.querySelector('p');
      if (p && p.textContent.trim()) {
        col2.appendChild(p);
      }
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
