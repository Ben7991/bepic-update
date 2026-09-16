import {
  constructPaginationString,
  extractPaginationFromQueryParams,
  makeDigitHumanReadable,
  makeFirstLetterUppercase,
} from './helpers.utils';

const constructSearchParams = (
  q?: string,
  perPage?: number,
  page?: number,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  if (q) searchParams.append('q', q);
  if (perPage) searchParams.append('perPage', perPage.toString());
  if (page) searchParams.append('page', page.toString());

  return searchParams;
};

describe('helpers.utils.ts', () => {
  describe('makeFirstLetterUppercase', () => {
    it('should format the first letter in a string to uppercase', () => {
      expect(makeFirstLetterUppercase('testing')).toMatch('Testing');
    });

    it('should reserve all spaces if any', () => {
      expect(makeFirstLetterUppercase('james smith')).toMatch('James smith');
    });

    it('should return empty string if the value is undefined', () => {
      expect(makeFirstLetterUppercase()).toMatch('');
    });
  });

  describe('makeDigitHumanReadable', () => {
    it('should make digits more human readable', () => {
      expect(makeDigitHumanReadable(15000)).toMatch('15,000');
      expect(makeDigitHumanReadable(15000000)).toMatch('15,000,000');
    });

    it('should maintain all decimal places if any', () => {
      expect(makeDigitHumanReadable(15000.5)).toMatch('15,000.50');
      expect(makeDigitHumanReadable(15000.05)).toMatch('15,000.05');
    });

    it('should return an empty string if 0 is provided', () => {
      expect(makeDigitHumanReadable(0)).toMatch('');
    });
  });

  describe('extractPaginationFromQueryParams', () => {
    it('should generate the expected search params if all the values are provided', () => {
      const searchParams = constructSearchParams('trends', 10, 2);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(pagination).toEqual({
        q: 'trends',
        perPage: 10,
        page: 2,
      });
    });

    it('should generate a pagination containing only fields based on the provided params', () => {
      expect(
        extractPaginationFromQueryParams(constructSearchParams('trends')),
      ).toEqual({ q: 'trends', perPage: 0, page: 0 });
      expect(
        extractPaginationFromQueryParams(constructSearchParams('trends', 10)),
      ).toEqual({ q: 'trends', perPage: 10, page: 0 });
      expect(
        extractPaginationFromQueryParams(
          constructSearchParams('trends', undefined, 2),
        ),
      ).toEqual({ q: 'trends', perPage: 0, page: 2 });
      expect(
        extractPaginationFromQueryParams(
          constructSearchParams(undefined, 10, 2),
        ),
      ).toEqual({ q: '', perPage: 10, page: 2 });
    });
  });

  describe('constructPaginationString', () => {
    it('should generate the query params string with all expected fields', () => {
      const searchParams = constructSearchParams('trends', 10, 2);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch(
        'page=2&perPage=10&q=trends',
      );
    });

    it('should generate the query params containing only perPage and query', () => {
      const searchParams = constructSearchParams('trends', 10);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch(
        'perPage=10&q=trends',
      );
    });

    it('should generate the query params containing only perPage and page', () => {
      const searchParams = constructSearchParams(undefined, 10, 2);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch(
        'page=2&perPage=10',
      );
    });

    it('should generate the query params containing only page and query', () => {
      const searchParams = constructSearchParams('trends', undefined, 2);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch('page=2&q=trends');
    });

    it('should generate the query params containing only query', () => {
      const searchParams = constructSearchParams('trends');
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch('q=trends');
    });

    it('should generate the query params containing only perPage', () => {
      const searchParams = constructSearchParams(undefined, 10);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch('perPage=10');
    });

    it('should generate the query params containing only page', () => {
      const searchParams = constructSearchParams(undefined, undefined, 10);
      const pagination = extractPaginationFromQueryParams(searchParams);
      expect(constructPaginationString(pagination)).toMatch('page=10');
    });
  });
});
