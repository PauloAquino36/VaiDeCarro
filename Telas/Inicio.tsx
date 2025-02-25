import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Componentes/NavBar';
import Alugado from '../Componentes/Alugado';
import { useAuth } from '../AuthContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type Aluguel = {
  nome: string;
  data: string;
  valor: number;
};

const Inicio = () => {
  const { getCargo } = useAuth();
  const cargoUsuario = getCargo();

  const gerarRelatorio = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@relatorios');
  
      if (!dadosSalvos) {
        Alert.alert('Erro', 'Nenhum dado encontrado para o relatório.');
        return;
      }
  
      let alugueis = JSON.parse(dadosSalvos);
  
      if (!Array.isArray(alugueis) || alugueis.length === 0) {
        Alert.alert('Erro', 'Os dados do relatório estão vazios ou corrompidos.');
        return;
      }
  
      // Ordenar por data de início (hora_inicio)
      alugueis.sort((a, b) => {
        return new Date(a.hora_inicio).getTime() - new Date(b.hora_inicio).getTime();
      });
  
      // Criar HTML dinâmico para o relatório
      const htmlContent = `
        <h1>Relatório de Aluguéis</h1>
        <table style="width:100%; border: 1px solid black; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid black; padding: 5px;">Cliente</th>
            <th style="border: 1px solid black; padding: 5px;">Telefone</th>
            <th style="border: 1px solid black; padding: 5px;">Carro</th>
            <th style="border: 1px solid black; padding: 5px;">Início</th>
            <th style="border: 1px solid black; padding: 5px;">Entrega</th>
            <th style="border: 1px solid black; padding: 5px;">Horas Gastas</th>
            <th style="border: 1px solid black; padding: 5px;">Atrasado?</th>
            <th style="border: 1px solid black; padding: 5px;">Valor Pago</th>
          </tr>
          ${alugueis.map(aluguel => `
            <tr>
              <td style="border: 1px solid black; padding: 5px;">${aluguel.nome_cliente}</td>
              <td style="border: 1px solid black; padding: 5px;">${aluguel.telefone_cliente}</td>
              <td style="border: 1px solid black; padding: 5px;">${aluguel.nome_carro}</td>
              <td style="border: 1px solid black; padding: 5px;">${new Date(aluguel.hora_inicio).toLocaleString()}</td>
              <td style="border: 1px solid black; padding: 5px;">${new Date(aluguel.hora_entrega).toLocaleString()}</td>
              <td style="border: 1px solid black; padding: 5px;">${aluguel.horas_gastas}h</td>
              <td style="border: 1px solid black; padding: 5px;">${aluguel.pago_com_atraso ? "Sim" : "Não"}</td>
              <td style="border: 1px solid black; padding: 5px;">R$ ${aluguel.valor_pago}</td>
            </tr>
          `).join('')}
        </table>
      `;
  
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('Arquivo salvo em:', uri);
  
      // Abrir o PDF automaticamente
      await WebBrowser.openBrowserAsync(uri);
  
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Imgs/VaiDeCarro_logo.png')} style={styles.logo} />



      {(cargoUsuario === 'Desenvolvedor' || cargoUsuario === 'Administrador' || cargoUsuario === 'Proprietário da Frota') && (
        <>
          <TouchableOpacity style={styles.botao} onPress={gerarRelatorio}>
            <Icon name="print" size={width * 0.05} color="#38B6FF" style={styles.icon} />
            <Text style={styles.textoBtn}>Relatório</Text>
          </TouchableOpacity>
        </>
      )}



      <Alugado />

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#191919',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: width * 0.0,
    resizeMode: 'contain',
  },
  icon: {
    marginRight: 10,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.65,
    marginBottom: width * 0.025,
  },
  textoBtn: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default Inicio;
