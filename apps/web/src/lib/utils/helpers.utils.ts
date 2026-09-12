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