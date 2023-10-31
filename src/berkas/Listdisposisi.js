import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeBaseProvider, Box, Center } from 'native-base';
import moment from 'moment';
import 'moment/locale/id';
import Header from '../common/Header';

moment.locale('id');

export default function Daftarberkas({ route, navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch disposisi data using Axios and set it in the 'data' state
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/list_pegawai_disposisi.php',
      headers: {
        id_pegawai: '1',
      },
    })
      .then((response) => {
        if (response.data.data !== undefined) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Function to render each item in the disposisi list
  const renderDisposisiItem = ({ item }) => {
    return (
      <NativeBaseProvider>
      {/* <Header tit="List Disposisi" nv={navigation} conf={conf} /> */}
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
      <TouchableOpacity onPress={() => showDetail(item)}>
        <Box
          borderWidth={1}
          borderColor="gray.300"
          padding={4}
          margin={2}
        >
          <Text>ID Pegawai: {item.idPegawai}</Text>
          <Text>Username: {item.username}</Text>
          <Text>Nama: {item.nama}</Text>
          <Text>Hak Akses: {item.hakAkses}</Text>
          <Text>No HP: {item.noHp}</Text>
        </Box>
      </TouchableOpacity>
      </Box>
      </NativeBaseProvider>
    );
  };

  // Function to show disposisi detail
  const showDetail = (item) => {
    // You can implement this function to show disposisi details as per your requirements.
    // For example, you can navigate to a detail screen or display a modal with more information.
    // You can use 'item' to access the selected disposisi's data.
  };

  return (
    <NativeBaseProvider>
      <View>
        <Text>Disposisi List</Text>
        <FlatList
          data={data}
         // keyExtractor={(item) => item.id.toString()}
          renderItem={renderDisposisiItem}
        />
      </View>
    </NativeBaseProvider>
  );
}
