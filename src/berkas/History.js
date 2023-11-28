import React, {useEffect, useState} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import DashedLine from 'react-native-dashed-line';

moment.locale('id');

export default function Daftarberkas({route, navigation}) {
  const {conf, user, tiket_id} = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch disposisi data using Axios and set it in the 'data' state
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/get_history_surat.php',
      headers: {
        tiket_id: tiket_id,
      },
    })
      .then(response => {
        console.log(response);
        if (response.data.data !== undefined) {
          setData(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <NativeBaseProvider>
      <Stack>
        <Box bg={conf.color ? conf.color : 'red.400'}>
          <HStack
            px={4}
            alignItems={'center'}
            h={16}
            justifyContent={'space-between'}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                size={'2xl'}
                color="white"
                as={MaterialCommunityIcons}
                name={'arrow-left'}
              />
            </TouchableOpacity>

            <Heading color={'white'} ml={4} maxWidth={300} numberOfLines={1}>
              History
            </Heading>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled>
              <Icon
                size={'2xl'}
                color={conf.color}
                as={MaterialCommunityIcons}
                name={'arrow-left'}
              />
            </TouchableOpacity>
          </HStack>
        </Box>
        <Box h={8} bg={conf.color} />
        <Box h={8} bg={'white'} mt={-8} borderTopRadius={'full'} />
      </Stack>
      <Box bg={'white'} flex={1} px={4} pb={4} br>
        <Box>
          <ScrollView>
            {data.map((item, index) => (
              <View key={index}>
                <Box flexDirection="row">
                  <Box width={24}>
                    <Text>{moment(item.datetime).format('HH:mm')}</Text>
                    <Text fontSize={10}>
                      {moment(item.waktu_terima).format('DD MMMM YYYY')}
                    </Text>
                  </Box>
                  <Box flexDirection="row" flex={1} ml={2}>
                    <Center ml={4} mr={8} h={120}>
                      {index == 0 ? (
                        <DashedLine
                          dashLength={3}
                          style={{
                            width: 1,
                            height: 60,
                            position: 'absolute',
                            bottom: 0,
                          }}
                          axis="vertical"
                        />
                      ) : index == data.length - 1 ? (
                        <DashedLine
                          dashLength={3}
                          style={{
                            width: 1,
                            height: 60,
                            position: 'absolute',
                            top: 0,
                          }}
                          axis="vertical"
                        />
                      ) : (
                        <DashedLine
                          dashLength={3}
                          style={{width: 1, position: 'absolute', height: 120}}
                          axis="vertical"
                        />
                      )}
                      <Avatar
                        position={'absolute'}
                        top={0}
                        source={{
                          uri:
                            'https://xsgames.co/randomusers/assets/avatars/male/' +
                            parseInt(index + 1) +
                            '.jpg',
                        }}
                      />
                    </Center>
                    <Box ml={2} w={200}>
                      <Text bold>{item.nama_pegawai_to}</Text>
                      <Text numberOfLines={2}>
                        Keterangan: {item.keterangan}
                      </Text>
                      <Text>
                        Status:{' '}
                        {item.status == 0
                          ? 'BELUM DIBACA'
                          : item.status == 1
                          ? 'DIBACA'
                          : 'DIARSIPKAN'}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </View>
            ))}
          </ScrollView>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
