/**
 * renderer.js — UI Layer
 *
 * All DOM manipulation lives here.
 * Receives plain data, produces HTML. No API knowledge.
 */

import { formatDate, extractDomain } from '../utils/formatDate.js';

const newsList = document.getElementById('news-list');
const loadMoreBtn = document.getElementById('load-more-btn');
const errorContainer = document.getElementById('error-container');

let cardCounter = 0;

export function renderSkeletons(count = 10) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.innerHTML = `
      <div class="skeleton skeleton--sm"></div>
      <div class="skeleton skeleton--lg"></div>
      <div class="skeleton skeleton--md"></div>
      <div class="skeleton skeleton--xs"></div>
    `;
    newsList.appendChild(el);
  }
}

export function removeSkeletons() {
  newsList.querySelectorAll('.skeleton-card').forEach((el) => el.remove());
}

export function renderNewsItems(items) {
  items.forEach((item) => {
    cardCounter++;
    const card = document.createElement('article');
    card.className = 'news-card';

    const domain = extractDomain(item.url);
    const date = formatDate(item.time);

    const titleEl = item.url
      ? `<a class="news-card__title" href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>`
      : `<span class="news-card__title news-card__title--no-link">${escapeHtml(item.title)}</span>`;

    const domainEl = domain
      ? `<span class="news-card__meta-dot"></span><a class="news-card__domain" href="${item.url}" target="_blank" rel="noopener noreferrer">${domain}</a>`
      : '';

    card.innerHTML = `
      <span class="news-card__index">#${cardCounter}</span>
      ${titleEl}
      <div class="news-card__meta">
        <span>${date}</span>
        ${domainEl}
      </div>
    `;

    newsList.appendChild(card);
  });
}

export function showLoadMoreButton() {
  loadMoreBtn.hidden = false;
}

export function hideLoadMoreButton() {
  loadMoreBtn.hidden = true;
}

export function setLoadMoreLoading(isLoading) {
  loadMoreBtn.disabled = isLoading;
  loadMoreBtn.textContent = isLoading ? 'Loading...' : 'Load more';
}

export function onLoadMore(handler) {
  loadMoreBtn.addEventListener('click', handler);
}

export function showError(message) {
  errorContainer.hidden = false;
  errorContainer.textContent = `⚠️ ${message}`;
}

export function clearError() {
  errorContainer.hidden = true;
  errorContainer.textContent = '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}