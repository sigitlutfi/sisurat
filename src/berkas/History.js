import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import {
  Actionsheet,
  Avatar,
  Box,
  Button,
  Center,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Select,
  Spinner,
  Stack,
  Toast,
  VStack,
  Link,
} from 'native-base';
import moment from 'moment';
import 'moment/locale/id';
import Header from '../common/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';

moment.locale('id');


export default function Daftarberkas({ route, navigation }) {
  const { conf, user, tiket_id } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch disposisi data using Axios and set it in the 'data' state
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/get_history_surat.php',
      headers: {
        tiket_id: tiket_id,
      },
    })
      .then((response) => { console.log(response)
        if (response.data.data !== undefined) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const timelineData = [
    {
      datetime: '2023-11-06T09:00:00',
      title: 'Dokumen Diterima',
      status: 'Diterima',
    },
    {
      datetime: '2023-11-06T10:45:00',
      title: 'Dokumen Sedang Ditangan',
      status: 'Dalam Pegangan',
    },
    {
      datetime: '2023-11-07T12:00:00',
      title: 'Dokumen Sedang Ditangan',
      status: 'Dalam Pegangan',
    },
    {
      datetime: '2023-11-07T14:00:00',
      title: 'Dokumen Sedang Ditangan',
      status: 'Selesai',
    },
  ];

  

  return (
    <NativeBaseProvider>
      <Header tit="History" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box>
          {timelineData.map((item, index) => (
            <View key={index}>
              <Box flexDirection="row" alignItems="center">
                <Box width={24}>
                  <Text>{moment(item.datetime).format('HH:mm')}</Text>
                  <Divider orientation="vertical" h={6} mx={2} borderColor="gray.400" />
                </Box>
                <Box flexDirection="row" alignItems="center" flex={1}>
                  <Avatar
                    size="xl"
                    source={{
                      uri: user.profilePicture,
                    }}
                  />
                  <Box ml={2}>
                    <Text fontSize="lg" fontWeight="bold">
                      {user.name}
                    </Text>
                    <Text fontSize="sm">{moment(item.waktu_terima).format('DD MMMM YYYY')}</Text>
                    <Text>ID History: {item.id_history}</Text>
                    <Text>ID Surat: {item.id_surat}</Text>
                    <Text>Tiket ID: {item.tiket_id}</Text>
                    <Text>ID Pegawai Form: {item.id_pegawai_form}</Text>
                    <Text>Nama Pegawai Form: {item.nama_pegawai_form}</Text>
                    <Text>ID Pegawai: {item.id_pegawai}</Text>
                    <Text>Nama Pegawai To: {item.nama_pegawai_to}</Text>
                    <Text>Keterangan: {item.keterangan}</Text>
                    <Text>Status: {item.status}</Text>
                  </Box>
                </Box>
              </Box>
              <Box flexDirection="row" alignItems="center" mt={2}>
                <Box width={24} />
              </Box>
              {index < timelineData.length - 1 && <Divider my={2} borderColor="gray.400" />}
            </View>
          ))}
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
