import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import membrosData from '../bancoDados/Dados/Membros.json';

interface Membro {
  nome: string;
  idade: number;
  foto: string;
}

const { width } = Dimensions.get('window');


const MembrosCrud = () => {
  const [membros, setMembros] = useState<Membro[]>([]);

  useEffect(() => {
    if (membrosData.membros.length > 0) {
      setMembros(membrosData.membros);
    }
  }, []);

  if (membros.length === 0) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {membros.map((membro, index) => (
        <View key={index} style={styles.container}>
        <Image source={require("../bancoDados/Membros/fotoMembros.png")} style={styles.membro} />          
          <View style={styles.info}>
            <Text style={styles.texto}>{membro.nome}</Text>

            <View style={styles.botoesContainer}>
              <TouchableOpacity style={styles.botao}>
                <Icon name="eye" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>Ver</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao}>
                <Icon name="pencil" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao}>
                <Icon name="trash" size={width * 0.05} color={"#38B6FF"} />
                <Text style={styles.textoBtn}>Deletar</Text>
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
    //borderWidth: width * 0.004,
    //borderColor: 'red',
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
    //borderWidth: 1,
    //borderColor: '#38B6FF',

  },
});

export default MembrosCrud;
