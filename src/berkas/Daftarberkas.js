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

moment.locale('id');

export default function Daftarberkas({route, navigation}) {
  const {conf, user} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mdetail, setMdetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const showPicker = useCallback(value => setShow(value), []);
  const [filtershow, setFiltershow] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [filter, setFilter] = useState({
    tanggal: null,
    berkas: null,
    status: null,
  });
  const [as, setAs] = useState(false);
  const [dataas, setDataas] = useState(null);

  const showDetail = item => {
    setDetailData(item);
    setMdetail(true);
  };

  function formatTanggal(tanggal) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
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

    {mdetail && (
    <Modal isOpen={mdetail} onClose={() => setMdetail(false)}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Detail Berkas</Modal.Header>
          <Modal.Body>
            {detailData && (
              <VStack space={2}>
                <HStack>
                  <Text bold>Nama Dokumen: </Text>
                </HStack>
                <Text>{detailData.nama_dokumen}</Text>
                <HStack>
                  <Text bold>Agenda: </Text>
                  <Text>{detailData.agenda}</Text>
                </HStack>
                <HStack>
                  <Text bold>Nama Pengirim: </Text>
                  <Text>{detailData.nama_pengirim}</Text>
                </HStack>
                <HStack>
                  <Text bold>Perihal: </Text>
                  <Text>{detailData.perihal}</Text>
                </HStack>
                <HStack>
                  <Text bold>Ringkasan Dokumen: </Text>
                </HStack>
                <Text>{detailData.ringkasan_dokumen}</Text>
                <HStack>
                  <Text bold>Tanggal Diterima: </Text>
                  <Text>{formatTanggal(detailData.tanggal_diterima)}</Text>
                </HStack>
                <HStack>
                  <Text bold>Tanggal Dokumen: </Text>
                  <Text>{formatTanggal(detailData.tanggal_dokumen)}</Text>
                </HStack>
                <HStack>
                  <Text bold>Tanggal Agenda: </Text>
                  <Text>{formatTanggal(detailData.tanggal_agenda || 'Tidak ada')}</Text>
                </HStack>
                <HStack>
                  <Text bold>Lampiran: </Text>
                  <Text color={'blue.500'}>
                    <Link href={detailData.lampiran.path} isExternal>
                      Download Berkas
                    </Link>
                  </Text>
                </HStack>
                <Button 
                  onPress={() => setMdetail(false)}
                  bg={conf.color}
                  >Tutup</Button>
              </VStack>
            )}
          </Modal.Body>
      </Modal.Content>
    </Modal>
    )}


      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          maximumDate={new Date()}
          cancelButton="Batal"
          okButton="Ok"
          locale="id"
        />
      )}

      <Header tit="Daftar Berkas" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box p={4} bg={'white'} borderRadius={'3xl'}>
          <HStack space={4}>
            <Input flex={1} variant={'rounded'} />
            <Pressable w={12} h={12}>
              <Center flex={1} bg={conf.color} borderRadius={'full'}>
                <Icon
                  color="white"
                  size={6}
                  as={MaterialCommunityIcons}
                  name="magnify"
                />
              </Center>
            </Pressable>
          </HStack>
          <Button
            borderRadius={'full'}
            marginTop={4}
            bg={conf.color}
            onPress={() => setAs(true)}>
            FILTER
          </Button>

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
                  11 12 2023
                </Text>
              </Stack>
            )}
            {filter.berkas !== null && (
              <Stack
                alignItems={'center'}
                space={2}
                mr={4}
                bg={conf.color}
                borderRadius={'full'}
                px={4}
                py={2}>
                <Text color={'white'} bold>
                  Berkas Saya
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
                  Diterima
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
            renderItem={({item, index}) => (
              <Pressable px={4} onPress={() => showDetail(item)} key={index}>
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
                      </Stack>
                      <HStack>
                    <Stack space={2}>
                    <Button
                      w={24}
                      bg={'cyan.600'}
                      py={1}
                      borderRadius={'full'}
                      onPress={() => {
                        navigation.navigate('Listdisposisi'); 
                      }}>
                      <Text fontSize={12} color="white">
                        DISPOSISI {item.disposisi}
                      </Text>
                    </Button>
                      <Center
                        w={24}
                        bg={
                          item.status == 1
                            ? 'orange.600'
                            : item.status == 2
                            ? 'red.600'
                            : 'green.600'
                        }
                        py={1}
                        borderRadius={'full'}>
                        <Text fontSize={12} color="white">
                          {item.status == 1
                            ? 'DITERIMA'
                            : item.status == 2
                            ? 'DITOLAK'
                            : 'SELESAI'}
                        </Text>
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