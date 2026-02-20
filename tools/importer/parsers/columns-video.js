/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-video. Base: columns. Source: https://investor.vanguard.com/
 * Selectors from captured DOM. Columns v1 resource type - no field hinting.
 * Two columns: heading+paragraph+button | video poster image
 */
export default function parse(element, { document }) {
  const grid = element.querySelector(':scope > .aem-Grid');
  const containers = grid
    ? Array.from(grid.querySelectorAll(':scope > .container.responsivegrid'))
    : [];

  // Column 1: heading, paragraph, button
  const col1 = document.createDocumentFragment();
  if (containers[0]) {
    const heading = containers[0].querySelector('h2');
    const para = containers[0].querySelector('.cmp-richtext p');
    const button = containers[0].querySelector('a.cmp-button');

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
  }

  // Column 2: video poster image
  const col2 = document.createDocumentFragment();
  if (containers[1]) {
    const videoImg = containers[1].querySelector('.cmp-videoplayer--image, .cmp-videoplayer img');
    if (videoImg) {
      col2.appendChild(videoImg);
    }
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-video', cells });
  element.replaceWith(block);
}
