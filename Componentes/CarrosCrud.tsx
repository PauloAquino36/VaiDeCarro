import React, { useEffect, useState } from 'react'; 
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView, Modal, TextInput, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import carrosData from '../bancoDados/Dados/Carros.json';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const { width } = Dimensions.get('window');

interface Carro {
  nome: string;
  ano: number;
  preco_por_hora: number;
  consumo_por_litro: number;
  placa: string;
  status: string;
  foto: string;
}

interface Cliente {
  nome: string;
  telefone: string;
  cpf: string;
  endereco: string;
  dataNascimento: string;
}

interface Aluguel {
  carro: Carro;
  cliente: Cliente;
  horaInicio: string;
  horaTermino: string;
}

interface CarrosCrudProps {
  carros: Carro[];
  setCarros: React.Dispatch<React.SetStateAction<Carro[]>>;
}

const CarrosCrud: React.FC<CarrosCrudProps> = ({ carros, setCarros }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedCarro, setSelectedCarro] = useState<Carro | null>(null);
  const [editedNome, setEditedNome] = useState<string>('');
  const [editedAno, setEditedAno] = useState<number>(new Date().getFullYear());
  const [editedPreco, setEditedPreco] = useState<number>(0);
  const [editedConsumo, setEditedConsumo] = useState<number>(0);
  const [editedPlaca, setEditedPlaca] = useState<string>('');
  const [editedStatus, setEditedStatus] = useState<string>('disponível');
  const [showRentModal, setShowRentModal] = useState<boolean>(false);
  const [isDisponivel, setIsDisponivel] = useState<boolean>(true);
const [nomeCliente, setNomeCliente] = useState<string>('');
const [telefoneCliente, setTelefoneCliente] = useState<string>('');
const [cpfCliente, setCpfCliente] = useState<string>('');
const [enderecoCliente, setEnderecoCliente] = useState<string>('');
const [dataNascimentoCliente, setDataNascimentoCliente] = useState('');
  const [horaTerminoAluguel, setHoraTerminoAluguel] = useState(new Date());
  const [horaInicioAluguel, setHoraInicioAluguel] = useState(new Date().toISOString());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

const [aluguéis, setAlugueis] = useState<Aluguel[]>([]);


  // Carregar carros do AsyncStorage ou do JSON inicial
  useEffect(() => {
    const carregarCarros = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@carros');
        if (jsonValue !== null) {
          setCarros(JSON.parse(jsonValue));
        } else {
          setCarros(carrosData.carros);
          await AsyncStorage.setItem('@carros', JSON.stringify(carrosData.carros));
        }
      } catch (error) {
        console.error('Erro ao carregar carros:', error);
      }
    };

    carregarCarros();
  }, []);

  // Salvar carros no AsyncStorage
  const salvarCarros = async (novosCarros: Carro[]) => {
    try {
      await AsyncStorage.setItem('@carros', JSON.stringify(novosCarros));
      setCarros(novosCarros);
    } catch (error) {
      console.error('Erro ao salvar carros:', error);
    }
  };

  // Deletar um carro
  const handleDelete = (placa: string) => {
    const novosCarros = carros.filter(carro => carro.placa !== placa);
    salvarCarros(novosCarros);
    Alert.alert('Carro deletado com sucesso!');
  };

  // Ver detalhes do carro
  const handleView = (carro: Carro) => {
    setSelectedCarro(carro);
    setShowModal(true);
  };

  // Editar carro
  const handleEdit = (carro: Carro) => {
    setSelectedCarro(carro);
    setEditedNome(carro.nome);
    setEditedAno(carro.ano);
    setEditedPreco(carro.preco_por_hora);
    setEditedConsumo(carro.consumo_por_litro);
    setEditedPlaca(carro.placa);
    setEditedStatus(carro.status);
    setIsDisponivel(carro.status === 'disponível');
    setShowEditModal(true);
  };

  // Salvar edição
