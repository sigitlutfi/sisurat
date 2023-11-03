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
    // Perform a search based on the searchKeyword and update searchResults state
    const results = data.filter((item) =>
      Object.values(item).some((value) => value.includes(searchKeyword))
    );
    setSearchResults(results);
    setShowSearchModal(true);
  };

  const handleResultClick = (result) => {
    // Add navigation logic here to navigate to the front page with user data
    navigation.navigate('Listdisposisi', { user: result });
    setShowSearchModal(false); // Tutup modal pencarian setelah mengklik hasil
  };
  const sendNotification = () => {
    // Your logic to send the notification goes here
  
    // Show the success message
    setIsSuccessMessageVisible(true);
  
    // You can reset the success message after a certain time, if needed
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
    }, 5000); // Hide the success message after 5 seconds (adjust the duration as needed)
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
          <HStack justifyContent={'space-between'}>
          <Stack>
            <View>
              <Text>Username: {user.username}</Text>
              <Text>Nama: {user.name}</Text>
              <Text>Hak Akses: {user.hak_akses}</Text>
              <Text>Nomor HP: {user.nomer_hp}</Text>
            </View>
          </Stack>
        </HStack>
         {/* Modal for displaying search results */}
         <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)}>
          <Modal.Content>
            <Modal.Header>Pegawai Search Results</Modal.Header>
            <Modal.Body>
              {searchResults.map((result, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleResultClick(result)}
                  _pressed={{ bg: 'gray.200' }}
                  mb={2}
                  p={2}
                  borderWidth={1}
                  borderRadius={8}
                >
                  <Text>
                    <Text fontWeight="bold">Username:</Text> {result.username}
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
