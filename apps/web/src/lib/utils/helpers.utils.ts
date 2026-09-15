import type { PaginationType } from './types.utils';

/**
 * Make the first letter of a string an uppercase
 * and any other thing else lowercase
 *
 * @param value
 * @returns a formatted string
 */
export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return '';

  return (
    value.substring(0, 1).toUpperCase() + '' + value.substring(1).toLowerCase()
  );
}

/**
 * Formats digits such that they are human readable
 * @example
 * // returns 12,000
 * makeDigitHumanReadable(12000);
 * @param digit
 * @returns
 */
export function makeDigitHumanReadable(digit: number): string {
  if (!digit) return '';

  let formattedDigit = '';
  let decimals = '00';
  let withoutDecimals: string;
  const stringDigit = digit.toString();

  if (stringDigit.includes('.')) {
    [withoutDecimals, decimals] = stringDigit.split('.');
    if (decimals.length < 2) {
      decimals += '0';
    }
  } else {
    withoutDecimals = stringDigit;
  }

  for (let i = withoutDecimals.length; i >= 0; i -= 3) {
    const value = withoutDecimals.substring(i - 3, i);
    if (!value) break;
    formattedDigit = `${value},${formattedDigit}`;
  }

  if (formattedDigit.lastIndexOf(',') === formattedDigit.length - 1) {
    formattedDigit = formattedDigit.substring(0, formattedDigit.length - 1);
  }

  if (stringDigit.includes('.')) return `${formattedDigit}.${decimals}`;

  return formattedDigit;
}

/**
 * Extracts pagination params in the query params and returns the pagination
 * object containing the fields `q`, `page`, `perPage`
 *
 * @param searchParams
 * @returns a pagination object
 */
export function extractPaginationFromQueryParams(
  searchParams: URLSearchParams,
): PaginationType {
  const pagination: PaginationType = { page: 0, perPage: 0, q: '' };

  if (searchParams.has('perPage'))
    pagination.perPage = Number(searchParams.get('perPage'));

  if (searchParams.has('page'))
    pagination.page = Number(searchParams.get('page'));

  if (searchParams.has('q')) pagination.q = searchParams.get('q') ?? '';

  return pagination;
}

/**
 * Constructs a reusable pagination query params string
 * using the pagination object extracted
 *
 * @param pagination
 * @returns a pagination query params string
 */
export function constructPaginationString(pagination: PaginationType): string {
  let result = '';

  if (pagination.page) result = 'page=' + pagination.page;

  if (pagination.perPage)
    result = result
      ? `${result}&perPage=${pagination.perPage}`
      : `perPage=${pagination.perPage}`;

  if (pagination.q)
    result = result ? `${result}&q=${pagination.q}` : `q=${pagination.q}`;

  return result;
}
