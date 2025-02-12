import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BotaoContornado from './Componentes/BotaoContornado';

export default function App() {

  const handlePress = () => {
    alert('Botão pressionado!');
  };

  return (
    <View style={styles.container}>
      <BotaoContornado title="Pressione-me" onPress={handlePress} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
