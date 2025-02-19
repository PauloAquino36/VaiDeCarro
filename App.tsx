import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavBar from './Componentes/NavBar';
import Login from './Telas/Login';
import Inicio from './Telas/Inicio';
import Carros from './Telas/Carros';
import Sair from './Telas/Sair';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={Inicio} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Carros" component={Carros} />
          <Stack.Screen name="Sair" component={Sair} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
