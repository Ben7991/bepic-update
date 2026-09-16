/**
 * Generate the showing rows text to be used in the Paginator component
 * @param count
 * @param selectedPerPage
 * @param page
 * @returns the showing text
 */
export function getTotalShownRows(
  count: number,
  selectedPerPage: number,
  page: number,
): string {
  if (selectedPerPage * page > count) return `${count} of ${count}`;

  if (count - selectedPerPage < 0) return `${count} of ${count}`;

  return `${selectedPerPage * page || 1} of ${count}`;
}
