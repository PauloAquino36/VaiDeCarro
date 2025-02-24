import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Telas/Login';
import Inicio from './Telas/Inicio';
import Carros from './Telas/Carros';
import Sair from './Telas/Sair';
import Membros from './Telas/Membros';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Inicio" component={Inicio} />
          <Stack.Screen name="Carros" component={Carros} />
          <Stack.Screen name="Sair" component={Sair} />
          <Stack.Screen name="Membros" component={Membros} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
