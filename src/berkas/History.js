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


  return (
    <NativeBaseProvider>
      <Header tit="History" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box>
          <ScrollView>
          {data.map((item, index) => (
            <View key={index}>
              <Box flexDirection="row" alignItems="center">
                <Box width={24}>
                  <Text>{moment(item.datetime).format('HH:mm')}</Text>
                  <Text fontSize="sm">{moment(item.waktu_terima).format('DD MMMM YYYY')}</Text>
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
                    <Text>Disposisi dari: {item.nama_pegawai_form}</Text>
                    <Text>Kepada: {item.nama_pegawai_to}</Text>
                    <Text>Keterangan: {item.keterangan}</Text>
                    <Text>Status: {item.status==0?'BELUM DIBACA':item.status==1?'DIBACA':'DIARSIPKAN'}</Text>
                  </Box>
                </Box>
              </Box>
              <Box flexDirection="row" alignItems="center" mt={2}>
                <Box width={24} />
              </Box>
              {index < data.length - 1 && <Divider my={2}  />}
            </View>
          ))}
          </ScrollView>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
