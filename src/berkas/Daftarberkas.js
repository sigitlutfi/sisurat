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
  const [data, setData] = useState([
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 1,
    },
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 2,
    },
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 1,
    },
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 1,
    },
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 1,
    },
    {
      nama_surat: 'Ini nama surat',
      tanggal_diterima: '11 12 2023',
      tanggal_dokumen: '10 10 2023',
      agenda: 'Ini agenda',
      disposisi: 2,
      status: 3,
    },
  ]);
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
            <Text bold>Total : 120</Text>

            <Text bold>10/120</Text>
          </HStack>
          <FlatList
            data={data}
            renderItem={({item, index}) => (
              <Pressable px={4} onPress={() => alert('a')} key={index}>
                <HStack justifyContent={'space-between'}>
                  <Stack>
                    <Heading>{item.nama_surat + index}</Heading>

                    <HStack>
                      <Text w={32}>Tanggal Diterima</Text>
                      <Text>: {item.tanggal_diterima}</Text>
                    </HStack>
                    <HStack>
                      <Text w={32}>Tanggal Dokumen</Text>
                      <Text>: {item.tanggal_dokumen}</Text>
                    </HStack>
                    <HStack>
                      <Text w={32}>Agenda</Text>
                      <Text>: {item.agenda + index}</Text>
                    </HStack>
                  </Stack>
                  <HStack>
                    <Stack space={2}>
                      <Center
                        w={24}
                        bg={'blue.600'}
                        py={1}
                        borderRadius={'full'}>
                        <Text fontSize={12} color="white">
                          DISPOSISI {item.disposisi}
                        </Text>
                      </Center>
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
