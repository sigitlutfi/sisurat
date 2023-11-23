import React, { useEffect, useState } from 'react';
import { View,  FlatList, TouchableOpacity, Alert, } from 'react-native';
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
  

  const handleArsipButton = () => {
    // Display an alert when the "Arsip" button is pressed
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mengarsipkan berkas ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => {
            console.log('Berkas diarsipkan');
          },
        },
      ],
    );
  };

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
            {[
              { label: 'Nama Dokumen', value: item.nama_dokumen, divider: ':' },
              { label: 'Agenda', value: item.agenda, divider: ':' },
              { label: 'Nama Pengirim', value: item.nama_pengirim, divider: ':' },
              { label: 'Perihal', value: item.perihal, divider: ':' },
              { label: 'Ringkasan Dokumen', value: item.ringkasan_dokumen, divider: ':' },
              { label: 'Tanggal Diterima', value: formatTanggal(item.tanggal_diterima), divider: ':' },
              { label: 'Tanggal Dokumen', value: formatTanggal(item.tanggal_dokumen) , divider: ':'},
              { label: 'Tanggal Agenda', value: formatTanggal(item.tanggal_agenda), divider: ':' },
              {
                label: 'Lampiran',
                value: (
                  <TouchableOpacity onPress={() => openAttachment(item.lampiran)}>
                    <Text bold>{item.lampiran}</Text>
                  </TouchableOpacity>
                ),
                divider: ':'
              },
            ].map((item, index) => (
              <HStack key={index} width="100%">
                <Text bold width={'40%'}>{item.label}</Text>
                <Text bold width={'5%'}>{item.divider}</Text>
                <Text maxWidth={'55%'}>{item.value}</Text>
              </HStack>
            ))}
            <Divider my={2} />
          </VStack>
        </Box>
        <Box px={4} pb={4}>
          <HStack spacing={4} >
          <VStack alignItems="center">
            <Button
              marginTop={2}
              marginRight={2}
              bg={'cyan.800'}
              borderRadius={'full'}
              onPress={() => {
                navigation.navigate('History');
              }}>
              <Icon name="history" as={MaterialCommunityIcons} size={5} color="white" />
            </Button>
            <Text  fontWeight="bold"  marginTop={2}>History</Text>
            </VStack>
            <VStack alignItems="center">
            <Button
              marginTop={2}
              marginRight={2}
              bg={'orange.600'}
              borderRadius={'full'}
              onPress={() => {
                navigation.navigate('Listdisposisi');
              }}>
              <Icon name="file-send-outline" as={MaterialCommunityIcons} size={5} color="white" />
            </Button>
            <Text  fontWeight="bold"  marginTop={2}>Disposisi</Text>
            </VStack>
            <VStack alignItems="center">
            <Button
              marginTop={2}
              marginRight={2}
              bg={'red.600'}
              borderRadius={'full'}
              onPress={handleArsipButton}>
              <Icon name="archive-lock-outline" as={MaterialCommunityIcons} size={5} color="white" />
            </Button>
            <Text  fontWeight="bold"  marginTop={2}>Arsip</Text>
            </VStack>
          </HStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}