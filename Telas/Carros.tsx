import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import CarrosCrud from '../Componentes/CarrosCrud'; // Supondo que você tenha um componente CarrosCrud

const { width } = Dimensions.get('window');

interface Carro {
  nome: string;
  marca: string;
  ano: string;
  placa: string;
  foto?: string;
  preco_por_hora?: string;
  consumo_por_litro?: string;
}

const Carros = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [novoCarro, setNovoCarro] = useState<Carro>({
    nome: '',
    marca: '',
    ano: '',
    placa: '',
  });

  const handleInputChange = (key: keyof Carro, value: string) => {
    setNovoCarro((prevCarro) => ({
      ...prevCarro,
      [key]: value,
    }));
  };

  const adicionarCarro = async () => {
    if (!novoCarro.nome || !novoCarro.placa) {
      Alert.alert('Erro', 'Preencha pelo menos Nome e Placa');
      return;
    }
  
    const novosCarros = [...carros, novoCarro];
  
    // Chame setCarros aqui para atualizar a lista no componente CarrosCrud
    setCarros(novosCarros);
  
    // Salvar carros no AsyncStorage
    try {
      await AsyncStorage.setItem('@carros', JSON.stringify(novosCarros));
    } catch (error) {
      console.error('Erro ao salvar carros no AsyncStorage:', error);
    }
  
    setNovoCarro({ nome: '', marca: '', ano: '', placa: '' });
    setModalVisible(false);
  };
  
  
  


  useEffect(() => {
    const carregarCarros = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@carros');
        if (jsonValue !== null) {
          setCarros(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error('Erro ao carregar carros:', error);
      }
    };

    carregarCarros();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#38B6FF" style={styles.icon} />
        <TextInput 
          style={styles.searchBar} 
          placeholder="Pesquisar..." 
          placeholderTextColor="#888"
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={20} color="#38B6FF" style={styles.icon} />
        <Text style={styles.textoBtn}>Adicionar Carro</Text>
      </TouchableOpacity>

      <CarrosCrud carros={carros} setCarros={setCarros} />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Carro</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#888"
              onChangeText={(value) => handleInputChange('nome', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ano"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('ano', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço por Hora"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('preco_por_hora', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Consumo por Litro"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('consumo_por_litro', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Placa"
              placeholderTextColor="#888"
              onChangeText={(value) => handleInputChange('placa', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="URL da Foto"
              placeholderTextColor="#888"
              onChangeText={(value) => handleInputChange('foto', value)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.textoBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={adicionarCarro}>
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

export default Carros;
