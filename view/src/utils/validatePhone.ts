export function validatePhone(phone: string): boolean {
  const cleanedPhone = phone.replace(/\D/g, '');
  const validPattern = /^(\d{2})?9\d{8}$/;
  return validPattern.test(cleanedPhone);
}
