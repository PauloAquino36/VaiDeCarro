import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UploadFoto = () => {
  const [foto, setFoto] = useState<string | null>(null);

  const escolherImagem = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri); // Define o caminho da imagem
    }
  };

  return (
    <View>
      <Button title="Escolher Foto" onPress={escolherImagem} />
      {foto && <Image source={{ uri: foto }} style={{ width: 100, height: 100 }} />}
    </View>
  );
};

export default UploadFoto;
