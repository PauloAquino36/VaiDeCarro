import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import MembrosCrud from '../Componentes/MembrosCrud';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

interface Membro {
  cargo: string;
  nome: string;
  email: string;
  senha: string;
  numero: string;
  cpf: string;
}

const Membros = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [novoMembro, setNovoMembro] = useState<Membro>({
    cargo: '',
    nome: '',
    email: '',
    senha: '',
    numero: '',
    cpf: '',
  });
  const [searchText, setSearchText] = useState(''); // Estado para texto da pesquisa

  const handleInputChange = (key: keyof Membro, value: string) => {
    setNovoMembro((prevMembro) => ({
      ...prevMembro,
      [key]: value,
    }));
  };

  const adicionarMembro = async () => {
    const { nome, email, senha, numero, cpf, cargo } = novoMembro;

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!nome || !email || !senha || !numero || !cpf || !cargo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação do formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    // Validação do formato do CPF (considerando 11 dígitos numéricos)
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido (11 dígitos).');
      return;
    }

    setMembros((prevMembros) => {
      const novosMembros = [...prevMembros, novoMembro];
      console.log('Lista de membros atualizada:', novosMembros);
      return novosMembros;
    });

    // Salvar membros no AsyncStorage
    try {
      await AsyncStorage.setItem('@membros', JSON.stringify([...membros, novoMembro]));
    } catch (error) {
      console.error('Erro ao salvar membros no AsyncStorage:', error);
    }

    setNovoMembro({ // Limpa o formulário
      cargo: '',
      nome: '',
      email: '',
      senha: '',
      numero: '',
      cpf: '',
    });

    setModalVisible(false); // Fecha o modal
  };

  // Monitora mudanças no estado `membros`
  useEffect(() => {
    const carregarMembros = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@membros');
        if (jsonValue !== null) {
          setMembros(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
      }
    };

    carregarMembros();
  }, []);

  // Filtra membros com base no texto da pesquisa
  const filteredMembros = membros.filter(membro =>
    membro.nome.toLowerCase().includes(searchText.toLowerCase())
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
          value={searchText}
          onChangeText={setSearchText} // Atualiza o texto da pesquisa
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={20} color="#38B6FF" style={styles.icon} />
        <Text style={styles.textoBtn}>Adicionar Membro</Text>
      </TouchableOpacity>

      <MembrosCrud membros={filteredMembros} setMembros={setMembros} />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Membro</Text>

            <Picker
              selectedValue={novoMembro.cargo}
              onValueChange={(value) => handleInputChange('cargo', value)}
              style={styles.input}
            >
              <Picker.Item label="Selecione um cargo" value="" />
              <Picker.Item label="Administrador" value="Administrador" />
              <Picker.Item label="Funcionário" value="Funcionário" />
              <Picker.Item label="Desenvolvedor" value="Desenvolvedor" />
              <Picker.Item label="Proprietário da Frota" value="Proprietário da Frota" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={novoMembro.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={novoMembro.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={novoMembro.senha}
              onChangeText={(value) => handleInputChange('senha', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Número"
              keyboardType="phone-pad"
              value={novoMembro.numero}
              onChangeText={(value) => handleInputChange('numero', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="CPF"
              keyboardType="numeric"
              value={novoMembro.cpf}
              onChangeText={(value) => handleInputChange('cpf', value)}
            />

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
