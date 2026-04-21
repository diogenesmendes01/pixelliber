/**
 * Validates a Brazilian CNPJ number using the official check digit algorithm
 */
export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");

  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  // First check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(digits[i]) * weights1[i];
  }
  const remainder1 = sum1 % 11;
  const check1 = remainder1 < 2 ? 0 : 11 - remainder1;
  if (parseInt(digits[12]) !== check1) return false;

  // Second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(digits[i]) * weights2[i];
  }
  const remainder2 = sum2 % 11;
  const check2 = remainder2 < 2 ? 0 : 11 - remainder2;

  return parseInt(digits[13]) === check2;
}

export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}