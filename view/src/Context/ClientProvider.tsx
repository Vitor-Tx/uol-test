import React, { useState, ReactNode } from 'react';
import Client from '../interfaces/Client';
import { AppContext } from './Context.ts';


const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>('view');
  const [editingClientId, setEditingClientId] = useState<number>(-1);

  const addClient = (client: Client) => {
    setClients(prevClients => [...prevClients, client]);
  };

  const editClient = (id: number, updatedClient: Client) => {
    setClients(prevClients =>
      prevClients.map(client => (client.id === id ? updatedClient : client))
    );
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        mode,
        editingClientId,
        setMode,
        setEditingClientId,
        addClient,
        editClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ClientProvider;


