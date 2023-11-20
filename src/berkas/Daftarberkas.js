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
  Link,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

moment.locale('id');

export default function Daftarberkas({route, navigation}) {
  const {conf, user} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const [data, setData] = useState([]);
  const [dataBerkas, setDataBerkas ] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mdetail, setMdetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const showPicker = useCallback(value => setShow(value), []);
  const [filtershow, setFiltershow] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState({
    tanggal: null,
    nama: null,
    status: null,
  });
  const [as, setAs] = useState(false);
  const [dataas, setDataas] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const handleConfirm = (date) => {
    setDatePickerVisibility(false);
    setSelectedDate(date);
    const f = filter;
    f.tanggal = moment(date).format('DD MM YYYY'); 
    setFilter(f);
  };

  const showDetail = item => {
    setDetailData(item);
    setMdetail(true);
  };

  function formatTanggal(tanggal) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
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
  console.log(filter);
  return (
    <NativeBaseProvider>

      {/* Actionsheet untuk tampilan filter */}
      <Actionsheet isOpen={as} onClose={() => setAs(false)}>
        <Actionsheet.Content>
          <Stack w={'full'} px={4} pb={12}>
            <Heading>Filter</Heading>
            <Text mt={6}>Tanggal</Text>
            <Button onPress={() => setDatePickerVisibility(true)}>
        Pilih tanggal
      </Button>

            <Text mt={4}>Nama</Text>
            <Select
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Pilih"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue, itemIndex) => {
                const f = filter;
                f.nama = itemValue;
                setSelectedName(itemValue);
                setFilter(f);
              }}>
              {data.map((item, index) => (
                <Select.Item key={index} label={ item.nama_dokumen} value={item.nama_dokumen}/>
              ))}
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
              <Select.Item label="Dibaca" value={1} />
              <Select.Item label="Arsip" value={2} />
              <Select.Item label="Belumdibaca" value={3} />
            </Select>
            <Button
              onPress={() =>
                setFilter({tanggal: null, nama: null, status: null})
              }>
              HAPUS FILTER
            </Button>
          </Stack>
        </Actionsheet.Content>
      </Actionsheet>

      {isDatePickerVisible && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      )}

      <Header tit="Daftar Berkas" nv={navigation} conf={conf} />
      <Box mt={4} px={4}>
            <Button
              borderRadius={'full'}
              bg={conf.color}
              onPress={() => setAs(true)}
            >
              FILTER
            </Button>
          </Box>
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box p={4} bg={'white'} borderRadius={'3xl'}>

          <ScrollView horizontal mt={4}>
            {filter.tanggal !== null && (
              <Stack
                alignItems={'center'}
                space={2}
                mr={4}
                bg={conf.color}
                borderRadius={'full'}
                px={4}
                py={2}>
                <Text color={'white'} bold>
                {moment(selectedDate).format('DD MM YYYY')} 
                </Text>
              </Stack>
            )}
            {filter.nama !== null && (
              <Stack
                alignItems={'center'}
                space={2}
                mr={4}
                bg={conf.color}
                borderRadius={'full'}
                px={4}
                py={2}>
                <Text color={'white'} bold>
                {selectedName}
                </Text>
              </Stack>
            )}
            {filter.status !== null && (
              <Stack
                alignItems={'center'}
                space={2}
                mr={4}
                bg={conf.color}
                borderRadius={'full'}
                px={4}
                py={2}>
                <Text color={'white'} bold>
                {filter.status === 1 ? 'Dibaca' : filter.status === 2 ? 'Arsip' : 'Belumdibaca'}
                </Text>
              </Stack>
            )}
          </ScrollView>
        </Box>

        <Box p={4} bg={'white'} borderRadius={'3xl'} flex={1} mt={4}>
          <HStack justifyContent={'space-between'} px={4} mb={6}>
            <Text bold>Total : {data.length}</Text>

            <Text bold>10/120</Text>
          </HStack>
          <FlatList
            data={data}
            // data={data.filter((item) => filter.status === null || item.status === filter.status)}
            renderItem={({item, index}) => (
              <Pressable
                px={4}
                onPress={() => navigation.navigate('Detailberkas', { item })}
                key={index}
              >
                <HStack justifyContent={'space-between'}>
                  <Stack flex={1}>
                    <Heading>{item.nama_dokumen + index}</Heading>

                    <HStack>
                        <Text w={32}>Tanggal Diterima</Text>
                        <Text>: {formatTanggal(item.tanggal_diterima)}</Text>
                      </HStack>
                      <HStack>
                        <Text w={32}>Tanggal Dokumen</Text>
                        <Text>: {formatTanggal(item.tanggal_dokumen)}</Text>
                      </HStack>
                      <HStack>
                        <Text w={32}>Agenda</Text>
                        <Text>: {item.agenda}</Text>
                      </HStack>
                      
                      <HStack justifyContent={'space-between'} alignItems={'center'}>

                    <HStack>
                    <Button marginTop={4} marginRight={2}
                      bg={'cyan.800'}
                      // py={1}
                      borderRadius={'full'}
                      onPress={() => {
                        navigation.navigate('History'); 
                      }}>
                      <Icon
                        name="history" 
                        as={MaterialCommunityIcons}
                        size={5} 
                        color="white"
                      />
                    </Button>

                    <Button marginTop={4}
                      bg={'cyan.600'}
                      // py={1}
                      borderRadius={'full'}
                      onPress={() => {
                        navigation.navigate('Listdisposisi'); 
                      }}>
                      <Icon
                        name="file-send-outline" 
                        as={MaterialCommunityIcons}
                        size={5} 
                        color="white"
                      />
                    </Button>
                    </HStack>
                    <Text fontSize="xl" fontWeight="bold">{item.tiket_id}</Text>
                    </HStack>

                      </Stack>
                      <HStack>
                    <Stack space={2}>
                      <Center
                        w={12}
                        bg={
                          item.status === 1
                            ? 'blue'
                            : item.status === 2
                            ? 'gray'
                            : item.status === 3
                            ? 'orange'  
                            : 'green'
                        }
                        py={1}
                        borderRadius={'full'}
                        borderWidth={0} 
                        borderColor="transparent" 
                        >
                        {item.status == 1 ? (
                            <Icon  as={MaterialCommunityIcons} name="check-all" Size={5} color="blue" />
                          ) : item.status == 2 ? (
                            <Icon  as={MaterialCommunityIcons} name="archive-lock-outline" Size={5} color="gray" />
                          ) : item.status === 3 ? (
                            <Icon as={MaterialCommunityIcons} name="check" size={5} color="green" />
                          ) : null}
      
                      </Center>
                    </Stack>
                  </HStack>
                </HStack>
                <Divider mt={2} mb={4} />
              </Pressable>
            )}
          />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}