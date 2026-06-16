/**
 * NewsService — Service Layer Pattern
 *
 * All API communication is isolated here.
 * The UI layer never touches Axios or API URLs directly,
 * it only calls methods on this service.
 */

import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const BATCH_SIZE = 10;

export class NewsService {
  constructor() {
    this._allIds = [];
    this._offset = 0;
  }

  async fetchStoryIds() {
    const response = await axios.get(`${BASE_URL}/newstories.json`);
    this._allIds = response.data;
    this._offset = 0;
  }

  async loadNextBatch() {
    const ids = this._allIds.slice(this._offset, this._offset + BATCH_SIZE);
    if (ids.length === 0) return [];

    const items = await Promise.all(ids.map((id) => this._fetchItem(id)));

    this._offset += ids.length;
    return items;
  }

  hasMore() {
    return this._offset < this._allIds.length;
  }

  async _fetchItem(id) {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    const { title, url, time } = response.data;
    return { id, title: title ?? 'Untitled', url: url ?? null, time: time ?? null };
  }

  get offset() {
    return this._offset;
  }

  get totalIds() {
    return this._allIds.length;
  }
}