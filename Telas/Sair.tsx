import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Navbar from '../Componentes/NavBar';
import { useNavigation } from '@react-navigation/native';
import BotaoContornado from '../Componentes/BotaoContornado';

const { width } = Dimensions.get('window');

const Sair = () => {
  const navigation = useNavigation();

  const sair = () => {
    console.log('Saindo...');
    navigation.navigate('Login');
  };

  const Nsair = () => {
    console.log('Não saiu...');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>      
    
            <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} /> 
            
            <View style={styles.container2}>
                <Text style={styles.texto}>Deseja realmente sair?</Text>
                <BotaoContornado title="Sim" onPress={sair} />
                <BotaoContornado title="Não" onPress={Nsair} />
            </View>

      <Navbar /> 
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8,
    backgroundColor: '#FEFFF5',
    borderRadius: 27,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: width * 0.02,
    fontSize: width * 0.04,
    color: '#000',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.65,
    marginTop: width * 0.025,
  },
  texto: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  textoBtn: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default Sair;
