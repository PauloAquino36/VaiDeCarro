import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BotaoContornado from '../Componentes/BotaoContornado';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext';

type Membro = {
  email: string;
  senha: string;
  cargo: string;
};

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
};


const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login } = useAuth(); // Use o contexto de autenticação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    const membrosStorage = await AsyncStorage.getItem('@membros');
    const membros: Membro[] = membrosStorage ? JSON.parse(membrosStorage) : [];
  
    if (email === 'adm' && senha === 'adm') {
      const user = { email, cargo: 'Administrador' };
      login(user); // ✅ Isso automaticamente mostrará "Inicio" no AppNavigator
      return;
    }
  
    const membroEncontrado = membros.find(membro => membro.email === email && membro.senha === senha);
  
    if (membroEncontrado) {
      const user = { email: membroEncontrado.email, cargo: membroEncontrado.cargo };
      login(user); // ✅ A navegação ocorrerá automaticamente quando isAuthenticated for true
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
