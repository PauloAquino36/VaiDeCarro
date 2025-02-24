import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoContornado from '../Componentes/BotaoContornado';
import { useAuth } from '../AuthContext'; // Importe o AuthContext

const { width } = Dimensions.get('window');

const Sair = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth(); // Desestruture a função de logout do contexto

  const sair = () => {
    logout(); // Atualiza o estado de autenticação
    console.log('Saindo...');
    navigation.navigate('Login'); // Navega para a tela de login
  };
  
  const Nsair = () => {
    console.log('Não saiu...');
    navigation.goBack(); // Volta para a tela anterior
  };

  return (
    <View style={styles.container}>      
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} /> 
      <View style={styles.container2}>
        <Text style={styles.texto}>Deseja realmente sair?</Text>
        <BotaoContornado title="Sim" onPress={sair} />
        <BotaoContornado title="Não" onPress={Nsair} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#191919',
  },
  container2: {
    marginTop: width * 0.15,
    padding: width * 0.05,
    borderWidth: 1,
    borderColor: '#38B6FF',
    width: width * 0.5,
    height: width * 0.5,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: width * 0.0,
    resizeMode: 'contain',
  },
  texto: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default Sair;
