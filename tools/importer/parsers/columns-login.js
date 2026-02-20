/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-login. Base: columns. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. Columns v1 resource type - no field hinting.
 * Two columns: heading+paragraph | buttons+link
 */
export default function parse(element, { document }) {
  // Get the two column containers from the AEM grid
  const grid = element.querySelector(':scope > .aem-Grid');
  const containers = grid
    ? Array.from(grid.querySelectorAll(':scope > .container.responsivegrid'))
    : [];

  // Column 1: heading + paragraph
  const col1 = document.createDocumentFragment();
  if (containers[0]) {
    const heading = containers[0].querySelector('h1');
    const para = containers[0].querySelector('.cmp-richtext p');
    if (heading) col1.appendChild(heading);
    if (para) col1.appendChild(para);
  }

  // Column 2: buttons + link
  const col2 = document.createDocumentFragment();
  if (containers[1]) {
    const buttons = containers[1].querySelectorAll('a.cmp-button');
    buttons.forEach((btn) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = btn.href;
      a.textContent = btn.querySelector('.cmp-button__text')?.textContent?.trim()
        || btn.textContent.trim();
      p.appendChild(a);
      col2.appendChild(p);
    });
    // Account access link (first unique .cmp-richtext a not inside a button)
    const richLinks = containers[1].querySelectorAll('.cmp-richtext a');
    const seen = new Set();
    richLinks.forEach((link) => {
      const href = link.href;
      if (!seen.has(href)) {
        seen.add(href);
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        col2.appendChild(p);
      }
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-login', cells });
  element.replaceWith(block);
}
