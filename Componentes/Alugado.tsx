import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Obtém as dimensões da tela
const { width, height } = Dimensions.get('window');

const Alugado = () => {
  return (
    <View style={styles.container}>

        <Image source={require('../bancoDados/Carros/camaro2019branco.jpg')} style={styles.carro} />

        <View style={styles.info}>
            <Text style={styles.texto}>Camaro - João Maria</Text>
            <Text style={styles.textoData}>20/03/2025 - 25/03/2025</Text>

            <TouchableOpacity style={styles.botao}>
                <Icon name="check-square-o" size={width * 0.05} color="#38B6FF" />
                <Text style={styles.textoBtn}>Confirmar devolução</Text>
            </TouchableOpacity>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: width * 0.025,
        width: width * 0.8,
        height: width * 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: width * 0.004,
        borderColor: '#5271FF',
        borderRadius: 30,
      },
      info: {
        //borderWidth: width * 0.004,
        //borderColor: 'red',
        //borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    textoData: {
        color: 'white',
        fontSize: width * 0.02,
        fontWeight: 'bold',
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
        backgroundColor: '#191919',
        borderRadius: 5,
      },
});

export default Alugado;
