import { getTotalShownRows } from "./paginator.utils";

describe('Paginator.utils', () => {
  describe('getTotalShownRows', () => {
    it('should generate the expected showing text', () => {
      expect(getTotalShownRows(18, 10, 1)).toMatch('10 of 18');
    });

    it('should use the same count if the selectedPerPage * page is greater than count', () => {
      expect(getTotalShownRows(18, 10, 2)).toMatch('18 of 18');
    });

    it('should use the same count if the selectedPerPage is greater than the count', () => {
      expect(getTotalShownRows(18, 30, 1)).toMatch('18 of 18');
    });
  })
})