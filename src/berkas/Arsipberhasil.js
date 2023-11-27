import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';


const FileAddedScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/close_history_surat.php',
      headers: {
        p_keterangan: 'Berkas sdh saya arsipkan dan close',
      },
    })
      .then(v => {
        if (v.data.data != undefined) {
          setData(v.data.data);
        }
        console.log(v);
      })
      .catch(e => {
        console.log(e);
      });
  });

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={100} color="green" />
      <Text style={styles.text}>Berkas berhasil diarsipkan</Text>
      {data && (
        <View>
          {data.map((item, index) => (
            <Text key={index}>{item.p_keterangan}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          
        }}
      >
        <Text style={styles.buttonText}>Lihat arsipan</Text>
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
