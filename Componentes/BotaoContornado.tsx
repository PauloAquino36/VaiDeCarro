import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Obtém as dimensões da tela
const { width, height } = Dimensions.get('window');

const BotaoContornado = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={[styles.botao, { width: width * 0.4 }]} onPress={onPress}>
      <Text style={[styles.texto, { fontSize: width * 0.05 }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    borderWidth: 2,
    borderColor: '#FEFFF5',
    backgroundColor: '#38B6FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: '#FEFFF5',
    fontWeight: 'bold',
  },
});

export default BotaoContornado;
