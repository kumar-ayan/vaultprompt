import { describe, expect, it } from 'vitest';
import { normalizeAppPath } from './url';

describe('normalizeAppPath', () => {
  it('returns the root path when next is missing', () => {
    expect(normalizeAppPath(null)).toBe('/');
  });

  it('keeps valid in-app paths', () => {
    expect(normalizeAppPath('/demo')).toBe('/demo');
  });

  it('rejects protocol-relative redirects', () => {
    expect(normalizeAppPath('//evil.example')).toBe('/');
  });

  it('rejects malformed slash redirects', () => {
    expect(normalizeAppPath('/\\evil')).toBe('/');
  });
});
