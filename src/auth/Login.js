import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Button,
  Center,
  extendTheme,
  FormControl,
  Heading,
  Image,
  Input,
  KeyboardAvoidingView,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Spinner,
  Stack,
  Text,
  theme,
  Toast,
  VStack,
} from 'native-base';

import React, {useEffect, useState} from 'react';
import AuthContext from '../../AuthContext';

import {
  Dimensions,
  Keyboard,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import axios from 'axios';

export default function Login({route, navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {conf} = route.params;
  const [loading, setLoading] = React.useState(false);

  const [deb, setDeb] = React.useState(0);

  const {signIn} = React.useContext(AuthContext);
  useEffect(() => {
    return () => {
      if (deb === 2) {
        setUsername('123456');
        setPassword('qwerty123');
      }
    };
  }, [deb]);

  useEffect(() => {
    requestCameraPermission();
    hasLocationPermission();
  });
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Izinkan penggunaan kamera',
          message: 'Kami memerlukan izin kamera untuk melakukan presensi ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const granteds = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Izinkan penggunaan media',
          message: 'Kami memerlukan media untuk melakukan presensi ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };
  async function signx(params) {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        log: {
          Status: '200',
          Massagge: 'Anda Berhasil Login',
          data: {
            'id user': 39,
            'kode urusan': 122,
            'kode suburusan': 1,
            'kode organisasi': 1,
            'kode unit': 0,
            'kode subunit': 0,
            'Token-type': 'Bearer Token',
            token:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXNldGdpcy1kaXkuc2ltZGEubmV0L2FwaS9sb2dpbiIsImlhdCI6MTY5MDU2NDE1MCwiZXhwIjoxNjkwNTY3NzUwLCJuYmYiOjE2OTA1NjQxNTAsImp0aSI6ImZmOVRVQlI4TTZvTkg5aU8iLCJzdWIiOiIzOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.znYbNMPvSfb0g_oWd1354eWNwbe3SldKE8NaGuo66To',
          },
        },
      }),
    );
    signIn({
      log: {
        Status: '200',
        Massagge: 'Anda Berhasil Login',
        data: {
          'id user': 39,
          'kode urusan': 122,
          'kode suburusan': 1,
          'kode organisasi': 1,
          'kode unit': 0,
          'kode subunit': 0,
          'Token-type': 'Bearer Token',
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXNldGdpcy1kaXkuc2ltZGEubmV0L2FwaS9sb2dpbiIsImlhdCI6MTY5MDU2NDE1MCwiZXhwIjoxNjkwNTY3NzUwLCJuYmYiOjE2OTA1NjQxNTAsImp0aSI6ImZmOVRVQlI4TTZvTkg5aU8iLCJzdWIiOiIzOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.znYbNMPvSfb0g_oWd1354eWNwbe3SldKE8NaGuo66To',
        },
      },
    });
    navigation.replace('MyTabs');
  }

  async function presignin() {
    setLoading(true);
    const data = new FormData();
    data.append('username', username);
    data.append('password', password);

    axios({method: 'post', url: conf.url + 'auth', data: data})
      .then(res => {
        setLoading(false);

        var user = res.data.user;
        user.token = res.data.token;
        Toast.show({title: res.data.message});
        AsyncStorage.setItem('userData', JSON.stringify(user));
        signIn(user);
      })
      .catch(e => {
        console.log(e);
        Toast.show({
          title: 'Username/password salah. Cek kembali !',
        });
        setLoading(false);
      });
  }

  return (
    <NativeBaseProvider>
      <Stack bg={'white'} flex={1}>
        <ScrollView>
          <KeyboardAvoidingView keyboardVerticalOffset={500} style={{flex: 1}}>
            <Stack px={6} flex={1}>
              <Center>
                <Pressable onPress={() => setDeb(deb + 1)}>
                  <Image
                    w={180}
                    h={180}
                    mt={60}
                    borderRadius={90}
                    alt="icon"
                    resizeMode="contain"
                    source={{uri: conf.icon}}
                  />
                </Pressable>
                <Heading
                  size="lg"
                  mt={12}
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  fontWeight="semibold">
                  {conf.name_app}
                </Heading>
                <Heading
                  mt="1"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                  fontWeight="medium"
                  size="xs">
                  Login untuk mulai menggunakan aplikasi
                </Heading>
              </Center>

              <VStack space={3} mt={6}>
                <Input
                  variant="rounded"
                  backgroundColor={'white'}
                  placeholder="username"
                  value={username}
                  onChangeText={v => setUsername(v)}
                />

                <Input
                  variant="rounded"
                  backgroundColor={'white'}
                  placeholder="password"
                  secureTextEntry
                  value={password}
                  onChangeText={v => setPassword(v)}
                />

                {loading && <Spinner color={'yellow.500'} />}
                <Button
                  mt="2"
                  bg={conf.color}
                  borderRadius={'full'}
                  onPress={() =>
                    // signx()
                    presignin()
                  }>
                  Masuk
                </Button>
                <TouchableOpacity
                  style={{alignSelf: 'center', width: 200, marginTop: 12}}
                  onPress={() => alert('development')}>
                  <Text style={{alignSelf: 'center'}}>Lupa kata sandi</Text>
                </TouchableOpacity>
              </VStack>
            </Stack>
          </KeyboardAvoidingView>
        </ScrollView>
      </Stack>
    </NativeBaseProvider>
  );
}
