import React, { useEffect, useState } from 'react';
import { View,  FlatList, TouchableOpacity } from 'react-native';
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
  Text,
} from 'native-base';
import moment from 'moment';
import 'moment/locale/id';
import Header from '../common/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';

moment.locale('id');

export default function Detailberkas({ route, navigation }) {
  const { conf, user, item } = route.params;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [as, setAs] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [data, setData] = useState([]);
  const [mdetail, setMdetail] = useState(false);

  const showDetail = item => {
    setDetailData(item);
    setMdetail(true);
  };

  const formatTanggal = tanggal => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // Handle the picked document, e.g., update the state with the file information
      console.log(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Handle canceled action
      } else {
        // Handle other errors
        console.error(err);
      }
    }
  };
  const YourComponent = () => {
    // Assuming mdetail, setMdetail, and detailData are defined in your component's state or props
    const mdetail = true; // replace with your actual state
    const setMdetail = () => {}; // replace with your actual state setter function
    const detailData = {}; // replace with your actual data
  
    const conf = {
      color: 'your-color', // replace with your actual color
    };
  }

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/list_surat.php',
      headers: {
        id_pegawai: '1',
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
    <NativeBaseProvider>
      <Header tit="Detail Berkas" nv={navigation} conf={conf} />
      <ScrollView>
        <Box bg={'gray.200'} flex={1} px={4} pb={4} mt={4}>
          <VStack space={2} alignItems="flex-start">
            <Text bold>Nama Dokumen: {item.nama_dokumen}</Text>
            <Text bold>Agenda: {item.agenda}</Text>
            <Text bold>Nama Pengirim: {item.nama_pengirim}</Text>
            <Text bold>Perihal: {item.perihal}</Text>
            <Text bold>Ringkasan Dokumen: {item.ringkasan_dokumen}</Text>
            <Text bold>Tanggal Diterima: {formatTanggal(item.tanggal_diterima)}</Text>
            <Text bold>Tanggal Dokumen: {formatTanggal(item.tanggal_dokumen)}</Text>
            <Text bold>Tanggal Agenda: {formatTanggal(item.tanggal_agenda)}</Text>
            <Text bold>Lampiran: {item.lampiran}</Text>
            <Divider my={2} />
          </VStack>
        </Box>
        <Box px={4} pb={4}>
          <HStack spacing={4}>
            <Button
              marginTop={4}
              marginRight={2}
              bg={'cyan.800'}
              borderRadius={'full'}
              onPress={() => {
                navigation.navigate('History');
              }}>
              <Icon name="history" as={MaterialCommunityIcons} size={5} color="white" />
            </Button>
            <Button
              marginTop={4}
              bg={'cyan.600'}
              borderRadius={'full'}
              onPress={() => {
                navigation.navigate('Listdisposisi');
              }}>
              <Icon name="file-send-outline" as={MaterialCommunityIcons} size={5} color="white" />
            </Button>
          </HStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}