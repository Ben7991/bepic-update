/**
 * Make the first letter of a string an uppercase 
 * and any other thing else lowercase
 * 
 * @param value 
 * @returns a formatted string
 */
export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return "";

  return (
    value.substring(0, 1).toUpperCase() + "" + value.substring(1).toLowerCase()
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

  let formattedDigit = "";
  let decimals = "00";
  let withoutDecimals: string;
  const stringDigit = digit.toString();

  if (stringDigit.includes(".")) {
    [withoutDecimals, decimals] = stringDigit.split(".");
    if (decimals.length < 2) {
      decimals += "0";
    }
  } else {
    withoutDecimals = stringDigit;
  }

  for (let i = withoutDecimals.length; i >= 0; i -= 3) {
    const value = withoutDecimals.substring(i - 3, i);
    if (!value) break;
    formattedDigit = `${value},${formattedDigit}`;
  }

  if (
    formattedDigit.lastIndexOf(",") ===
    formattedDigit.length - 1
  ) {
    formattedDigit = formattedDigit.substring(
      0,
      formattedDigit.length - 1,
    );
  }

  if (stringDigit.includes("."))
    return `${formattedDigit}.${decimals}`;

  return formattedDigit;
}