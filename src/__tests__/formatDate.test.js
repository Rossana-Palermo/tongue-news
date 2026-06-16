import { describe, it, expect } from 'vitest';
import { formatDate, extractDomain } from '../js/utils/formatDate.js';

describe('formatDate', () => {
  it('formats a valid Unix timestamp to a readable date', () => {
    const result = formatDate(1625568000);
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/2021/);
  });

  it('returns "Date unknown" for null input', () => {
    expect(formatDate(null)).toBe('Date unknown');
  });

  it('returns "Date unknown" for undefined input', () => {
    expect(formatDate(undefined)).toBe('Date unknown');
  });

  it('returns "Date unknown" for a string instead of a number', () => {
    expect(formatDate('not-a-timestamp')).toBe('Date unknown');
  });

  it('returns "Date unknown" for zero', () => {
    expect(formatDate(0)).toBe('Date unknown');
  });

  it('handles a recent timestamp correctly', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = formatDate(now);
    expect(result).toContain(new Date().getFullYear().toString());
  });
});

describe('extractDomain', () => {
  it('extracts the domain from a full URL', () => {
    expect(extractDomain('https://www.example.com/path?q=1')).toBe('example.com');
  });

  it('removes the www. prefix', () => {
    expect(extractDomain('https://www.github.com')).toBe('github.com');
  });

  it('returns empty string for null', () => {
    expect(extractDomain(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(extractDomain(undefined)).toBe('');
  });

  it('returns empty string for an invalid URL', () => {
    expect(extractDomain('not-a-url')).toBe('');
  });

  it('handles URLs without www', () => {
    expect(extractDomain('https://news.ycombinator.com/item?id=123')).toBe(
      'news.ycombinator.com'
    );
  });
});