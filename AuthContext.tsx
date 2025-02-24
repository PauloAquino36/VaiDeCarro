import React, { createContext, useContext, useState } from 'react';

// Definindo o tipo de usuário
interface User {
  email: string;
  cargo: string;
}

const AuthContext = createContext<any>(null);

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null); // Estado do usuário

  const login = (user: User) => {
    setIsAuthenticated(true);
    setUsuario(user); // Armazena o usuário
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsuario(null); // Limpa o usuário ao sair
  };

  const getCargo = () => {
    return usuario ? usuario.cargo : null; // Retorna o cargo do usuário, ou null se não estiver autenticado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, usuario, login, logout, getCargo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
