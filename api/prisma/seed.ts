import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import generateCPF from './../utils/generateCPF'
import generatePhoneNumber from './../utils/generatePhoneNumber'



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