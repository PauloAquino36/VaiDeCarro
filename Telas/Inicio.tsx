import React from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import { useNavigation } from '@react-navigation/native';
import Alugado from '../Componentes/Alugado';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

const Inicio = () => {
  const navigation = useNavigation();
  const { getCargo } = useAuth();
  const cargoUsuario = getCargo();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />

      <View style={styles.searchContainer}>
        <Icon name="search" size={width * 0.05} color="#38B6FF" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar..."
          placeholderTextColor="#888"
        />
      </View>

      {(cargoUsuario === 'Desenvolvedor' || cargoUsuario === 'Administrador' || cargoUsuario === 'Proprietário da Frota') && (
        <>
          <TouchableOpacity style={styles.botao}>
            <Icon name="print" size={width * 0.05} color="#38B6FF" style={styles.icon} />
            <Text style={styles.textoBtn}>Relatorio</Text>
          </TouchableOpacity>
        </>
      )}



      <Alugado />

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
  textoBtn: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default Inicio;
