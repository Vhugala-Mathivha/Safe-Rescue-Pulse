const ID_LENGTH = 13;

/** True when yy/mm/dd is a real calendar date in either the 1900s or the 2000s (an ID doesn't say which). */
function isValidBirthDate(yy: number, mm: number, dd: number) {
  return [1900, 2000].some((century) => {
    const date = new Date(century + yy, mm - 1, dd);
    return date.getFullYear() === century + yy && date.getMonth() === mm - 1 && date.getDate() === dd;
  });
}

/** Luhn check: the last digit of a South African ID number is a checksum of the first twelve. */
function passesLuhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export type IdNumberError = 'signup.idRequired' | 'signup.idInvalid';

/**
 * Checks a South African ID number: 13 digits (YYMMDD SSSS C A Z), a real birth date,
 * a citizenship digit of 0 or 1, and a valid checksum. Returns a translation key for the error, or null.
 */
export function validateIdNumber(value: string): IdNumberError | null {
  const id = value.trim();
  if (id.length === 0) return 'signup.idRequired';
  if (!/^\d+$/.test(id) || id.length !== ID_LENGTH) return 'signup.idInvalid';

  const birthDateOk = isValidBirthDate(Number(id.slice(0, 2)), Number(id.slice(2, 4)), Number(id.slice(4, 6)));
  const citizenshipOk = id[10] === '0' || id[10] === '1';
  return birthDateOk && citizenshipOk && passesLuhn(id) ? null : 'signup.idInvalid';
}
