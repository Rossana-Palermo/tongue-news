/**
 * main.js — Application entry point
 *
 * Orchestrates the Service Layer (NewsService) and the UI layer (renderer).
 */

import { NewsService } from './services/newsService.js';
import {
  renderSkeletons,
  removeSkeletons,
  renderNewsItems,
  showLoadMoreButton,
  hideLoadMoreButton,
  setLoadMoreLoading,
  onLoadMore,
  showError,
  clearError,
} from './ui/renderer.js';

const newsService = new NewsService();

async function loadBatch(isInitial = false) {
  clearError();

  if (isInitial) {
    renderSkeletons(10);
  } else {
    setLoadMoreLoading(true);
    renderSkeletons(10);
  }

  try {
    const items = await newsService.loadNextBatch();
    removeSkeletons();
    renderNewsItems(items);

    if (newsService.hasMore()) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (err) {
    removeSkeletons();
    showError('Could not load stories. Please check your connection and try again.');
    console.error('[Tongue] Error loading batch:', err);
  } finally {
    setLoadMoreLoading(false);
  }
}

async function init() {
  try {
    await newsService.fetchStoryIds();
    await loadBatch(true);

    onLoadMore(async () => {
      hideLoadMoreButton();
      await loadBatch(false);
    });
  } catch (err) {
    removeSkeletons();
    showError('Could not connect to Hacker News. Please try again later.');
    console.error('[Tongue] Init error:', err);
  }
}

init();