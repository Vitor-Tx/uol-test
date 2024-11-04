import './App.css'
import ClientList from './components/ClientList/ClientList.tsx'
import EditOrAddClient from './components/EditOrAddClient/EditOrAddClient.tsx';
import Header from './components/Header/Header.tsx'
import { Container } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import styled from 'styled-components';
import { useAppContext } from './Context/Context.ts'

const PanelTitle = styled.div`
  text-align: start;
  margin-top: 140px;
  margin-bottom: 40px;
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  p {
    font-size: 2rem;
    margin-left: 20px;
    margin-bottom: 0;
  }

  border-bottom: 2px solid #eee5e5a1;
`;

function App() {
  const { mode, editingClientId } = useAppContext();

  return (
    <>
      <Header></Header>

      <Container>
        <PanelTitle>
          <Person size={40}></Person>
          <p>Painel de clientes</p>
        </PanelTitle>
        {mode === 'view' && (
          <ClientList />
        )}

        {mode === 'edit' && editingClientId !== -1 && (
          <EditOrAddClient
            edit
          />
        )}

        {mode === 'add' && (
          <EditOrAddClient
            edit={false}
          />
        )}
      </Container>
    </>

  )
}

export default App
