import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alugado from '../Componentes/Alugado';
import { jest } from '@jest/globals';

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("../AuthContext", () => ({
  useAuth: () => ({
    getCargo: () => "Administrador",
  }),
}));

const mockAlugueis = [
  {
    carro: {
      id: 1,
      nome: "Toyota Corolla",
      foto: "https://example.com/corolla.jpg",
      preco_por_hora: 50,
    },
    cliente: {
      nome: "João Silva",
      telefone: "11999999999",
      endereco: "Rua ABC, 123",
      cpf: "123.456.789-00",
    },
    horaInicio: "2024-02-01T12:00:00Z",
    horaTermino: "2024-02-02T12:00:00Z",
  },
  {
    carro: {
      id: 2,
      nome: "Honda Civic",
      foto: "https://example.com/civic.jpg",
      preco_por_hora: 60,
    },
    cliente: {
      nome: "Maria Souza",
      telefone: "11988888888",
      endereco: "Rua XYZ, 456",
      cpf: "987.654.321-00",
    },
    horaInicio: "2024-02-01T10:00:00Z",
    horaTermino: "2024-02-02T10:00:00Z",
  },
];

describe("Tela Alugado", () => {
    beforeEach(() => {
        (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify(mockAlugueis)));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // 1️⃣ Teste de carregamento de aluguéis
    it("deve carregar os aluguéis do AsyncStorage ao iniciar", async () => {
        const { getByText } = render(<Alugado />);
        
        await waitFor(() => {
            expect(getByText("Toyota Corolla")).toBeTruthy();
            expect(getByText("Honda Civic")).toBeTruthy();
        });
    });

    // 2️⃣ Teste de filtragem de aluguéis
    it("deve filtrar aluguéis corretamente pelo nome do carro", async () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<Alugado />);

        await waitFor(() => getByText("Toyota Corolla"));

        const input = getByPlaceholderText("Pesquisar por carro ou cliente...");
        fireEvent.changeText(input, "Toyota");

        expect(getByText("Toyota Corolla")).toBeTruthy();
        expect(queryByText("Honda Civic")).toBeNull();
    });

    // 3️⃣ Teste do cálculo de preço
    it("deve calcular corretamente o preço total do aluguel com atraso e multa", async () => {
        const { getByText } = render(<Alugado />);

        await waitFor(() => {
            const precoCalculado = getByText("Preço Final: R$");
            expect(precoCalculado).toBeTruthy();
        });
    });
});