const handleSaveEdit = () => {
  if (selectedCarro) {
    const novosCarros = carros.map(carro =>
      carro.placa === selectedCarro.placa
        ? { ...carro, nome: editedNome, ano: editedAno, preco_por_hora: editedPreco, consumo_por_litro: editedConsumo, placa: editedPlaca, status: isDisponivel ? 'disponível' : 'indisponível' } // Atualiza o status baseado no switch
        : carro
    );
    salvarCarros(novosCarros);
    setShowEditModal(false);
    Alert.alert('Carro editado com sucesso!');
  }
};

  const handleRent = (carro: Carro) => {
    setSelectedCarro(carro);
    // Definir a hora de início como a hora atual
    const horaAtual = new Date().toISOString();  // Pegando a hora atual no formato ISO
    setHoraInicioAluguel(horaAtual);  // Atualiza o estado com a hora atual
    setShowRentModal(true);
  };

  const handleConfirmRent = () => {
    if (selectedCarro) {
      const novoAluguel: Aluguel = {
        carro: selectedCarro,
        cliente: {
          nome: nomeCliente,
          telefone: telefoneCliente,
          cpf: cpfCliente,
          endereco: enderecoCliente,
          dataNascimento: dataNascimentoCliente,
        },
        horaInicio: horaInicioAluguel,
        horaTermino: horaTerminoAluguel.toISOString(),
      };
  
      const novosAlugueis = [...aluguéis, novoAluguel];
      salvarAlugueis(novosAlugueis);
  
      const novosCarros = carros.map(carro =>
        carro.placa === selectedCarro.placa
          ? { ...carro, status: 'indisponível' }
          : carro
      );
      salvarCarros(novosCarros);
  
      setShowRentModal(false);
      Alert.alert('Aluguel registrado com sucesso!');
    }
  };

  const salvarAlugueis = async (novosAlugueis: Aluguel[]) => {
    try {
      await AsyncStorage.setItem('@aluguéis', JSON.stringify(novosAlugueis));
      setAlugueis(novosAlugueis);
    } catch (error) {
      console.error('Erro ao salvar aluguéis:', error);
    }
  };

  interface DateTimePickerEvent {
    type: string;
    nativeEvent: any;
  }


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  interface HandleConfirm {
    (date: Date): void;
  }

  const handleConfirm: HandleConfirm = (date) => {
    setHoraTerminoAluguel(date);
    hideDatePicker();
  };
  
  

  if (carros.length === 0) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {carros.map((carro, index) => (
        <View key={index} style={styles.container}>
          <Image source={{ uri: carro.foto }} style={styles.carro} />
          <View style={styles.info}>
            <Text style={styles.texto}>{carro.nome} - {carro.ano}</Text>

            <TouchableOpacity style={styles.botao} disabled={carro.status === 'indisponível'} onPress={() => handleRent(carro)}>
              <Icon name="user-plus" size={width * 0.05} color={carro.status === 'disponível' ? "#38B6FF" : "gray"} />
              <Text style={styles.textoBtn}>{carro.status === 'disponível' ? 'Alugar' : 'Indisponível'}</Text>
            </TouchableOpacity>

            <View style={styles.botoesContainer}>
              <TouchableOpacity style={styles.botao} onPress={() => handleView(carro)}>
                <Icon name="eye" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Ver'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao} onPress={() => handleEdit(carro)}>
                <Icon name="pencil" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Editar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao} onPress={() => handleDelete(carro.placa)}>
                <Icon name="trash" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Deletar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Modal para ver detalhes do carro */}
      {selectedCarro && (
        <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes do Carro</Text>
              <Text style={styles.modalText}>Nome: {selectedCarro.nome}</Text>
              <Text style={styles.modalText}>Ano: {selectedCarro.ano}</Text>
              <Text style={styles.modalText}>Preço por Hora: R${selectedCarro.preco_por_hora}</Text>
              <Text style={styles.modalText}>Consumo por Litro: {selectedCarro.consumo_por_litro} km/l</Text>
              <Text style={styles.modalText}>Placa: {selectedCarro.placa}</Text>
              <Text style={styles.modalText}>Status: {selectedCarro.status}</Text>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para editar carro */}
      {selectedCarro && (
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Carro</Text>
            <TextInput
              style={styles.input}
              value={editedNome}
              onChangeText={setEditedNome}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={editedAno.toString()}
              onChangeText={text => setEditedAno(Number(text))}
              placeholder="Ano"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedPreco.toString()}
              onChangeText={text => setEditedPreco(Number(text))}
              placeholder="Preço por Hora"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedConsumo.toString()}
              onChangeText={text => setEditedConsumo(Number(text))}
              placeholder="Consumo por Litro"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedPlaca}
              onChangeText={setEditedPlaca}
              placeholder="Placa"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Disponível</Text>
              <Switch
                value={isDisponivel}
                onValueChange={(value) => {
                  setIsDisponivel(value);
                  setEditedStatus(value ? 'disponível' : 'indisponível'); // Atualiza o status editado com base no switch
                }}
              />
            </View>

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

      {/* Modal para aluguel */}
    {showRentModal && (
      <Modal visible={showRentModal} animationType="slide" transparent={true} onRequestClose={() => setShowRentModal(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alugar Carro</Text>
          <TextInput
            style={styles.input}
            value={nomeCliente}
            onChangeText={setNomeCliente}
            placeholder="Nome do Cliente"
          />
          <TextInput
            style={styles.input}
            value={telefoneCliente}
            onChangeText={setTelefoneCliente}
            placeholder="Telefone do Cliente"
          />
          <TextInput
            style={styles.input}
            value={cpfCliente}
            onChangeText={setCpfCliente}
            placeholder="CPF do Cliente"
          />
          <TextInput
            style={styles.input}
            value={enderecoCliente}
            onChangeText={setEnderecoCliente}
            placeholder="Endereço do Cliente"
          />
          <TextInput
            style={styles.input}
            value={dataNascimentoCliente}
            onChangeText={setDataNascimentoCliente}
            placeholder="Data de Nascimento (YYYY-MM-DD)"
          />

          {/* Botão para abrir o DateTimePicker */}
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{`Hora de Término: ${horaTerminoAluguel.toLocaleString()}`}</Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={horaTerminoAluguel}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
        )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleConfirmRent}>
            <Text style={styles.closeText}>Confirmar Aluguel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowRentModal(false)}>
            <Text style={styles.closeText}>Cancelar</Text>
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
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.05,
  },
  carro: {
    width: width * 0.19,
    height: width * 0.19,
    resizeMode: 'contain',
    borderWidth: width * 0.004,
    borderColor: 'red',
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
    width: width * 0.9,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: width * 0.04,
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
  closeBtn: {
    backgroundColor: '#5271FF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#38B6FF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    marginRight: 10,
  },
  dateButton: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#38B6FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  dateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CarrosCrud;
