import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Obtém a tela atual

  return (
    <View style={styles.navbar}>
      <NavItem icon="home" text="Início" navigation={navigation} screen="Inicio" routeName={route.name} />
      <NavItem icon="car" text="Carros" navigation={navigation} screen="Carros" routeName={route.name} />
      <NavItem icon="users" text="Membros" navigation={navigation} screen="Membros" routeName={route.name} />
      <NavItem icon="sign-out" text="Sair" navigation={navigation} screen="Login" routeName={route.name} />
    </View>
  );
};

interface NavItemProps {
  icon: string;
  text: string;
  navigation: any;
  screen: string;
  routeName: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, navigation, screen, routeName }) => {
  const isActive = routeName === screen; // Verifica se a tela está ativa
  const color = isActive ? "#FFF" : "#38B6FF"; // Branco se estiver ativo, azul caso contrário

  return (
    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate(screen)}>
      <Icon name={icon} size={width * 0.065} color={color} />
      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.1,
    backgroundColor: '#191919',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    borderTopWidth: width * 0.007,
    borderTopColor: '#38B6FF',
  },
  navItem: {
    alignItems: 'center',
    marginTop: width * 0.02,
  },
  text: {
    fontSize: width * 0.03,
    marginTop: 4,
  },
});

export default Navbar;
