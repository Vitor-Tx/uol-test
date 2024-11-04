export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base: number) =>
    Array.from(cpf.substring(0, base)).reduce((sum, num, idx) => sum + parseInt(num) * (base + 1 - idx), 0) * 10 % 11 % 10;

  return calculateDigit(9) === parseInt(cpf[9]) && calculateDigit(10) === parseInt(cpf[10]);
}
