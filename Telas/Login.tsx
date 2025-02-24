import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BotaoContornado from '../Componentes/BotaoContornado';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Inicio: undefined;
  // Add other routes here if needed
};

const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login } = useAuth(); // Use o contexto de autenticação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    // Verifica se o usuário é o administrador
    if (email === 'admin@exemplo.com' && senha === 'senhaAdmin') {
      const user = { email, cargo: 'Administrador' }; // Define o usuário como administrador
      login(user); // Atualiza o estado de autenticação com o usuário
      navigation.navigate('Inicio');
      return;
    }

    // Carregar a lista de membros do AsyncStorage
    const membrosStorage = await AsyncStorage.getItem('@membros');
    const membros: Membro[] = membrosStorage ? JSON.parse(membrosStorage) : [];

    // Verifica se o email e a senha correspondem a um membro
    interface Membro {
      email: string;
      senha: string;
      cargo: string;
    }

    const membroEncontrado: Membro | undefined = membros.find((membro: Membro) => membro.email === email && membro.senha === senha);

    if (membroEncontrado) {
      const user = { email: membroEncontrado.email, cargo: membroEncontrado.cargo }; // Define o usuário encontrado
      login(user); // Atualiza o estado de autenticação com o usuário encontrado
      console.log('cargo', user.cargo)
      navigation.navigate('Inicio');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="E-mail"
          placeholderTextColor="#38B6FF"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Senha"
          placeholderTextColor="#38B6FF"
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <BotaoContornado title="Entrar" onPress={handleLogin} />
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
