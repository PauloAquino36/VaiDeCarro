import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import CarrosCrud from '../Componentes/CarrosCrud'; // Supondo que você tenha um componente CarrosCrud

const { width } = Dimensions.get('window');

interface Carro {
  nome: string;
  ano: string;
  placa: string;
  foto?: string;
  preco_por_hora?: string;
  consumo_por_litro?: string;
  status?: string;
}

const Carros = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [novoCarro, setNovoCarro] = useState<Carro>({
    nome: '',
    ano: '',
    placa: '',
  });
  const [searchText, setSearchText] = useState(''); // Estado para o texto da pesquisa

  const handleInputChange = (key: keyof Carro, value: string) => {
    setNovoCarro((prevCarro) => ({
      ...prevCarro,
      [key]: value,
    }));
  };

  const adicionarCarro = async () => {
    const { nome, ano, placa, preco_por_hora, consumo_por_litro, foto } = novoCarro;
  
    // Array para armazenar campos obrigatórios que estão vazios
    const camposFaltando = [];
  
    if (!nome) camposFaltando.push('Nome');
    if (!ano) camposFaltando.push('Ano');
    if (!placa) camposFaltando.push('Placa');
    if (!preco_por_hora) camposFaltando.push('Preço por Hora');
    if (!consumo_por_litro) camposFaltando.push('Consumo por Litro');
    if (!foto) camposFaltando.push('URL da Foto');
  
    // Se houver campos faltando, exiba um alerta com os nomes deles
    if (camposFaltando.length > 0) {
      Alert.alert('Erro', `Por favor, preencha os seguintes campos obrigatórios: ${camposFaltando.join(', ')}.`);
      return;
    }
  
    // Verificar se os campos que devem conter números realmente contêm apenas números
    const numericFields = { ano, preco_por_hora, consumo_por_litro };
  
    for (const [key, value] of Object.entries(numericFields)) {
      if (value && !/^\d+$/.test(value)) {
        Alert.alert('Erro', `Por favor, insira apenas números no campo ${key}.`);
        return;
      }
    }
  
    novoCarro.status = 'disponível';
  
    const novosCarros = [...carros, novoCarro];
  
    // Atualizar a lista no componente CarrosCrud
    setCarros(novosCarros);
  
    // Salvar carros no AsyncStorage
    try {
      await AsyncStorage.setItem('@carros', JSON.stringify(novosCarros));
    } catch (error) {
      console.error('Erro ao salvar carros no AsyncStorage:', error);
    }
  
    setNovoCarro({ 
      nome: '', 
      ano: '', 
      placa: '', 
      preco_por_hora: '', 
      consumo_por_litro: '', 
      foto: '' 
    });
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

  // Função para filtrar carros com base no texto de pesquisa
  const filteredCarros = carros.filter(car => 
    car.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    car.placa.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#38B6FF" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar..."
          placeholderTextColor="#888"
          value={searchText} // Atualiza o valor do texto de pesquisa
          onChangeText={setSearchText} // Atualiza o estado do texto de pesquisa
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={20} color="#38B6FF" style={styles.icon} />
        <Text style={styles.textoBtn}>Adicionar Carro</Text>
      </TouchableOpacity>

      <CarrosCrud carros={filteredCarros} setCarros={setCarros} />

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
