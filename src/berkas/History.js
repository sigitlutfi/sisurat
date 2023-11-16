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

  const timelineData = [
    {
      datetime: '2023-11-06T09:00:00',
      title: 'Dokumen Diterima',
      description: 'Oleh Pihak Resepsionis',
      status: 'Diterima',
      icon: 'check-circle',
    },
    {
      datetime: '2023-11-06T10:45:00',
      title: 'Dokumen Sedang Ditangan',
      description: 'Oleh Mas X',
      status: 'Dalam Pegangan',
      icon: 'check-circle',
    },
    {
      datetime: '2023-11-07T12:00:00',
      title: 'Dokumen Sedang Ditangan',
      description: 'Oleh Mas Y',
      status: 'Dalam Pegangan',
      icon: 'check-circle',
    },
    {
      datetime: '2023-11-07T14:00:00',
      title: 'Dokumen Sedang Ditangan',
      description: 'Oleh Mas Z',
      status: 'Selesai',
      icon: 'check-circle',
    },
  ];
  return (
    <NativeBaseProvider>
      <Header tit="History" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
        <Box>
          {timelineData.map((item, index) => (
            <View key={index}>
              <Box flexDirection="row" alignItems="center">
                <Box width={24}>
                  <Text>{moment(item.datetime).format('HH:mm')}</Text>
                  <Divider orientation="vertical" h={6} mx={2} borderColor="gray.400" />
                </Box>
                <Box flexDirection="row" alignItems="center" flex={1}>
                  <Avatar
                    size="xl"
                    source={{
                      uri: user.profilePicture,
                    }}
                  />
                  <Box ml={2}>
                    <Text fontSize="lg" fontWeight="bold">
                      {user.name}
                    </Text>
                    <Text fontSize="sm">{moment(item.datetime).format('DD MMMM YYYY')}</Text>
                    <Text>{item.status}</Text>
                  </Box>
                </Box>
              </Box>
              <Box flexDirection="row" alignItems="center" mt={2}>
                <Box width={24} />
              </Box>
              {index < timelineData.length - 1 && <Divider my={2} borderColor="gray.400" />}
            </View>
          ))}
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
