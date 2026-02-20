/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Blogspot cleanup.
 * Removes non-authorable Blogspot chrome, keeping only article body content.
 * Selectors from captured DOM of experience-aem.blogspot.com.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove decorative Blogspot layout wrappers that may interfere with parsing
    // Found in captured HTML: <div class="body-fauxcolumns">, <div class="content-fauxcolumns">, etc.
    WebImporter.DOMUtils.remove(element, [
      '.body-fauxcolumns',
      '.content-fauxcolumns',
      '.tabs-outer',
    ]);

    // Remove empty paragraphs with only <br> tags (common in Blogspot posts)
    const emptyParas = element.querySelectorAll('p');
    emptyParas.forEach((p) => {
      const text = p.textContent.trim();
      if (text === '' && p.children.length <= 1 && p.querySelector('br')) {
        p.remove();
      }
    });

    // Remove empty separator divs (Blogspot uses these as spacers)
    // Found in captured HTML: <div class="separator"><br></div>
    const separators = element.querySelectorAll('.separator');
    separators.forEach((sep) => {
      const text = sep.textContent.trim();
      if (text === '' && !sep.querySelector('img')) {
        sep.remove();
      }
    });
  }

  if (hookName === H.after) {
    // Remove non-authorable Blogspot site chrome
    // Found in captured HTML: <header>, <footer>, .post-footer, #comments, .blog-pager, sidebars
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.post-footer',
      '#comments',
      '.blog-pager',
      '.post-feeds',
      '.column-left-outer',
      '.column-right-outer',
      '.post-header',
      'iframe',
      'link',
      'noscript',
      'meta',
    ]);

    // Remove leftover empty wrapper divs
    const emptyDivs = element.querySelectorAll('.clear, .date-outer > .date-header');
    emptyDivs.forEach((el) => el.remove());

    // Clean tracking/non-content attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
