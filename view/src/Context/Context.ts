import { createContext, useContext } from "react";
import Client from "../interfaces/Client";

interface AppContextType {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  mode: "view" | "edit" | "add";
  editingClientId: number;
  setMode: (mode: "view" | "edit" | "add") => void;
  setEditingClientId: (id: number) => void;
  addClient: (client: Client) => void;
  editClient: (id: number, updatedClient: Client) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a ClientProvider");
  }
  return context;
};
