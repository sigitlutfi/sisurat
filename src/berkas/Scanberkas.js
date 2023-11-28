/* eslint-disable prettier/prettier */
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
import {
  Dimensions,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
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

  const handleActionButtonPress = () => {
    Alert.alert(
      'Info',
      'Apakah Anda ingin mengirim kode tiket Anda?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => {
            console.log('Sending ticket codes:', ticketCodes);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <NativeBaseProvider>
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <QRCodeScanner
          onRead={v => console.log(v)}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <VStack justifyContent="center">
              <Text style={styles.centerText}>
                <Text style={styles.textBold}>Mohon arahkan ke QR Code</Text>
              </Text>
            </VStack>
          }
          cameraStyle={{
            width: 300,
            height: 300,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />

        <VStack space={4}>
          <Heading>Atau gunakan Kode Tiket</Heading>
          {ticketCodes.map((code, index) => (
            <Input
              variant={'filled'}
              borderRadius={'full'}
              placeholder={`Masukkan Kode Tiket`}
              onChangeText={text => handleTicketCodeChange(text, index)}
              value={code}
            />
          ))}
          <Button
            onPress={handleActionButtonPress}
            bg={'#e81c4c'}
            borderRadius={'full'}>
            Kirim
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 24,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#777',
  },
  buttonText: {
    fontSize: 16,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
