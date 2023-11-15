import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FileAddedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={100} color="green" />
      <Text style={styles.text}>Berkas berhasil didisposisikan</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Tambahkan logika untuk menavigasi ke daftar berkas di sini
        }}
      >
        <Text style={styles.buttonText}>Lihat Disposisi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      
    </View>
  );
};
const buttonWidth = 200;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#e81c4c",
    width: buttonWidth,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FileAddedScreen;
