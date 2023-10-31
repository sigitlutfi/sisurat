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
  return (
    <NativeBaseProvider>
      {/* <Header tit="Daftar Berkas" nv={navigation} conf={conf} /> */}
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
      <Pressable
          onPress={() => navigation.navigate('Scanfile')}
          bg={'white'}
          elevation={5}
          borderRadius={'2xl'}
          mt={4}
          py={4}
          flex={1}
          alignItems={'center'}>
          <Image
            size={'80%'}
            resizeMode="contain"
            alt=""
            source={require('../../assets/scan.jpg')}
          />

          <Text bold color="black" fontSize={26}>
            SCAN BERKAS
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Kodetiket')}
          bg={'white'}
          borderRadius={'2xl'}
          mt={4}
          elevation={3}
          py={4}
          flex={1}
          alignItems={'center'}>
          <Image
            size={'80%'}
            source={require('../../assets/tiket.jpg')}
            resizeMode="contain"
            alt=""
          />

          <Text bold color="black" fontSize={26}>
            KODE TIKET BERKAS
          </Text>
        </Pressable>
        {/* <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
        /> */}
      </Box>
    </NativeBaseProvider>
  );
}
