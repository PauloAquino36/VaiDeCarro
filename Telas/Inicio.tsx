import React from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import { useNavigation } from '@react-navigation/native';
import Alugado from '../Componentes/Alugado';
import { useAuth } from '../AuthContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const { width } = Dimensions.get('window');

const Inicio = () => {
  const navigation = useNavigation();
  const { getCargo } = useAuth();
  const cargoUsuario = getCargo();

  const gerarRelatorio = async () => {
    const options = {
      html: '<h1>Relatório de Aluguéis</h1><p>Dados do relatório aqui...</p>',
      fileName: 'Relatorio_Alugueis',
      directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
    };

    console.log('Gerando relatório...');

    try {
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Relatório Gerado', `O relatório foi salvo em: ${file.filePath}`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />



      {(cargoUsuario === 'Desenvolvedor' || cargoUsuario === 'Administrador' || cargoUsuario === 'Proprietário da Frota') && (
        <>
          <TouchableOpacity style={styles.botao} onPress={gerarRelatorio}>
            <Icon name="print" size={width * 0.05} color="#38B6FF" style={styles.icon} />
            <Text style={styles.textoBtn}>Relatório</Text>
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
  icon: {
    marginRight: 10,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.65,
    marginBottom: width * 0.025,
  },
  textoBtn: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default Inicio;
