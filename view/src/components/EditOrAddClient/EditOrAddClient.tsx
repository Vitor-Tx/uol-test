import styled from "styled-components";
import Client from "../../interfaces/Client";
import { useState } from 'react';
import { useAppContext } from './../../Context/Context';
import { validateCPF } from "../../utils/validateCPF";
import { validatePhone } from "../../utils/validatePhone";
import { maskCPF, maskPhone } from "../../utils/masks";


const Error = styled.p`
  color: red;
  font-weight: bold;
`;

const EditContainer = styled.div`
  text-align: start;
`;

const EditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
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

const FormContainer = styled.div`
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const FormButton = styled.button`
  padding: 0.5rem 1rem;
  width: 140px;
  background-color: #fd7e14;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface AddClientProps {
  edit: false;
}

interface EditClientProps {
  edit: true;
}

type EditOrAddClientProps = AddClientProps | EditClientProps;

function EditOrAddClient(props: EditOrAddClientProps) {
  const { setMode, addClient, editClient, editingClientId, setEditingClientId, clients } = useAppContext();
  const { edit } = props;

  const client = clients.find((client: Client) => client.id === editingClientId) as Client;

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Aguardando ativação', label: 'Aguardando ativação' },
    { value: 'Desativado', label: 'Desativado' },
  ] as const;

  const [name, setName] = useState(client?.name || '');
  const [email, setEmail] = useState(client?.email || '');
  const [cpf, setCpf] = useState(client?.cpf || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [status, setStatus] = useState(client?.status || 'Ativo');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (name.length < 4 || name.length > 60) {
      newErrors.name = "O nome precisa ter entre 4 e 60 caracteres.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Email inválido.";
    }

    const cleanedCpf = cpf.replace(/\D/g, '');
    if (cleanedCpf.length !== 11 || !validateCPF(cleanedCpf)) {
      newErrors.cpf = "CPF deve ter exatamente 11 dígitos e ser válido.";
    }


    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11 || !validatePhone(cleanedPhone)) {
      newErrors.phone = "Número de telefone deve ter entre 10 e 11 dígitos e ser válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave() {
    if (!validateForm()) return;
    const updatedClient: Client = {
      id: client?.id ?? -1,
      name,
      email,
      cpf,
      phone,
      status,
    };

    const newErrors: { [key: string]: string } = {};

    try {

      let response;

      if (edit) {
        response = await fetch(`http://localhost:3333/clients/${editingClientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClient),
        });

        if (response.ok) {
          const updatedData = await response.json();
          editClient(editingClientId, updatedData);
        }
      } else {
        const { name, email, cpf, phone, status } = updatedClient;
        response = await fetch('http://localhost:3333/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, email: email, cpf: cpf, phone: phone, status: status }),
        });

        if (response.ok) {
          const newClient = await response.json();
          addClient(newClient);
        }
      }

      if (!response.ok) {
        console.log("erro?");
        const errorData = await response.json();
        switch (response.status) {
          case 400:
            newErrors.request = errorData.message || "Erro na requisição! Dados inválidos.";
            break;
          case 404:
            newErrors.request = "Cliente não encontrado.";
            break;
          case 500:
            newErrors.request = "Erro no servidor. Por favor, tente novamente mais tarde.";
            break;
          default:
            newErrors.request = "Ocorreu um erro desconhecido.";
            break;
        }
        setErrors(newErrors);
        return;
      }
      console.log("não erro?");
      setMode('view');
      setEditingClientId(-1);
    } catch (error) {
      console.error("Network or unexpected error:", error);
      newErrors.request = "Erro de rede ou inesperado. Verifique sua conexão e tente novamente.";
      setErrors(newErrors);
    }
  }

  function handleBack() {
    setMode("view");
    setEditingClientId(-1);
  }

  return (
    <EditContainer>
      <EditHeader>
        <HeaderText>
          <Title>{edit ? "Editar " : "Novo "}Usuário</Title>
          <Subtitle>{edit ? "Edite os campos do usuário:" : "Informe os campos a Seguir para criar um novo usuário:"}</Subtitle>
        </HeaderText>
      </EditHeader>
      <FormContainer>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <Error>{errors.name}</Error>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <Error>{errors.email}</Error>}

        <Input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(maskCPF(e.target.value.replace(/\D/g, '').slice(0, 11)))}
        />
        {errors.cpf && <Error>{errors.cpf}</Error>}

        <Input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value.replace(/\D/g, '').slice(0, 11)))}
        />
        <Error>{errors.phone && <p>{errors.phone}</p>}</Error>
        <Select value={status} onChange={(e) => setStatus(e.target.value as Client['status'])}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <ButtonWrapper>
          <FormButton onClick={handleSave}>{edit ? 'Salvar' : 'Criar'}</FormButton>
          <FormButton onClick={handleBack}>Voltar</FormButton>
        </ButtonWrapper>

        {errors.request && <Error>{errors.request}</Error>}
      </FormContainer>
    </EditContainer>
  );
}

export default EditOrAddClient;
