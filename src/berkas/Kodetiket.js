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
    FlatList,
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
  } from 'native-base';
  import React, {useCallback, useEffect, useState} from 'react';
  import {Dimensions, Linking, TouchableOpacity} from 'react-native';
  import AuthContext from '../../AuthContext';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {ImageSlider} from 'react-native-image-slider-banner';
  
  import {Get, Post} from '../common/Req';
  import {LoadMoreFlatlist} from 'react-native-load-more-flatlist';
  import axios from 'axios';
  import {useFocusEffect} from '@react-navigation/native';
  import {SliderBox} from 'react-native-image-slider-box';
  import moment from 'moment';
  import 'moment/locale/id';
  import MonthPicker from 'react-native-month-year-picker';
  import Header from '../common/Header';
  import QRCodeScanner from 'react-native-qrcode-scanner';
  import {RNCamera} from 'react-native-camera';
  
  moment.locale('id');
  
  export default function Scanberkas({route, navigation}) {
    const {conf, user} = route.params;

    const {signOut} = React.useContext(AuthContext);
  
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const showPicker = useCallback(value => setShow(value), []);
    const [filtershow, setFiltershow] = useState(true);
    const [filter, setFilter] = useState({
      tanggal: null,
      berkas: null,
      status: null,
    });
    const [as, setAs] = useState(false);
    const [dataas, setDataas] = useState(null);
    console.log(filter);
    const onSuccess = e => {
      //Linking.openURL(e.data).catch(err =>
      console.log(e);
    };
  const [ticketCodes, setTicketCodes] = useState(['']); // State untuk kode tiket

  const handleTicketCodeChange = (text, index) => {
    const newCodes = [...ticketCodes];
    newCodes[index] = text;
    setTicketCodes(newCodes);
  };
  

  const handleSubmit = () => {
    // Handle logic when the "Submit" button is pressed
    // Misalnya, Anda dapat mengirim kode tiket ke server di sini
    console.log('Kode Tiket yang Diinput:', ticketCodes);
  };

  return (
    <NativeBaseProvider>
      <Header tit="Kode Tiket" nv={navigation} conf={conf} />
  
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <HStack>
          <Heading>Masukkan Kode Tiket</Heading>
        </HStack>
        {ticketCodes.map((code, index) => (
          <Box
            key={index}
            bg="white"
            borderRadius="md"
            shadow={2}
            p={2}
            mt={2}
            borderColor="gray.300"
            borderWidth={1}
          >
            <Input
              placeholder={`Masukkan Kode Tiket`}
              onChangeText={(text) => handleTicketCodeChange(text, index)}
              value={code}
            />
          </Box>
        ))}
        <Button onPress={handleSubmit} borderRadius={'full'} mt={4} colorScheme="teal">
          Submit
        </Button>
      </Box>
    </NativeBaseProvider>
  );
  
}