import {
  Avatar,
  Box,
  Button,
  Center,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  Divider,
  FormControl,
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
  useToast,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';
import AuthContext from '../../AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {ImageSlider} from 'react-native-image-slider-banner';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import {Get, Post} from '../common/Req';
import {LoadMoreFlatlist} from 'react-native-load-more-flatlist';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SliderBox} from 'react-native-image-slider-box';
import moment from 'moment';
import 'moment/locale/id';
import Header from '../common/Header';
import {useCameraDevice, Camera} from 'react-native-vision-camera';
import {getDistance} from 'geolib';
moment.locale('id');

export default function Presensimasuk({route, navigation}) {
  const {conf, user} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const camera = React.useRef(null);
  const latitudeDelta = 0.005;
  const longitudeDelta = 0.005;
  const [location, setLocation] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: null,
    longitude: null,
  });
  const toast = useToast();
  var nows = moment(new Date()); //todays date
  var end = moment(date).set({hour: 12, minute: 59}).toDate(); // another date
  var duration = moment.duration(nows.diff(end));
  var d = duration.asMinutes();

  const [mkeluar, setMkeluar] = useState(false);
  const [mpresen, setMpresen] = useState(false);
  const [ket, setKet] = useState('-');
  const [imageSource, setImageSource] = useState(null);
  const [uuidfoto, setUuidfoto] = useState(null);
  const [jarak, setJarak] = useState(null);
  const [cactive, setCactive] = useState(true);
  const [dur, setDur] = useState(d);
  const [date, setDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const nav = useNavigation();

  useEffect(() => {
    nav.addListener('beforeRemove', () => {
      setCactive(false);
    });

    return () =>
      navigation.removeListener('beforeRemove', () => {
        setCactive(false);
      });
  }, [navigation]);

  useEffect(() => {
    getLocation();

    return () => {};
  }, []);

  useEffect(() => {
    if (imageSource !== null) {
      uploadimage();
    }

    return () => {};
  }, [imageSource]);

  const capturePhoto = async () => {
    setCactive(true);
    setLoading(true);
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'off',
        enableShutterSound: false,
      });
      setImageSource(photo.path);
      setCactive(false);
      console.log(photo.path);
      //uploadimage(photo.path);
    }
  };

  function uploadimage() {
    const f = new FormData();
    f.append('image', {
      uri: 'file://' + imageSource,
      name: 'userProfile.jpg',
      type: 'image/jpg',
    });
    axios({
      method: 'post',
      url: conf.url + 'form/upload-image',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.token,
      },
      data: f,
    })
      .then(v => {
        console.log(v);
        if (v.data.uuid !== undefined) {
          presensi(v.data.uuid);
        } else {
          ToastAndroid.show('ERR: upload image', ToastAndroid.SHORT);
        }
      })
      .catch(e => {
        ToastAndroid.show('ERR: upload image', ToastAndroid.SHORT);
        console.log(e);
        setLoading(false);
      });
  }

  function presensi(uu) {
    const z = new FormData();
    z.append('tipe', '1');
    z.append('foto', uu);
    z.append('koordinat', location.latitude + ', ' + location.longitude);
    z.append('keterangan', ket);
    axios({
      method: 'post',
      url: conf.url + 'form/presensi',
      data: z,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.token,
      },
      data: z,
    })
      .then(v => {
        setLoading(false);

        ToastAndroid.show(
          'Presensi berhasil. Terimakasih dan selamat bekerja.',
          ToastAndroid.SHORT,
        );
        navigation.goBack();
        console.log(v);
      })
      .catch(e => {
        ToastAndroid.show('ERR: upload attend', ToastAndroid.SHORT);
        console.log(e);
        setLoading(false);
      });
  }

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

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    const config = {
      timeout: 2000,
      maximumAge: 3600000,
      distanceFilter: 0,
      enableHighAccuracy: true,
      forceRequestLocation: true,
      forceLocationManager: false,
      showLocationDialog: true,
    };

    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude);
        setLocation({
          latitudeDelta,
          longitudeDelta,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const myArray = conf.koordinat.split(', ');
        let lat = myArray[0];
        let lon = myArray[1];
        const x = getDistance(
          {latitude: lat, longitude: lon},
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        );
        setJarak(x);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation({
          latitudeDelta,
          longitudeDelta,
          latitude: null,
          longitude: null,
        });
        console.log(error);
      },
      {config},
    );
  };
  const w = Dimensions.get('screen').width;
  const device = useCameraDevice('front');

  const MINUTE_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Logs every minute');
      var n = moment(n);
      var end = moment(n).set({hour: 13, minute: 59, second: 59}); // another date
      var duration = moment.duration(n.diff(end));
      const formatted = moment(duration.asMilliseconds()).format('HH:mm:ss');

      console.log(duration);
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (
    <NativeBaseProvider>
      <Header tit={'Presensi Masuk'} nv={navigation} conf={conf} />
      <Modal
        isOpen={loading}
        onClose={() => setLoading(false)}
        closeOnOverlayClick={true}>
        <Modal.Content maxWidth="500px">
          <Center py={6} space={4}>
            <Image
              source={require('../../assets/wait.jpg')}
              size={'xl'}
              alt=""
            />
            <Text my={4}>Mohon tunggu sebentar</Text>
            <Spinner color={conf.color} />
          </Center>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={mpresen}
        onClose={() => setMpresen(false)}
        closeOnOverlayClick={false}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Presensi di luar kantor.</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Keterangan</FormControl.Label>
              <Input onChangeText={v => setKet(v)} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setMpresen(false);
                }}>
                Batal
              </Button>
              <Button
                bg={'green.500'}
                onPress={() => {
                  if (ket == '-') {
                    ToastAndroid.show(
                      'Silakan isi keterangan terlebih dahulu !',
                      ToastAndroid.SHORT,
                    );
                  } else {
                    setMpresen(false);
                    capturePhoto();
                  }
                }}>
                Masuk
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Box bg={'gray.200'} flex={1} p={4}>
        <Box
          h={240}
          w={240}
          overflow={'hidden'}
          borderRadius={'full'}
          alignSelf={'center'}>
          <Camera
            ref={camera}
            style={{flex: 1}}
            device={device}
            isActive={cactive}
            photo={true}
          />
          <Text position={'absolute'}>aasdas</Text>
        </Box>
        {device == null && <Text>Kamera tidak tersedia</Text>}
        {location.latitude !== null ? (
          <Box borderRadius={'2xl'} overflow={'hidden'} mt={4}>
            <MapView
              style={{
                width: '100%',
                height: 200,
              }}
              onRegionChangeComplete={v => console.log(v)}
              showsUserLocation={true}
              initialRegion={location}></MapView>
            {jarak !== null ? (
              <Box
                position={'absolute'}
                right={2}
                bottom={2}
                bg={conf.color}
                px={2}
                py={1}
                borderRadius={'lg'}>
                <Text fontSize={12} color="white">
                  Anda berada radius {jarak} M dari kantor
                </Text>
              </Box>
            ) : null}
            <View
              style={{
                left: '50%',
                marginLeft: -24,
                marginTop: -48,
                position: 'absolute',
                top: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <IoniconsIcon name="pin" size={48} color="red" />
              </View>
            </View>
          </Box>
        ) : (
          <Center borderRadius={'2xl'} overflow={'hidden'} mt={4} bg="white">
            <Text>Memuat lokasi anda...</Text>
            <Spinner color={conf.color} />
          </Center>
        )}

        <VStack alignItems={'center'} space={2} mt={4}>
          <Text fontSize={13}>
            Sekarang pukul {moment(new Date()).format('HH:mm')} WIB - Waktu
            Masuk pukul 08:00 WIB
          </Text>
          <Text fontSize={16} bold>
            {/* {dur < 0
              ? dur + 'Menit sebelum terlambat'
              : 'Anda terlambat ' + dur + ' menit'} */}
          </Text>
          <Button
            w={'full'}
            bg={parseInt(jarak) > 1000 ? 'gray.500' : 'green.500'}
            borderRadius={'xl'}
            disabled={jarak > 1000}
            onPress={() => capturePhoto()}>
            {parseInt(jarak) > 1000
              ? 'Anda berada terlalu jauh dari kantor'
              : 'Presensi Masuk'}
          </Button>

          <Text fontSize={12}>
            Anda berada di luar kantor ?. Atau sedang berhalangan hadir ?
            <Text bold> TEKAN TOMBOL DIBAWAH</Text>
          </Text>
          <Button
            w="full"
            borderRadius={'xl'}
            variant={'outline'}
            onPress={() => setMpresen(true)}
            borderColor={'green.500'}>
            <Text color="green.500">Presensi Di Luar Kantor</Text>
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}
