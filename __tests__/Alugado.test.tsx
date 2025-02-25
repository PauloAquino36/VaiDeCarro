import React from "react";
import { render } from "@testing-library/react-native";
import Alugado from '../Componentes/Alugado';

test("Deve renderizar a tela de Alugado corretamente", () => {
  const { getByText } = render(<Alugado />);
  expect(getByText("Seus Aluguéis")).toBeTruthy();
});
