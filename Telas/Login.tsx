import React from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions } from 'react-native';
import BotaoContornado from '../Componentes/BotaoContornado';

const { width } = Dimensions.get('window');

const Login = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          keyboardType="email-address" 
          autoCapitalize="none" 
          placeholder="E-mail"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}  
          secureTextEntry 
          placeholder="Senha"
        />
      </View>

      <BotaoContornado title="Entrar" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1, // Padding responsivo
    backgroundColor: '#191919',
  },
  logo: {
    width: width * 0.6, // 40% da largura da tela
    height: width * 0.6, // Mantendo proporção
    marginBottom: width * 0.08,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: width * 0.8, // 80% da largura da tela
    marginBottom: width * 0.04,
  },
  input: {
    width: '100%',
    paddingVertical: width * 0.02, // Tamanho do padding ajustável
    paddingHorizontal: width * 0.05,
    borderWidth: width * 0.006, // Ajustando largura da borda
    backgroundColor: '#FEFFF5',
    borderColor: '#38B6FF',
    borderRadius: 27,
    fontSize: width * 0.04, // Ajustando tamanho da fonte
  },
});

export default Login;
