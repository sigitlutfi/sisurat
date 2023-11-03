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
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../common/Header';

moment.locale('id');

export default function History({ route, navigation }) {
  // ... other code ...

  const { conf, user } = route.params;

  useEffect(() => {
    // Fetch disposisi data using Axios and set it in the 'data' state
    axios({
      method: 'get',
      url: 'http://103.100.27.59/~lacaksurat/add_history_disposisi.php',
      headers: {
        id_pegawai: '2',
      },
    })
      .then((response) => {
        if (response.data.data !== undefined) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const timelineData = [
    { time: '09:00', title: 'Document', description: 'Keterangan', type: 'meeting' },
    { time: '10:45', title: 'Document', description: 'Keterangan', type: 'meeting' },
    { time: '12:00', title: 'Document', description: 'Keterangan', type: 'meeting' },
  ];



  return (
    <NativeBaseProvider>
      <Header tit="History" nv={navigation} conf={conf} />
      <Box bg={'gray.200'} flex={1} px={4} pb={4}>
      <HStack>
    <View style={styles.container}>
      <FlatList
        data={timelineData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons name="clock" size={24} color="blue" />
              <Text style={styles.timeText}>{item.time}</Text>
              {item.type === 'meeting' && (
                <MaterialCommunityIcons name="calendar" size={24} color="blue" />
              )}
              {item.type === 'reminder' && (
                <MaterialCommunityIcons name="alarm" size={24} color="green" />
              )}
              {item.type === 'task' && (
                <MaterialCommunityIcons name="checkbox-marked" size={24} color="purple" />
              )}
              {item.type === 'note' && (
                <MaterialCommunityIcons name="note" size={24} color="orange" />
              )}
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
    </HStack>
    </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  // ... your existing styles ...
});
