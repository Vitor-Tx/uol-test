import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

function generateCPF(): string {
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

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 90 + 10);
  const prefix = `9${Math.floor(Math.random() * 90000 + 10000).toString().slice(1)}`; // Ensures the first digit is always 9
  const suffix = Math.floor(Math.random() * 9000 + 1000);

  return `(${areaCode}) ${prefix}-${suffix}`;
}


async function seed() {

  await prisma.client.deleteMany();

  const clientsToInsert: Prisma.ClientUncheckedCreateInput[] = []

  const statuses = ['Ativo', 'Inativo', 'Aguardando ativação', 'Desativado'];

  for (let i = 0; i <= 20; i++) {
    clientsToInsert.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: generateCPF(),
      phone: generatePhoneNumber(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }),
    })
  }

  await Promise.all(clientsToInsert.map(data => {
    return prisma.client.create({
      data,
    })
  }))
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})