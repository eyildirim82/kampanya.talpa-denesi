export const validateTckn = (tckn: string): boolean => {
  if (tckn.length !== 11) return false;
  if (!/^[1-9][0-9]*$/.test(tckn)) return false;

  const digits = tckn.split('').map(Number);
  const d10 = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
  const d11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;

  return digits[9] === d10 && digits[10] === d11;
};