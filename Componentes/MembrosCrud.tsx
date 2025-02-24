import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import membrosData from '../bancoDados/Dados/Membros.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../AuthContext';

interface Membro {
  id: number;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  foto: string;
  senha: string;
  cpf: string;
}

const { width, height } = Dimensions.get('window');

interface MembrosCrudProps {
  membros: Membro[];
  setMembros: (membros: Membro[]) => void;
}

const MembrosCrud: React.FC<MembrosCrudProps> = ({ membros, setMembros}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');
  const [editedSenha, setEditedSenha] = useState<string>('');
  const [editedTelefone, setEditedTelefone] = useState<string>('');
  const [editedCpf, setEditedCpf] = useState<string>('');
  const [editedCargo, setEditedCargo] = useState<string>('');
  const { getCargo } = useAuth();


  useEffect(() => {
  const carregarMembros = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@membros');
      if (jsonValue) {
        try {
          const parsedMembros = JSON.parse(jsonValue);
          if (Array.isArray(parsedMembros)) {
            setMembros(parsedMembros);
          } else {
            throw new Error('Dados inválidos no AsyncStorage');
          }
        } catch (error) {
          console.error('Erro ao processar os dados do AsyncStorage:', error);
          setMembros(membrosData.membros);
          await AsyncStorage.setItem('@membros', JSON.stringify(membrosData.membros));
        }
      } else {
        // Se não houver dados, carregar os iniciais
        setMembros(membrosData.membros);
        await AsyncStorage.setItem('@membros', JSON.stringify(membrosData.membros));
      }
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    }
  };

  carregarMembros();
}, []);


  const salvarMembros = async (novosMembros: Membro[]) => {
    try {
      await AsyncStorage.setItem('@membros', JSON.stringify(novosMembros));
      setMembros(novosMembros); // Atualiza a lista de membros no componente pai
    } catch (error) {
      console.error('Erro ao salvar membros:', error);
    }
  };

  const handleView = (membro: Membro) => {
    setSelectedMembro(membro);
    setShowModal(true);
  };

  const handleEdit = (membro: Membro) => {
    setSelectedMembro(membro);
    setEditedName(membro.nome);
    setEditedEmail(membro.email);
    setEditedTelefone(membro.telefone);
    setEditedCpf(membro.cpf);
    setEditedCargo(membro.cargo);
    setEditedSenha(membro.senha);
    setShowEditModal(true);
  };

  const handleDelete = (membro: Membro) => {
    setSelectedMembro(membro);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedMembro) {
      const novosMembros = membros.filter(membro => membro.id !== selectedMembro.id);
      await salvarMembros(novosMembros);
      setShowDeleteConfirm(false);
      Alert.alert('Membro deletado com sucesso!');
    }
  };

  const handleSaveEdit = async () => {
    if (selectedMembro) {
      const novosMembros = membros.map(membro =>
        membro.id === selectedMembro.id
          ? { ...membro, nome: editedName, email: editedEmail, telefone: editedTelefone, cpf: editedCpf, cargo: editedCargo, senha: editedSenha }
          : membro
      );

      await salvarMembros(novosMembros);
      setShowEditModal(false);
      Alert.alert('Membro editado com sucesso!');
    }
  };
  

  if (membros.length === 0) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  const cargoUsuario = getCargo();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {membros.map((membro, index) => (
        <View key={index} style={styles.container}>
          <Image source={require("../bancoDados/Membros/fotoMembros.png")} style={styles.membro} />
          <View style={styles.info}>
            <Text style={styles.texto}>{membro.nome}</Text>
            <View style={styles.botoesContainer}>
              <TouchableOpacity style={styles.botao} onPress={() => handleView(membro)}>
                <Icon name="eye" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>Ver</Text>
              </TouchableOpacity>
              {(cargoUsuario === 'Desenvolvedor' || cargoUsuario === 'Administrador') && (
                <>
                  <TouchableOpacity style={styles.botao} onPress={() => handleEdit(membro)}>
                    <Icon name="pencil" size={width * 0.05} color={"#38B6FF"} />
                    <Text style={styles.textoBtn}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botao} onPress={() => handleDelete(membro)}>
                    <Icon name="trash" size={width * 0.05} color={"#38B6FF"} />
                    <Text style={styles.textoBtn}>Deletar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      ))}

      {/* Modal para ver membro */}
      {selectedMembro && (
        <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalContentText}>
                <Text style={styles.modalTitle}>Membro: {selectedMembro.nome}</Text>
                <Text style={styles.modalText}>Cargo: {selectedMembro.cargo}</Text>
                <Text style={styles.modalText}>Email: {selectedMembro.email}</Text>
                <Text style={styles.modalText}>Número: {selectedMembro.telefone}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeText}>Fechar</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Image source={require("../bancoDados/Membros/fotoMembros.png")} style={styles.modalImage} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para editar membro */}
      {selectedMembro && (
  <Modal
    visible={showEditModal}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setShowEditModal(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContentEdit}>
        <Text style={styles.modalTitle}>Editar Membro</Text>

        <Text style={styles.modalTextInput}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Digite o novo nome"
        />

        <Text style={styles.modalTextInput}>Email:</Text>
        <TextInput
          style={styles.input}
          value={editedEmail}
          onChangeText={setEditedEmail}
          placeholder="Digite o novo email"
        />

        <Text style={styles.modalTextInput}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={editedSenha}
          onChangeText={setEditedSenha}
          placeholder="Digite a nova senha"
          secureTextEntry
        />

        <Text style={styles.modalTextInput}>Telefone:</Text>
        <TextInput
          style={styles.input}
          value={editedTelefone}
          onChangeText={setEditedTelefone}
          placeholder="Digite o novo telefone"
        />

        <Text style={styles.modalTextInput}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={editedCpf}
          onChangeText={setEditedCpf}
          placeholder="Digite o novo CPF"
        />

        <Text style={styles.modalTextInput}>Cargo:</Text>
       
       

      <Picker
                    selectedValue={editedCargo}
                    onValueChange={(itemValue) => {
                      console.log('Novo cargo selecionado:', itemValue);
                      setEditedCargo(itemValue);
                    }}
                    style={styles.input}
                  >
                    <Picker.Item label="Selecione um cargo" value="" />
                    <Picker.Item label="Administrador" value="Administrador" />
                    <Picker.Item label="Funcionário" value="Funcionário" />
                    <Picker.Item label="Desenvolvedor" value="Desenvolvedor" />
                    <Picker.Item label="Proprietário da Frota" value="Proprietário da Frota" />
                  </Picker>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
          <Text style={styles.closeText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowEditModal(false)}>
          <Text style={styles.closeText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


      {/* Modal de confirmação de exclusão */}
      {selectedMembro && (
        <Modal visible={showDeleteConfirm} animationType="slide" transparent={true} onRequestClose={() => setShowDeleteConfirm(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tem certeza que deseja excluir?</Text>
              <TouchableOpacity style={styles.saveBtn} onPress={confirmDelete}>
                <Text style={styles.closeText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.closeText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  container: {
    marginTop: width * 0.025,
    width: width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: width * 0.004,
    borderColor: '#5271FF',
    borderRadius: 30,
    marginBottom: 15,
    padding: width * 0.01,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.05,
  },
  membro: {
    width: width * 0.19,
    height: width * 0.19,
    resizeMode: 'contain',
  },
  texto: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textoBtn: {
    color: 'white',
    fontSize: width * 0.025,
    fontWeight: 'bold',
    marginLeft: width * 0.01,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    flexDirection: 'row', // Adicionando essa linha para colocar as views lado a lado
    justifyContent: 'space-between', // Distribui o espaço entre as views
    alignItems: 'center', // Alinha as views ao centro verticalmente
  },
  modalContentEdit: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    flexDirection: 'column',
    justifyContent: 'space-between', // Distribui o espaço entre as views
    alignItems: 'flex-start', // Alinha as views ao centro verticalmente
  },
  modalContentText: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalTextInput: {
    fontSize: 17,
    marginBottom: width * 0.02,
    
  },
  modalImage: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  saveBtn: {
    backgroundColor: '#38B6FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: width * 0.15,
  },
  closeBtn: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.2,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  
});

export default MembrosCrud;
