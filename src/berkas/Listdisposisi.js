/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View,  FlatList, TouchableOpacity,Alert, } from 'react-native';
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
  Text,
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
import { useNavigation } from '@react-navigation/native';

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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isNameFilled, setIsNameFilled] = useState(false);
const [isKeteranganFilled, setIsKeteranganFilled] = useState(false);


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
    const isUserSelected = selectedUsers.some((user) => user.id === result.id);

    if (!isUserSelected) {
      setSelectedUsers([...selectedUsers, result]);
    } else {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== result.id));
    }
    setShowSearchModal(false);
    setIsNameFilled(true);
  };
  const handleKeteranganChange = (text) => {
    setKeterangan(text);
    setIsKeteranganFilled(!!text); 
  };

  const sendNotification = () => {
    if (!selectedUsers.length || !keterangan) {
      Alert.alert('Error', 'Harap isi nama dan keterangan sebelum mengirim disposisi.');
      return;
    }
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mendisposisikan berkas anda?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Iya',
          onPress: () => {
            navigation.navigate('Disposisiberhasil');
            setIsSuccessMessageVisible(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <NativeBaseProvider>
      <Header tit="Disposisi" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box p={4} bg={'white'} borderRadius={'3xl'}>
          <HStack space={4}>
            <Select
              flex={1}
              variant={'rounded'}
              placeholder="Pilih tujuan disposisi"
              onValueChange={(value) => handleResultClick(value)}
            >
              {data.map((result, index) => (
                <Select.Item
                  key={index}
                  label={
                    <HStack space={2} alignItems={'center'}>
                      <Avatar source={{ uri: result.profilePicture }} size="md" />
                      <Text color="black" bold>{result.username}</Text>
                    </HStack>
                  }
                  value={result}
                />
              ))}
            </Select>
          </HStack>
          <Box bg="gray.100" p={4} borderRadius={8}>
            <Text fontWeight="bold" mb={2}>
              Pilih Nama
            </Text>
            {selectedUsers.map((user) => (
              <Text key={user.id} fontWeight="bold" fontSize={24} mb={2}>
                {user.username}
              </Text>
            ))}
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
                    
                      <Text fontWeight="bold" color="black"> {result.username}</Text>
                   
                  </Pressable>
                ))}
              </Modal.Body>
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
