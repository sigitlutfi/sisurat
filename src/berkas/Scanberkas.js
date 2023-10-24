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
      <Actionsheet isOpen={as} onClose={() => setAs(false)}>
        <Actionsheet.Content>
          <Stack w={'full'} px={4} pb={12}>
            <Heading>Filter</Heading>
            <Text mt={6}>Tanggal</Text>
            <Button
              onPress={() => {
                const f = filter;
                f.tanggal = '11 12 2023';
                setFilter(f);
              }}>
              Pilih tanggal
            </Button>

            <Text mt={4}>Berkas</Text>
            <Select
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Pilih"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                const f = filter;
                f.berkas = itemValue;
                setFilter(f);
              }}>
              <Select.Item label="Semua berkas" value={1} />
              <Select.Item label="Berkas saya" value={2} />
            </Select>
            <Text mt={4}>Status berkas</Text>
            <Select
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Pilih"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                const f = filter;
                f.status = itemValue;
                setFilter(f);
              }}>
              <Select.Item label="Diterima" value={1} />
              <Select.Item label="Ditolak" value={2} />
              <Select.Item label="Selesai" value={3} />
            </Select>
            <Button
              onPress={() =>
                setFilter({tanggal: null, berkas: null, status: null})
              }>
              HAPUS FILTER
            </Button>
          </Stack>
        </Actionsheet.Content>
      </Actionsheet>

      <Header tit="Daftar Berkas" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
        />
      </Box>
    </NativeBaseProvider>
  );
}
