/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats. Base: columns. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. Columns v1 resource type - no field hinting.
 * Two columns: heading+paragraph+link | stat numbers+labels
 */
export default function parse(element, { document }) {
  const grid = element.querySelector(':scope > .aem-Grid');
  const containers = grid
    ? Array.from(grid.querySelectorAll(':scope > .container.responsivegrid'))
    : [];

  // Column 1: heading, paragraph, link
  const col1 = document.createDocumentFragment();
  if (containers[0]) {
    const heading = containers[0].querySelector('h2');
    const para = containers[0].querySelector('.cmp-richtext p:not(:has(a))');
    const linkEl = containers[0].querySelector('.cmp-richtext a');

    if (heading) col1.appendChild(heading);
    if (para) col1.appendChild(para);
    if (linkEl) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = linkEl.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    }
  }

  // Column 2: stat numbers and labels
  const col2 = document.createDocumentFragment();
  if (containers[1]) {
    const richtexts = containers[1].querySelectorAll('.cmp-richtext');
    richtexts.forEach((rt) => {
      const p = rt.querySelector('p');
      if (p && p.textContent.trim()) {
        col2.appendChild(p);
      }
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
