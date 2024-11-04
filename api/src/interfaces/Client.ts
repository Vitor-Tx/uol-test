export default interface Client {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: 'Ativo' | 'Inativo' | 'Aguardando ativação' | 'Desativado';
}