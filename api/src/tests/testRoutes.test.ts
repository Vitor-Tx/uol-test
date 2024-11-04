process.env.LOG_LEVEL = 'error';

import { prisma } from '../lib/prisma.js';
import app from "./../app.js";
import { FastifyInstance } from 'fastify';

let server: FastifyInstance;

async function setup() {
  server = app;
  await prisma.client.deleteMany();
}

async function cleanup() {
  await prisma.$disconnect();
  await server.close();
}

async function runTests() {
  await setup();

  let clientId: number;

  const createClientResponse = await server.inject({
    method: 'POST',
    url: '/clients',
    payload: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '123.456.789-09',
      phone: '(11) 91234-5678',
      status: 'Ativo',
    },
  });
  console.log('Create Client:', createClientResponse.statusCode === 201 ? 'Passed' : 'Failed');

  const createdClient = JSON.parse(createClientResponse.payload);
  clientId = createdClient.clientId;

  const getClientResponse = await server.inject({
    method: 'GET',
    url: `/clients/${clientId}`,
  });
  console.log('Get Client by ID:', getClientResponse.statusCode === 200 ? 'Passed' : 'Failed');

  const getAllClientsResponse = await server.inject({
    method: 'GET',
    url: '/clients',
  });
  console.log('Get All Clients:', getAllClientsResponse.statusCode === 200 ? 'Passed' : 'Failed');

  const updateClientResponse = await server.inject({
    method: 'PUT',
    url: `/clients/${clientId}`,
    payload: {
      name: 'John Doe Updated',
      email: 'johnupdated@example.com',
      cpf: '987.654.321-00',
      phone: '(11) 97654-3210',
      status: 'Inativo',
    },
  });
  console.log('Update Client:', updateClientResponse.statusCode === 200 ? 'Passed' : 'Failed');

  const deleteClientResponse = await server.inject({
    method: 'DELETE',
    url: `/clients/${clientId}`,
  });
  console.log('Delete Client:', deleteClientResponse.statusCode === 200 ? 'Passed' : 'Failed');

  await cleanup();
}

runTests();
