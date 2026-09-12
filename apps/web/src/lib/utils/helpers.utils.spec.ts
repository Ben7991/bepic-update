import { makeDigitHumanReadable, makeFirstLetterUppercase } from "./helpers.utils";

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

  describe('makeDigitHumanReadable', () => {
    it('should make digits more human readable', () => {
      expect(makeDigitHumanReadable(15000)).toMatch('15,000');
      expect(makeDigitHumanReadable(15000000)).toMatch('15,000,000');
    });

    it('should maintain all decimal places if any', () => {
      expect(makeDigitHumanReadable(15000.50)).toMatch('15,000.50');
      expect(makeDigitHumanReadable(15000.05)).toMatch('15,000.05');
    });

    it('should return an empty string if 0 is provided', () => {
      expect(makeDigitHumanReadable(0)).toMatch('');
    })
  })
});