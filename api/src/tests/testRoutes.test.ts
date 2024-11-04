import { prisma } from '../lib/prisma.js';
import app from '../app.js';

function logTestResult(description: string, condition: boolean) {
  if (condition) {
    console.log(`✅ ${description} - Passou`);
  } else {
    console.log(`❌ ${description} - Falhou`);
    process.exit(1);
  }
}

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
    logTestResult('Criação de cliente', createResponse.statusCode === 201);

    const createdClient = JSON.parse(createResponse.body);
    const clientId = createdClient.clientId;
    logTestResult('Cliente criado com ID válido', clientId !== undefined);

    const getResponse = await app.inject({
      method: 'GET',
      url: `/clients/${clientId}`,
    });
    logTestResult('Listagem de cliente pelo ID', getResponse.statusCode === 200);

    const retrievedClient = JSON.parse(getResponse.body);
    logTestResult('ID do cliente listado corresponde ao criado', retrievedClient.id === parseInt(clientId));

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/clients',
      payload: clientData,
    });
    logTestResult('Criação de cliente duplicado', duplicateResponse.statusCode === 400);

    const duplicateBody = JSON.parse(duplicateResponse.body);
    logTestResult('Mensagem de erro para conflito de email duplicado', duplicateBody.message.includes('Outro cliente com o mesmo email já existe'));

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
    logTestResult('Atualização de cliente', updateResponse.statusCode === 200);

    const updatedClient = JSON.parse(updateResponse.body);
    logTestResult('ID do cliente atualizado corresponde ao original', updatedClient.clientId === clientId);

    const getAllResponse = await app.inject({
      method: 'GET',
      url: '/clients?pageIndex=0',
    });
    logTestResult('Listagem de todos os clientes', getAllResponse.statusCode === 200);

    const allClients = JSON.parse(getAllResponse.body);
    logTestResult('Lista de clientes retornada é uma array', Array.isArray(allClients.clients));
    logTestResult('Contagem total de clientes é pelo menos 1', allClients.total >= 1);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/clients/${clientId}`,
    });
    logTestResult('Exclusão de cliente', deleteResponse.statusCode === 200);

    const deleteBody = JSON.parse(deleteResponse.body);
    logTestResult('Mensagem de sucesso para exclusão de cliente', deleteBody.message === 'Cliente excluído com sucesso.');

    const getDeletedResponse = await app.inject({
      method: 'GET',
      url: `/clients/${clientId}`,
    });
    logTestResult('Listagem de cliente excluído', getDeletedResponse.statusCode === 400);

    const deletedClientBody = JSON.parse(getDeletedResponse.body);
    logTestResult('Mensagem de erro para cliente não encontrado', deletedClientBody.message === 'Cliente não encontrado.');

    console.log('🎉 Todos os testes passaram com sucesso!');
  } catch (error) {
    console.error('Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
    await app.close();
  }
}

runTests();