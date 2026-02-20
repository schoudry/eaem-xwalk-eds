/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-products. Base: columns. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. Columns v1 resource type - no field hinting.
 * Two columns: heading+paragraph+button+link | product list
 */
export default function parse(element, { document }) {
  const grid = element.querySelector(':scope > .aem-Grid');
  const containers = grid
    ? Array.from(grid.querySelectorAll(':scope > .container.responsivegrid'))
    : [];

  // Column 1: heading, paragraph, button, link
  const col1 = document.createDocumentFragment();
  if (containers[0]) {
    const heading = containers[0].querySelector('h2');
    const para = containers[0].querySelector('.cmp-richtext p');
    const button = containers[0].querySelector('a.cmp-button');
    const richLink = containers[0].querySelector('.cmp-richtext--primary-link .cmp-richtext a');

    if (heading) col1.appendChild(heading);
    if (para) col1.appendChild(para);
    if (button) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = button.href;
      a.textContent = button.querySelector('.cmp-button__text')?.textContent?.trim()
        || button.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    }
    if (richLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = richLink.href;
      a.textContent = richLink.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    }
  }

  // Column 2: product list
  const col2 = document.createDocumentFragment();
  if (containers[1]) {
    const list = containers[1].querySelector('ul.cmp-list');
    if (list) {
      const ul = document.createElement('ul');
      const items = list.querySelectorAll('.cmp-list__item');
      items.forEach((item) => {
        const link = item.querySelector('a.cmp-list__item-link');
        const title = item.querySelector('.cmp-list__item-title');
        if (link && title) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = title.textContent.trim();
          li.appendChild(a);
          ul.appendChild(li);
        }
      });
      col2.appendChild(ul);
    }
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-products', cells });
  element.replaceWith(block);
}
