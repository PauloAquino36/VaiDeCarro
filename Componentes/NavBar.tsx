import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <NavItem icon="home" text="Início" navigation={navigation} />
      <NavItem icon="car" text="Carros" navigation={navigation} />
      <NavItem icon="users" text="Membros" navigation={navigation} />
      <NavItem icon="sign-out" text="Sair" navigation={navigation} />
    </View>
  );
};

interface NavItemProps {
  icon: string;
  text: string;
  navigation: any;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, navigation }) => (
  <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate(text)}>
    <Icon name={icon} size={width*0.065} color="#38B6FF" />
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.085,
    backgroundColor: '#191919',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    borderTopWidth: width*0.007,
    borderTopColor: '#38B6FF',
  },
  navItem: {
    alignItems: 'center',
    marginTop: width*0.02,
  },
  text: {
    color: '#fff',
    fontSize: width*0.03,
    marginTop: 4,
  },
});

export default Navbar;
