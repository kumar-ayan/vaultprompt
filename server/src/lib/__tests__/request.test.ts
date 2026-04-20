import { describe, expect, it } from 'vitest';
import {
  getAuthenticatedUserId,
  parsePagination,
  parsePositiveInteger,
  parseUuidParam,
} from '../request';

describe('request helpers', () => {
  it('parses pagination with defaults', () => {
    expect(parsePagination({})).toEqual({ limit: 20, offset: 0 });
  });

  it('parses pagination from query values', () => {
    expect(parsePagination({ limit: '50', offset: '10' })).toEqual({ limit: 50, offset: 10 });
  });

  it('rejects invalid pagination', () => {
    expect(() => parsePagination({ limit: '1000', offset: '-1' })).toThrow('Invalid pagination parameters.');
  });

  it('parses a UUID param', () => {
    expect(parseUuidParam('123e4567-e89b-12d3-a456-426614174000')).toBe(
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  it('rejects an invalid UUID param', () => {
    expect(() => parseUuidParam('not-a-uuid')).toThrow('Invalid id. Expected a UUID.');
  });

  it('parses positive integers', () => {
    expect(parsePositiveInteger('2', 'v1')).toBe(2);
  });

  it('rejects invalid positive integers', () => {
    expect(() => parsePositiveInteger('0', 'v1')).toThrow('Invalid v1. Expected a positive integer.');
  });

  it('returns the authenticated user id', () => {
    expect(getAuthenticatedUserId({ user: { id: 'user-123' } } as never)).toBe('user-123');
  });

  it('rejects missing authenticated user context', () => {
    expect(() => getAuthenticatedUserId({} as never)).toThrow('Missing authenticated user context.');
  });
});
