import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import Client from '../../interfaces/Client';

interface ClientCardProps {
  client: Client;
  onEdit: (clientId: number) => void;
}

const CardContainer = styled.div`
  border: none;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 0.5fr;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
    width: 240px;
    margin: 0 auto;
  }
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  text-align: start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const ClientName = styled.div`
  font-weight: 600;
`;

const ClientDetails = styled.div`
  color: #6c757d;
`;

const StatusIndicator = styled.span<{ status: string }>`
  display: flex;
  align-items: center;
  color: ${({ status }) => {
    switch (status) {
      case 'Ativo':
        return '#28a745';
      case 'Inativo':
        return '#dc3545';
      case 'Aguardando ativação':
        return '#ffc107';
      case 'Desativado':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  }};

  &::before {
    content: '●';
    font-size: 2rem;
    margin-right: 0.25rem;
    margin-bottom: 0.45rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }

`;

const EditButton = styled(Button)`
  color: #fd7e14;
  border-color: #fd7e14;
  background-color: transparent;

  &:hover {
    color: #fff;
    background-color: #fd7e14;
    border-color: #fd7e14;
  }

  @media (max-width: 768px) {
    justify-self: center;
  }
`;

function ClientCard({ client, onEdit }: ClientCardProps) {
  return (
    <CardContainer>
      <ClientInfo>
        <ClientName>{client.name}</ClientName>
        <ClientDetails>{client.email}</ClientDetails>
      </ClientInfo>

      <ClientInfo>
        <ClientDetails>{client.cpf}</ClientDetails>
        <ClientDetails>{client.phone}</ClientDetails>
      </ClientInfo>

      <StatusIndicator status={client.status}>{client.status}</StatusIndicator>

      <EditButton variant="outline-warning" onClick={() => onEdit(client.id)}>
        Editar
      </EditButton>
    </CardContainer>
  );
};

export default ClientCard;
