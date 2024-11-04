export default function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 90 + 10);
  const prefix = `9${Math.floor(Math.random() * 90000 + 10000).toString().slice(1)}`; // Ensures the first digit is always 9
  const suffix = Math.floor(Math.random() * 9000 + 1000);

  return `(${areaCode}) ${prefix}-${suffix}`;
}