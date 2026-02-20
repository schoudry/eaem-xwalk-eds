/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Vanguard cleanup. Removes non-authorable content from Vanguard investor pages.
 * Selectors from captured DOM at https://investor.vanguard.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent SDK (OneTrust) - blocks parsing with overlays
    // Found in captured HTML: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove video player cookie warning overlay
    // Found in captured HTML: <div class="cmp-videoplayer--warning-overlay">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-videoplayer--warning-overlay',
    ]);

    // Remove modal dialogs that block content
    // Found in captured HTML: <dialog class="cmp-modal">, <div class="modal">
    WebImporter.DOMUtils.remove(element, [
      'dialog.cmp-modal',
      'div.modal',
      '.disclosure-fragment',
    ]);

    // Remove empty alert banner
    // Found in captured HTML: <div class="alert text cmp-alert--primary-link"> (empty)
    const alertBanner = element.querySelector('div.alert.text');
    if (alertBanner && alertBanner.textContent.trim() === '') {
      alertBanner.remove();
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking iframes and beacons
    // Found in captured HTML: iframes for doubleclick.net, adsrvr.org, and Bing beacon
    WebImporter.DOMUtils.remove(element, [
      'iframe[src*="doubleclick.net"]',
      'iframe[src*="adsrvr.org"]',
      'div[id^="batBeacon"]',
      'iframe#universal_pixel',
    ]);

    // Remove SVG icon sprite sheet (large non-content SVG)
    // Found in captured HTML: <div id="c11n-icon-sticker-sheet">
    WebImporter.DOMUtils.remove(element, [
      '#c11n-icon-sticker-sheet',
    ]);

    // Remove carousel interactive controls (UI chrome, not authorable)
    // Found in captured HTML: <div class="cmp-carousel__actions">, <ol class="cmp-carousel__indicators">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-carousel__actions',
      '.cmp-carousel__indicators',
    ]);

    // Remove remaining iframes, noscript, and link elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
