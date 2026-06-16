import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NewsService } from '../js/services/newsService.js';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from 'axios';

describe('NewsService', () => {
  let service;

  beforeEach(() => {
    service = new NewsService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchStoryIds', () => {
    it('fetches and stores the list of story IDs', async () => {
      const mockIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      axios.get.mockResolvedValueOnce({ data: mockIds });

      await service.fetchStoryIds();

      expect(axios.get).toHaveBeenCalledWith(
        'https://hacker-news.firebaseio.com/v0/newstories.json'
      );
      expect(service.totalIds).toBe(11);
      expect(service.offset).toBe(0);
    });

    it('resets the offset to 0 on each call', async () => {
      axios.get.mockResolvedValue({ data: [1, 2, 3] });

      await service.fetchStoryIds();
      await service.fetchStoryIds();

      expect(service.offset).toBe(0);
    });
  });

  describe('loadNextBatch', () => {
    const makeItemResponse = (id) => ({
      data: { id, title: `Story ${id}`, url: `https://example.com/${id}`, time: 1625568000 },
    });

    beforeEach(async () => {
      const ids = Array.from({ length: 25 }, (_, i) => i + 1);
      axios.get.mockResolvedValueOnce({ data: ids });
      await service.fetchStoryIds();
    });

    it('loads exactly 10 items in the first batch', async () => {
      for (let i = 1; i <= 10; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }

      const items = await service.loadNextBatch();

      expect(items).toHaveLength(10);
      expect(service.offset).toBe(10);
    });

    it('returns items with the correct shape', async () => {
      for (let i = 1; i <= 10; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }

      const items = await service.loadNextBatch();

      expect(items[0]).toMatchObject({
        id: 1,
        title: 'Story 1',
        url: 'https://example.com/1',
        time: 1625568000,
      });
    });

    it('advances the offset correctly across multiple batches', async () => {
      for (let i = 1; i <= 10; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }
      await service.loadNextBatch();
      expect(service.offset).toBe(10);

      for (let i = 11; i <= 20; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }
      await service.loadNextBatch();
      expect(service.offset).toBe(20);
    });

    it('returns an empty array when there are no more IDs', async () => {
      for (let i = 1; i <= 25; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }
      await service.loadNextBatch();
      await service.loadNextBatch();
      await service.loadNextBatch();

      const items = await service.loadNextBatch();
      expect(items).toHaveLength(0);
    });

    it('uses "Untitled" as fallback when title is missing', async () => {
      axios.get.mockResolvedValueOnce({ data: { id: 99, time: 1625568000 } });
      for (let i = 2; i <= 10; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }

      const items = await service.loadNextBatch();
      expect(items[0].title).toBe('Untitled');
    });

    it('uses null as fallback when url is missing', async () => {
      axios.get.mockResolvedValueOnce({
        data: { id: 99, title: 'Ask HN: something', time: 1625568000 },
      });
      for (let i = 2; i <= 10; i++) {
        axios.get.mockResolvedValueOnce(makeItemResponse(i));
      }

      const items = await service.loadNextBatch();
      expect(items[0].url).toBeNull();
    });
  });

  describe('hasMore', () => {
    it('returns true when there are unloaded IDs', async () => {
      axios.get.mockResolvedValueOnce({ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] });
      await service.fetchStoryIds();

      for (let i = 1; i <= 10; i++) {
        axios.get.mockResolvedValueOnce({
          data: { id: i, title: `Story ${i}`, url: null, time: 1000 },
        });
      }
      await service.loadNextBatch();

      expect(service.hasMore()).toBe(true);
    });

    it('returns false when all IDs have been loaded', async () => {
      axios.get.mockResolvedValueOnce({ data: [1, 2, 3] });
      await service.fetchStoryIds();

      for (let i = 1; i <= 3; i++) {
        axios.get.mockResolvedValueOnce({
          data: { id: i, title: `Story ${i}`, url: null, time: 1000 },
        });
      }
      await service.loadNextBatch();

      expect(service.hasMore()).toBe(false);
    });
  });
});