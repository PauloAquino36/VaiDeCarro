import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../AuthContext";

const { width } = Dimensions.get("window");

interface Aluguel {
  carro: {
    id: number;
    nome: string;
    foto: string;
    preco_por_hora: number;
  };
  cliente: {
    nome: string;
    telefone: string;
    endereco: string;
    cpf: string;
  };
  horaInicio: string;
  horaTermino: string;
}

const Alugado = () => {
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [aluguelSelecionado, setAluguelSelecionado] = useState<Aluguel | null>(
    null
  );
  const [precoFinal, setPrecoFinal] = useState(0);
  const [valorSemAtraso, setValorSemAtraso] = useState(0);
  const [valorAtraso, setValorAtraso] = useState(0);
  const [multa, setMulta] = useState(0);
  const { getCargo } = useAuth();
  const [filteredAlugueis, setFilteredAlugueis] = useState<Aluguel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const carregarAlugueis = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@aluguéis");
        if (jsonValue !== null) {
          setAlugueis(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error("Erro ao carregar aluguéis:", error);
      }
    };

    carregarAlugueis();
  }, []);

  // Filtragem dos aluguéis quando searchQuery muda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAlugueis(alugueis);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = alugueis.filter(
        (aluguel) =>
          aluguel.carro.nome.toLowerCase().includes(lowerQuery) ||
          aluguel.cliente.nome.toLowerCase().includes(lowerQuery)
      );
      setFilteredAlugueis(filtered);
    }
  }, [searchQuery, alugueis]);

  interface CalcularPrecoProps {
    carro: {
      preco_por_hora: number;
    };
    horaInicio: string;
    horaTermino: string;
  }

  const calcularPreco = (aluguel: CalcularPrecoProps) => {
    const precoPorHora = aluguel.carro.preco_por_hora;
    const inicio = new Date(aluguel.horaInicio);
    const termino = new Date(aluguel.horaTermino);
    const agora = new Date();

    let horasTotais = Math.ceil(
      (termino.getTime() - inicio.getTime()) / (1000 * 60 * 60)
    );
    console.log("Horas totais sem atraso:", horasTotais);
    let preco = horasTotais * precoPorHora;
    console.log("valor sem atraso:", preco);

    // Valores de atraso
    let atrasoValor = 0;
    let multaValor = 0;

    if (agora > termino) {
      const horasAtraso = Math.ceil(
        (agora.getTime() - termino.getTime()) / (1000 * 60 * 60)
      );
      console.log("Horas totais cm atraso:", horasAtraso);
      atrasoValor = horasAtraso * precoPorHora; // Preço do atraso
      console.log("valor do atraso:", atrasoValor);
      multaValor = atrasoValor * 0.2;
      console.log("multa:", multaValor);
      preco += multaValor; // Adiciona a multa ao preço final
    }

    setValorSemAtraso(preco - multaValor); // Valor sem atraso
    setValorAtraso(atrasoValor); // Valor do atraso
    setMulta(multaValor); // Valor da multa
    setPrecoFinal(preco + atrasoValor); // Preço final com multa
  };

  const abrirModal = (aluguel: Aluguel) => {
    setAluguelSelecionado(aluguel);
    calcularPreco(aluguel);
    setModalVisible(true);
  };

  const confirmarDevolucao = async () => {
    if (aluguelSelecionado) {
      try {
        const carrosStorage = await AsyncStorage.getItem("@carros");
        let carrosDisponiveis = carrosStorage ? JSON.parse(carrosStorage) : [];
  
        const carroAtualizado = {
          ...aluguelSelecionado.carro,
          status: "disponível",
        };
  
        const carroExistenteIndex: number = carrosDisponiveis.findIndex(
          (carro: { id: number }) => carro.id === carroAtualizado.id
        );
        if (carroExistenteIndex > -1) {
          carrosDisponiveis[carroExistenteIndex] = carroAtualizado;
        } else {
          carrosDisponiveis.push(carroAtualizado);
        }
  
        await AsyncStorage.setItem("@carros", JSON.stringify(carrosDisponiveis));
  
        const novosAlugueis = alugueis.filter(
          (item) => item.carro.id !== aluguelSelecionado.carro.id
        );
        await AsyncStorage.setItem("@aluguéis", JSON.stringify(novosAlugueis));
  
        // Criar um novo relatório
        const novoRelatorio = {
          nome_cliente: aluguelSelecionado.cliente.nome,
          telefone_cliente: aluguelSelecionado.cliente.telefone,
          cpf_cliente: aluguelSelecionado.cliente.cpf,
          endereco_cliente: aluguelSelecionado.cliente.endereco,
          nome_carro: aluguelSelecionado.carro.nome,
          hora_inicio: aluguelSelecionado.horaInicio,
          hora_entrega: new Date().toISOString(),
          horas_gastas: Math.ceil(
            (new Date().getTime() - new Date(aluguelSelecionado.horaInicio).getTime()) /
              (1000 * 60 * 60)
          ),
          pago_com_atraso: new Date() > new Date(aluguelSelecionado.horaTermino),
          valor_pago: precoFinal.toFixed(2),
        };
  
        // Adicionar o relatório ao AsyncStorage
        const relatoriosStorage = await AsyncStorage.getItem("@relatorios");
        let relatorios = relatoriosStorage ? JSON.parse(relatoriosStorage) : [];
        relatorios.push(novoRelatorio);
        await AsyncStorage.setItem("@relatorios", JSON.stringify(relatorios));
  
        setAlugueis(novosAlugueis);
        setModalVisible(false);
        setAluguelSelecionado(null);
        console.log("Carro devolvido, atualizado como disponível e relatório salvo!");
      } catch (error) {
        console.error("Erro ao devolver carro:", error);
      }
    }
  };
  

  const cargoUsuario = getCargo();

  return (
    <View>
        <View style={styles.searchContainer}>
        <Icon name="search" size={width * 0.05} color="#38B6FF" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar por carro ou cliente..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    {filteredAlugueis.length === 0 ? (
        <Text style={styles.texto}>Nenhum carro alugado.</Text>
      ) : (
        filteredAlugueis.map((aluguel, index) => (
          <View key={index} style={styles.container}>
            <Image source={{ uri: aluguel.carro.foto }} style={styles.carro} />
            <View style={styles.info}>
              <Text style={styles.texto}>{`${aluguel.carro.nome}`}</Text>
              <Text style={styles.texto}>{`${aluguel.cliente.nome}`}</Text>
              <Text style={styles.textoData}>
                {`${new Date(
                  aluguel.horaInicio
                ).toLocaleDateString()} - ${new Date(
                  aluguel.horaTermino
                ).toLocaleDateString()}`}
              </Text>

              {(cargoUsuario === "Desenvolvedor" ||
                cargoUsuario === "Administrador" ||
                cargoUsuario === "Funcionário") && (
                  <>
                    <TouchableOpacity
                      style={styles.botao}
                      onPress={() => abrirModal(aluguel)}
                    >
                      <Icon
                        name="check-square-o"
                        size={width * 0.05}
                        color="#38B6FF"
                      />
                      <Text style={styles.textoBtn}>Confirmar devolução</Text>
                    </TouchableOpacity>
                  </>
                )}
            </View>
          </View>
        ))
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitulo}>Resumo do Aluguel</Text>
            {aluguelSelecionado && (
              <>
                <Text style={styles.modalTexto}>
                  Carro: {aluguelSelecionado.carro.nome}
                </Text>
                <Text style={styles.modalTexto}>
                  Cliente: {aluguelSelecionado.cliente.nome}
                </Text>
                <Text style={styles.modalTexto}>
                  Início:{" "}
                  {new Date(aluguelSelecionado.horaInicio).toLocaleString()}
                </Text>
                <Text style={styles.modalTexto}>
                  Término:{" "}
                  {new Date(aluguelSelecionado.horaTermino).toLocaleString()}
                </Text>
                <Text style={styles.modalTexto}>
                  Preço por hora: R${" "}
                  {aluguelSelecionado.carro.preco_por_hora}
                </Text>
                <Text style={styles.modalTexto}>
                  Valor sem atraso: R$ {valorSemAtraso.toFixed(2)}
                </Text>
                <Text style={styles.modalTexto}>
                  Valor do atraso: R$ {valorAtraso.toFixed(2)}
                </Text>
                <Text style={styles.modalTexto}>
                  Multa (20% das horas de atraso): R$ {multa.toFixed(2)}
                </Text>
                <Text style={styles.modalTexto}>
                  Preço final: R$ {precoFinal.toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={styles.botaoConfirmar}
                  onPress={confirmarDevolucao}
                >
                  <Text style={styles.textoBtn}>Confirmar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textoBtn}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  container: {
    marginTop: width * 0.025,
    width: width * 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: width * 0.004,
    borderColor: "#5271FF",
    borderRadius: 30,
    marginBottom: 15,
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
  info: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: width * 0.05,
  },
  carro: {
    width: width * 0.19,
    height: width * 0.19,
    resizeMode: 'contain',
    //borderWidth: width * 0.004,
    //borderColor: 'red',
  },
  texto: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
    marginVertical: 5,
  },
  textoData: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
    marginVertical: 5,
  },
  textoBtn: {
    color: "white",
    fontSize: width * 0.025,
    fontWeight: "bold",
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 10,
  },
  botaoConfirmar: {
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  botaoCancelar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Alugado;
