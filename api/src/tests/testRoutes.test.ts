import { prisma } from '../lib/prisma.js';
import app from '../app.js';

async function runTests() {
  try {
    await app.ready();

    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      cpf: '123.456.789-09',
      phone: '(11) 91234-5678',
      status: 'Ativo',
    };

    const createResponse = await app.inject({
      method: 'POST',
      url: '/clients',
      payload: clientData,
    });

    console.assert(createResponse.statusCode === 201, 'Expected status code 201 for client creation');
    const createdClient = JSON.parse(createResponse.body);
    const clientId = createdClient.clientId;
    console.assert(clientId !== undefined, 'Expected created client to have an ID');

    const getResponse = await app.inject({
      method: 'GET',
      url: `/clients/${clientId}`,
    });

    console.assert(getResponse.statusCode === 200, 'Expected status code 200 when retrieving client by ID');
    const retrievedClient = JSON.parse(getResponse.body);
    console.assert(retrievedClient.id === parseInt(clientId), 'Expected retrieved client ID to match created client ID');

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/clients',
      payload: clientData,
    });

    console.assert(duplicateResponse.statusCode === 400, 'Expected status code 400 for duplicate client creation');
    const duplicateBody = JSON.parse(duplicateResponse.body);
    console.assert(duplicateBody.message.includes('Outro cliente com o mesmo email já existe'), 'Expected duplicate email conflict error');

    const updateData = {
      name: 'Updated Client Name',
      email: 'updated@example.com',
      cpf: '987.654.321-00',
      phone: '(11) 92345-6789',
      status: 'Inativo',
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/clients/${clientId}`,
      payload: updateData,
    });

    console.assert(updateResponse.statusCode === 200, 'Expected status code 200 for client update');
    const updatedClient = JSON.parse(updateResponse.body);
    console.assert(updatedClient.clientId === clientId, 'Expected updated client ID to match original client ID');

    const getAllResponse = await app.inject({
      method: 'GET',
      url: '/clients?pageIndex=0',
    });

    console.assert(getAllResponse.statusCode === 200, 'Expected status code 200 when retrieving all clients');
    const allClients = JSON.parse(getAllResponse.body);
    console.assert(Array.isArray(allClients.clients), 'Expected clients property to be an array');
    console.assert(allClients.total >= 1, 'Expected at least one client in total count');

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/clients/${clientId}`,
    });

    console.assert(deleteResponse.statusCode === 200, 'Expected status code 200 for client deletion');
    const deleteBody = JSON.parse(deleteResponse.body);
    console.assert(deleteBody.message === 'Cliente excluído com sucesso.', 'Expected success message for client deletion');

    const getDeletedResponse = await app.inject({
      method: 'GET',
      url: `/clients/${clientId}`,
    });

    console.assert(getDeletedResponse.statusCode === 400, 'Expected status code 400 when retrieving deleted client');
    const deletedClientBody = JSON.parse(getDeletedResponse.body);
    console.assert(deletedClientBody.message === 'Cliente não encontrado.', 'Expected not found message for deleted client');

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
    await app.close();
  }
}

runTests();
