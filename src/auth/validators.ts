export type NameError = 'signup.nameRequired';
export type MobileError = 'signup.mobileRequired' | 'signup.mobileInvalid';

export function validateName(value: string): NameError | null {
  return value.trim().length === 0 ? 'signup.nameRequired' : null;
}

/** South African mobile number: 0 or +27 / 27 followed by 6, 7 or 8 and eight more digits. Spaces are ignored. */
export function validateMobile(value: string): MobileError | null {
  const number = value.replace(/[\s-]/g, '');
  if (number.length === 0) return 'signup.mobileRequired';
  return /^(?:0|\+?27)[6-8]\d{8}$/.test(number) ? null : 'signup.mobileInvalid';
}
