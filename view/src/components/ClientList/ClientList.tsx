import { useEffect } from 'react';
import styled from 'styled-components';
import ClientCard from './../ClientCard/ClientCard.tsx';
import { Button } from 'react-bootstrap';
import { useAppContext } from '../../Context/Context.ts';

const ListContainer = styled.div`
  text-align: start;
`;

const ListContent = styled.div`
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.5rem;
    text-align: center;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
  };
`;

const HeaderText = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  text-align: start;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 1rem;
`;

const NewClientButton = styled(Button)`
  color: #fff;
  background-color: #fd7e14;
  border-color: #fd7e14;

  &:hover {
    color: #000;
    border-color: #ffc107;
    background-color: #ffc107;
  }
`;

function ClientList() {
  const { setMode, setEditingClientId, clients, setClients } = useAppContext();

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch('http://localhost:3333/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }

    fetchClients();
  }, [setClients]);

  function onEdit(id: number) {
    setMode('edit');
    setEditingClientId(id);
    console.log('Editing! id: ', id);
  }

  function onAdd() {
    setMode('add');
    console.log('Adding new client!');
  }

  return (
    <ListContainer>
      <ListHeader>
        <HeaderText>
          <Title> Listagem de usuários</Title>
          <Subtitle>Escolha um cliente para visualizar os detalhes</Subtitle>
        </HeaderText>
        <NewClientButton variant="outline-warning" onClick={onAdd}>
          Novo cliente
        </NewClientButton>
      </ListHeader>
      <ListContent>
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} onEdit={onEdit} />
        ))}
      </ListContent>
      <p>Exibindo {clients.length} clientes</p>
    </ListContainer>
  );
}

export default ClientList;
