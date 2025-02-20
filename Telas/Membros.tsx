import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import MembrosCrud from '../Componentes/MembrosCrud';

const { width } = Dimensions.get('window');

const Membros = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [novoMembro, setNovoMembro] = useState({
    cargo: '',
    nome: '',
    email: '',
    senha: '',
    numero: '',
    cpf: '',
  });

interface Membro {
    cargo: string;
    nome: string;
    email: string;
    senha: string;
    numero: string;
    cpf: string;
}

const handleInputChange = (key: keyof Membro, value: string) => {
    setNovoMembro({ ...novoMembro, [key]: value });
};

  const adicionarMembro = () => {
    console.log('Novo membro adicionado:', novoMembro);
    setModalVisible(false);
  };

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

      <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={width * 0.05} color="#38B6FF" style={styles.icon} />
        <Text style={styles.textoBtn}>Adicionar Membro</Text>
      </TouchableOpacity>

        <MembrosCrud />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Membro</Text>

            <TextInput style={styles.input} placeholder="Cargo" onChangeText={(value) => handleInputChange('cargo', value)} />
            <TextInput style={styles.input} placeholder="Nome" onChangeText={(value) => handleInputChange('nome', value)} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={(value) => handleInputChange('email', value)} />
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={(value) => handleInputChange('senha', value)} />
            <TextInput style={styles.input} placeholder="Número" keyboardType="phone-pad" onChangeText={(value) => handleInputChange('numero', value)} />
            <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" onChangeText={(value) => handleInputChange('cpf', value)} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.textoBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={adicionarMembro}>
                <Text style={styles.textoBtn}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#38B6FF',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Membros;
