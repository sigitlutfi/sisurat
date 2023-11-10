/* eslint-disable prettier/prettier */
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
  const { conf, user } = route.params;
  const [data, setData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [keterangan, setKeterangan] = useState('');

  const [idPegawai, setIdPegawai] = useState('');
const [username, setUsername] = useState('');

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


  const handleSearch = () => {
    const results = data.filter((item) =>
      Object.values(item).some((value) => value.includes(searchKeyword))
    );
    setSearchResults(results);
    setShowSearchModal(true);
  };

  const handleResultClick = (result) => {
    navigation.navigate('Listdisposisi', { user: result });
    setShowSearchModal(false); 
  };
  const sendNotification = () => {
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
    }, 5000); 
  };
  {isSuccessMessageVisible && (
    <Text textAlign="center" color="green.500" fontWeight="bold" mt={2}>
      Selamat, data Anda berhasil dikirim!
    </Text>
  )}

  return (
    <NativeBaseProvider>
      <Header tit="Disposisi" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box p={4} bg={'white'} borderRadius={'3xl'}>
          <HStack space={4}>
            <Input
              flex={1}
              variant={'rounded'}
              value={searchKeyword}
              onChangeText={(text) => setSearchKeyword(text)}
            />
            <Pressable w={12} h={12} onPress={handleSearch}>
              <Center flex={1} bg={conf.color} borderRadius={'full'}>
                <Icon
                  color="white"
                  size={6}
                  as={MaterialCommunityIcons}
                  name="magnify"
                />
              </Center>
            </Pressable >
          </HStack>
          <Box bg="gray.100" p={4} borderRadius={8}>
  <Text fontWeight="bold" mb={2}>
    Pilih Nama
  </Text>
  <Text fontWeight="bold" fontSize={24}>
    {user.username}
  </Text>
</Box>
<Box bg="gray.100" p={4} borderRadius={8}>
  <Text fontWeight="bold" mb={2}>
    Keterangan
  </Text>
  <Box borderWidth={1} borderColor="gray.300" shadow={2}>
    <Input
      variant="filled"
      placeholder="Masukkan keterangan"
      value={keterangan}
      onChangeText={(text) => setKeterangan(text)}
    />
  </Box>
</Box>
         <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)}>
          <Modal.Content>
            <Modal.Header>Pilih Disposisi</Modal.Header>
            <Modal.Body>
              {searchResults.map((result, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleResultClick(result)}
                  _pressed={{ bg: 'gray.200' }}
                  mb={2}
                  p={2}
                >
                  <Text>
                    <Text fontWeight="bold"></Text> {result.username}
                  </Text>
                  {/* Add other user information here as needed */}
                </Pressable>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setShowSearchModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Button
  borderRadius={'full'}
  marginTop={4}
  bg={conf.color}
  onPress={sendNotification}
>
  Kirim
</Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
