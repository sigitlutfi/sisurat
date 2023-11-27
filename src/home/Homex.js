import {
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
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, TouchableOpacity} from 'react-native';
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

moment.locale('id');

export default function Homex({route, navigation}) {
  const {conf, user} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const [img, setImg] = useState([
    {
      url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
      caption: 'Slide 1',
    },
    {
      url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
      caption: 'Slide 2',
    },
    {
      url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
      caption: 'Slide 3',
    },
  ]);
  const [dt, setDt] = useState(new Date().toLocaleString());

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);
  const [mkeluar, setMkeluar] = useState(false);

  const {gantiskpd} = React.useContext(AuthContext);
  const w = Dimensions.get('screen').width;

  return (
    <NativeBaseProvider>
      <Box bg={'gray.200'} flex={1} p={4}>
        <Box bg={'white'} borderRadius={'2xl'} p={4} elevation={5}>
          <HStack>
            <Image
              source={
                user.foto == null
                  ? require('../../assets/user.png')
                  : {uri: user.foto}
              }
              alt="UF"
              h={81}
              w={81}
              borderRadius={'full'}
              bg={'gray.400'}
            />
            <Stack ml={4}>
              <Text>Selamat Datang</Text>
              <Heading color={conf.color} mb={2}>
                {user.name}
              </Heading>
              <Text bold>Di Aplikasi Lacak Berkas</Text>
              <Text bold>{conf.daerah}</Text>
            </Stack>
          </HStack>
          <Divider my={2} />
          <HStack>
            <Stack w={120}>
              <Text bold fontSize={16}>
                Semua Berkas
              </Text>
              <Text bold fontSize={16}>
                Berkas Anda
              </Text>
            </Stack>
            <Stack>
              <Text bold fontSize={16}>
                : 120
              </Text>
              <Text bold fontSize={16}>
                : 8
              </Text>
            </Stack>
          </HStack>
        </Box>

        <Pressable
          onPress={() => navigation.navigate('Tambahberkas')}
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
            source={require('../../assets/entr.png')}
          />

          <Text bold color="black" fontSize={26}>
            TAMBAH BERKAS
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Daftarberkas')}
          bg={'white'}
          borderRadius={'2xl'}
          mt={4}
          elevation={3}
          py={4}
          flex={1}
          alignItems={'center'}>
          <Image
            size={'80%'}
            source={require('../../assets/list.png')}
            resizeMode="contain"
            alt=""
          />

          <Text bold color="black" fontSize={26}>
            DAFTAR BERKAS
          </Text>
        </Pressable>
      </Box>
    </NativeBaseProvider>
  );
}
