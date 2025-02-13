import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import alugueisData from '../bancoDados/Dados/Alugados.json';

const { width, height } = Dimensions.get('window');

interface Aluguel {
  nome_cliente: string;
  telefone_cliente: string;
  cpf_cliente: string;
  endereco_cliente: string;
  data_nascimento_cliente: string;
  veiculo_selecionado: {
    id: number;
    nome: string;
    foto: string;
  };
  hora_inicio_aluguel: string;
  hora_termino_aluguel: string;
}

const Alugado = () => {
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);

  useEffect(() => {
    if (alugueisData.alugueis.length > 0) {
      setAlugueis(alugueisData.alugueis);
    }
  }, []);

  if (alugueis.length === 0) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {alugueis.map((aluguel, index) => (
        <View key={index} style={styles.container}>
          <Image
            source={{ uri: `../bancoDados/Carros/${aluguel.veiculo_selecionado.foto}` }}
            style={styles.carro}
          />
          <View style={styles.info}>
            <Text style={styles.texto}>{`${aluguel.veiculo_selecionado.nome}`}</Text>
            <Text style={styles.texto}>{`${aluguel.nome_cliente}`}</Text>
            <Text style={styles.textoData}>
              {`${new Date(aluguel.hora_inicio_aluguel).toLocaleDateString()} - ${new Date(aluguel.hora_termino_aluguel).toLocaleDateString()}`}
            </Text>

            <TouchableOpacity style={styles.botao}>
              <Icon name="check-square-o" size={width * 0.05} color="#38B6FF" />
              <Text style={styles.textoBtn}>Confirmar devolução</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
    height: 'auto', // Deixe a altura ajustável
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
  },
  texto: {
    color: 'white', // Ajuste para uma cor mais visível
    fontSize: width * 0.03,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textoData: {
    color: 'white', // Ajuste para uma cor mais visível
    fontSize: width * 0.03,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textoBtn: {
    color: 'white',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
});

export default Alugado;
