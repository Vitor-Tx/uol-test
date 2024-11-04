export default function generateCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 9);

  const cpfNumbers = Array.from({ length: 9 }, randomDigits);

  let firstVerifier = cpfNumbers.reduce((sum, num, index) => sum + num * (10 - index), 0) % 11;
  firstVerifier = firstVerifier < 2 ? 0 : 11 - firstVerifier;
  cpfNumbers.push(firstVerifier);

  let secondVerifier = cpfNumbers.reduce((sum, num, index) => sum + num * (11 - index), 0) % 11;
  secondVerifier = secondVerifier < 2 ? 0 : 11 - secondVerifier;
  cpfNumbers.push(secondVerifier);

  return `${cpfNumbers.slice(0, 3).join('')}.${cpfNumbers.slice(3, 6).join('')}.${cpfNumbers.slice(6, 9).join('')}-${cpfNumbers.slice(9).join('')}`;
}