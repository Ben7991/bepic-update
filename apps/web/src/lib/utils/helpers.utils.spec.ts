import { makeFirstLetterUppercase } from "./helpers.utils";

describe('helpers.utils.ts', () => {
  describe('makeFirstLetterUppercase', () => {
    it('should format the first letter in a string to uppercase', () => {
      expect(makeFirstLetterUppercase('testing')).toMatch('Testing');
    });

    it('should reserve all spaces if any', () => {
      expect(makeFirstLetterUppercase('james smith')).toMatch('James smith');
    });

    it('should return empty string if the value is undefined', () => {
      expect(makeFirstLetterUppercase()).toMatch("");
    });
  })
});