import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import carrosData from '../bancoDados/Dados/Carros.json';

const { width } = Dimensions.get('window');

const CarrosCrud = () => {
  interface Carro {
    nome: string;
    ano: number;
    preco_por_hora: number;
    consumo_por_litro: number;
    placa: string;
    status: string;
    foto: string;
  }

  const [carros, setCarros] = useState<Carro[]>([]);

  useEffect(() => {
    if (carrosData.carros.length > 0) {
      setCarros(carrosData.carros);
    }
  }, []);

  if (carros.length === 0) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {carros.map((carro, index) => (
        <View key={index} style={styles.container}>
          <Image source={{ uri: `../bancoDados/Carros/${carro.foto}` }} style={styles.carro} />
          <View style={styles.info}>
            <Text style={styles.texto}>{carro.nome} - {carro.ano}</Text>

            <TouchableOpacity style={styles.botao} disabled={carro.status === 'indisponível'}>
              <Icon name="user-plus" size={width * 0.05} color={carro.status === 'disponível' ? "#38B6FF" : "gray"} />
              <Text style={styles.textoBtn}>{carro.status === 'disponível' ? 'Alugar' : 'Indisponível'}</Text>
            </TouchableOpacity>

            <View style={styles.botoesContainer}>
              <TouchableOpacity style={styles.botao}>
                <Icon name="eye" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Ver'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao}>
                <Icon name="pencil" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Editar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao}>
                <Icon name="trash" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>{'Deletar'}</Text>
              </TouchableOpacity>
            </View>

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
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    marginRight: width * 0.25,
  },
});

export default CarrosCrud;