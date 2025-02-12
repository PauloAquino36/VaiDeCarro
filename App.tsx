import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Telas/Login';
import BotaoContornado from './Componentes/BotaoContornado';

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
