import {
  Box,
  Button,
  CheckIcon,
  Divider,
  Fab,
  FormControl,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  NativeBaseProvider,
  ScrollView,
  Select,
  Spinner,
  Stack,
  Text,
  Toast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../common/Header';
import update from 'immutability-helper';
import moment from 'moment/moment';
import {Get, Post} from '../common/Req';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import axios, {Axios} from 'axios';
import DatePicker from 'react-native-date-picker';

export default function Tambahberkas({route, navigation}) {
  const {conf, user, kib, golongan, tit} = route.params;

  const latitudeDelta = 0.005;
  const longitudeDelta = 0.005;
  const [location, setLocation] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: null,
    longitude: null,
  });

  const [mkeluar, setMkeluar] = useState(false);
  const [mdate, setMdate] = useState(false);

  const [msubmit, setMsubmit] = useState(false);

  const [mpick, setMpick] = useState(false);
  const [ipick, setIpick] = useState(null);

  const [date, setDate] = useState(new Date());
  const [sdate, setSdate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingimg, setLoadingimg] = useState(false);
  const [ajuan, setAjuan] = useState(0);
  const [image, setImage] = useState([]);
  const [result, setResult] = useState(null);

  const j = [
    {
      tipe: 'pilihan',
      urai: 'Kategori',
      isian: '',
      wajib: true,
      opsi: [
        {label: 'Tes 1', value: 1},
        {label: 'Tes 2', value: 2},
        {label: 'Tes 3', value: 3},
      ],
    },
    {
      tipe: 'upload',
      urai: 'Gambar',
      isian: '',
    },
    {tipe: 'map', urai: 'tes', isian: ''},
  ];

  const [provs, setProvs] = useState(null);
  const [provd, setProvd] = useState([
    {label: 'Prov 1', value: 1},
    {label: 'Prov 2', value: 2},
    {label: 'Prov 3', value: 3},
  ]);

  const [kots, setKots] = useState(null);
  const [kotd, setKotd] = useState([
    {label: 'Kota 1', value: 1},
    {label: 'Kota 2', value: 2},
    {label: 'Kota 3', value: 3},
  ]);

  const [kecs, setKecs] = useState(null);
  const [kecd, setKecd] = useState([
    {label: 'Kec 1', value: 1},
    {label: 'Kec 2', value: 2},
    {label: 'Kec 3', value: 3},
  ]);

  const [form, setForm] = useState([
    {tipe: 'text', urai: 'Nama Dokumen', wajib: true, isian: ''},
    {tipe: 'text', urai: 'Agenda Dokumen', wajib: true, isian: ''},
    {tipe: 'text', urai: 'Perihal', isian: ''},
    {tipe: 'text', urai: 'Nama Pengirim', wajib: true, isian: ''},
    {tipe: 'textarea', urai: 'Uraian Dokumen', isian: ''},
    {tipe: 'date', urai: 'Tanggal Diterima', wajib: true, isian: null},
    {tipe: 'date', urai: 'Tanggal Dokumen', wajib: true, isian: null},
    {tipe: 'date', urai: 'Tanggal Agenda', wajib: true, isian: null},
    {tipe: 'upload', urai: 'Attachment Dokumen', wajib: true, isian: ''},
  ]);

  const [mbigimg, setMbigimg] = useState(false);
  const [bigimg, setBigimg] = useState(null);

  useEffect(() => {
    bigimg !== null && setMbigimg(true);
  }, [bigimg]);

  useEffect(() => {
    getLocation();
    getData();

    return () => {};
  }, []);

  function getData() {
    setLoading(false);
  }

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kami memerlukan izin kamera',
          message:
            'Kami memerlukan izin kamera ' +
            'untuk keperluan informasi dan penanganan',
          buttonNeutral: 'Lain kali',
          buttonNegative: 'Batal',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  async function requestMediaPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Kami memerlukan izin media',
          message:
            'Kami memerlukan izin media ' +
            'untuk keperluan informasi dan penanganan',
          buttonNeutral: 'Lain kali',
          buttonNegative: 'Batal',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
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

  async function pickcam() {
    let result = {didCancel: true};
    requestCameraPermission().then(async r => {
      if (r === true) {
        result = await launchCamera({
          mediaType: 'photo',
          aspect: [4, 3],
          quality: 0.3,
        });

        console.log(result);
        if (result.didCancel !== true) {
          setImage(prevValues => [...prevValues, result.assets[0].uri]);
          const formdata = new FormData();
          formdata.append('image', {
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: 'foto.jpg',
          });
          setLoadingimg(false);
          axios({
            method: 'POST',
            url: conf.url + 'kib/upload',
            data: formdata,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + user.token,
            },
          })
            .then(r => {
              setLoadingimg(false);
              if (r.status === 200) {
                const newVal = update(form, {
                  [ipick]: {
                    isian: {$set: r.data.uuid},
                    uuidfile: {$set: r.data.uuid},
                  },
                });
                setForm(newVal);
                setIpick(null);
              } else {
                Toast.show({title: 'Upload error'});
                setIpick(null);
              }

              console.log(r);
            })
            .catch(e => {
              setIpick(null);
              console.log(e);
              setLoadingimg(false);
              Toast.show({title: 'Upload err'});
            });
        }
      }
    });
  }

  async function pickgal() {
    let result = {didCancel: true};

    result = await launchImageLibrary({
      mediaType: 'photo',
      aspect: [4, 3],
      quality: 0.3,
    });

    console.log(result);
    if (result.didCancel !== true) {
      setImage(prevValues => [...prevValues, result.assets[0].uri]);
      const formdata = new FormData();
      formdata.append('image', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'foto.jpg',
      });
      setLoadingimg(false);
      axios({
        method: 'POST',
        url: conf.url + 'kib/upload',
        data: formdata,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + user.token,
        },
      })
        .then(r => {
          setLoadingimg(false);
          if (r.status === 200) {
            const newVal = update(form, {
              [ipick]: {
                isian: {$set: r.data.uuid},
                uuidfile: {$set: r.data.uuid},
              },
            });
            setForm(newVal);
            setIpick(null);
          } else {
            Toast.show({title: 'Upload error'});
            setIpick(null);
          }

          console.log(r);
        })
        .catch(e => {
          console.log(e);
          setIpick(null);
          setLoadingimg(false);
          Toast.show({title: 'Upload err'});
        });
    }
  }

  const handleError = err => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  function renderDate() {
    return (
      <DatePicker
        modal
        open={mdate}
        date={date}
        mode="date"
        locale="id"
        cancelText="Batal"
        confirmText="Ya"
        title="Pilih tanggal"
        maximumDate={new Date()}
        onConfirm={date => {
          setMdate(false);
          const newVal = update(form, {
            [sdate.i]: {isian: {$set: moment(date).format('YYYY-MM-DD')}},
          });
          setForm(newVal);
        }}
        onCancel={() => {
          setMdate(false);
        }}
      />
    );
  }

  function renderimage() {
    return (
      <FlatList
        data={image}
        numColumns={3}
        renderItem={({item, index}) => (
          <Box mr={12} mb={4}>
            <TouchableOpacity onPress={() => setBigimg(item)}>
              <Image
                w={20}
                h={20}
                borderRadius="lg"
                source={{
                  uri: item,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{position: 'absolute', right: 3, top: 3}}
              onPress={() =>
                setImage(prevActions =>
                  // Filter out the item with the matching index
                  prevActions.filter((v, i) => i !== index),
                )
              }>
              <Box
                bg={'white'}
                w={6}
                h={6}
                alignItems={'center'}
                justifyContent="center"
                borderRadius={'lg'}
                borderWidth={1}
                borderColor="red.500">
                <Icon
                  fontSize={15}
                  color={'red.500'}
                  name="window-close"
                  as={MaterialCommunityIcons}
                />
              </Box>
            </TouchableOpacity>
          </Box>
        )}
      />
    );
  }
  console.log(result);

  function submit() {
    setLoading(true);
    axios({
      method: 'POST',
      url: conf.url + 'kib/isian',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      data: form,
    })
      .then(json => {
        setLoading(false);
        //return json.movies;
        if (json.status === 200) {
          Toast.show({
            title: 'Berhasil',
            onCloseComplete: () => kembali(),
            duration: 3500,
          });
        }
        console.log(json);
      })
      .catch(error => {
        setLoading(false);
        if (error.response !== undefined) {
          Toast.show({
            title: error.response.data.message,
          });
        } else {
          Toast.show({title: 'Down'});
        }

        console.error(error);
      });
  }

  function kembali() {
    navigation.goBack();
  }

  function generateForm() {
    return form.map((v, i) => {
      if (v.tipe === 'text') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.urai}
              {v.wajib ? '*' : null}
            </Heading>
            <Input
              value={v.isian}
              w={'100%'}
              onChangeText={val => {
                const newVal = update(form, {[i]: {isian: {$set: val}}});
                setForm(newVal);
              }}
            />
          </VStack>
        );
      } else if (v.tipe === 'number') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.urai}
              {v.wajib ? '*' : null}
            </Heading>
            <Input
              value={v.isian}
              w={'100%'}
              keyboardType="phone-pad"
              onChangeText={val => {
                const newVal = update(form, {[i]: {isian: {$set: val}}});
                setForm(newVal);
              }}
            />
          </VStack>
        );
      } else if (v.tipe === 'textarea') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.urai}
              {v.wajib ? '*' : null}
            </Heading>
            <Input
              textAlignVertical="top"
              value={v.isian}
              height={24}
              w={'100%'}
              onChangeText={val => {
                const newVal = update(form, {[i]: {isian: {$set: val}}});
                setForm(newVal);
              }}
            />
          </VStack>
        );
      } else if (v.tipe === 'date') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.urai}
            </Heading>
            <Button
              borderRadius={'full'}
              bg={conf.color}
              onPress={() => {
                setMdate(true);
                setSdate({v: v, i: i});
              }}>
              {v.isian !== null ? v.isian : 'Pilih tanggal'}
            </Button>
          </VStack>
        );
      } else if (v.type === 'radio') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.label}
            </Heading>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={v.value}
              color={'blue.700'}
              onChange={val => {
                this.setState({
                  form: update(this.state.form, {
                    [i]: {value: {$set: val}},
                  }),
                });
              }}>
              {v.opsi.map((vo, io) => (
                <Radio value={vo.id} my={1} key={io} color={'blue.700'}>
                  {vo.label}
                </Radio>
              ))}
            </Radio.Group>
          </VStack>
        );
      } else if (v.tipe === 'upload') {
        return (
          <VStack mb={4} key={i}>
            <FormControl>
              <Heading size="xs" mb={1}>
                {v.urai}
              </Heading>

              {image.length !== 0 ? renderimage() : null}
              <Button
                borderRadius={'full'}
                isLoading={loadingimg}
                bg={conf.color}
                onPress={() => {
                  setIpick(i);
                  setMpick(true);
                }}>
                Pilih Berkas
              </Button>
            </FormControl>
          </VStack>
        );
      } else if (v.tipe == 'pilihan') {
        return (
          <VStack mb={4} key={i}>
            <Heading size="xs" mb={1}>
              {v.urai}
              {v.wajib ? '*' : null}
            </Heading>
            <Select
              selectedValue={v.isian}
              w="100%"
              placeholder="Pilih..."
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={val => {
                const newVal = update(form, {[i]: {isian: {$set: val}}});
                setForm(newVal);
              }}>
              {v.opsi.map((vo, io) => (
                <Select.Item label={vo.label} value={vo.value} key={io} />
              ))}
            </Select>
          </VStack>
        );
      } else if (v.tipe == 'map') {
        if (location.latitude !== null) {
          return (
            <Box borderRadius={'lg'} mt={4} key={i}>
              <MapView
                style={{
                  width: '100%',
                  height: 140,
                }}
                showsUserLocation={true}
                initialRegion={location}
                onRegionChangeComplete={v => {
                  setLocation(v);
                  const newVal = update(form, {
                    [i]: {
                      isian: {
                        $set: JSON.stringify({
                          latitude: v.latitude,
                          longitude: v.longitude,
                        }),
                      },
                    },
                  });
                  setForm(newVal);
                }}></MapView>

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
          );
        } else {
          null;
        }
      }
    });
  }
  console.log(form);
  return (
    <NativeBaseProvider>
      <Modal
        isOpen={mpick}
        onClose={() => {
          setMpick(false);
          setIpick(null);
        }}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Pilih gambar</Modal.Header>
          <Modal.Body>
            <Stack space={2}>
              <Button
                bg={'red.700'}
                onPress={() => {
                  pickgal();
                  setMpick(false);
                }}>
                Ambil dari galeri.
              </Button>
              <Button
                bg={'blue.700'}
                onPress={() => {
                  pickcam();
                  setMpick(false);
                }}>
                Ambil dari kamera.
              </Button>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={msubmit}
        onClose={() => {
          setMsubmit(false);
        }}>
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Text>Apakah anda yakin dengan data yang akan kirimkan? </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                w={24}
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setMsubmit(false);
                }}>
                Batal
              </Button>
              <Button
                w={24}
                bg={conf.color}
                onPress={() => {
                  setMsubmit(false);
                  //submit();
                }}>
                Ya
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Box
        bg={conf.color ? conf.color : 'red.400'}
        py={4}
        px={2}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            size={'xl'}
            color="white"
            as={MaterialCommunityIcons}
            name={'arrow-left'}
          />
        </TouchableOpacity>

        <Stack>
          <Heading color={'white'} ml={4} maxWidth={300} numberOfLines={1}>
            Tambah Berkas
          </Heading>
        </Stack>

        <TouchableOpacity disabled>
          <Icon
            size={'xl'}
            color={conf.color}
            as={MaterialCommunityIcons}
            name={'arrow-left'}
          />
        </TouchableOpacity>
      </Box>
      <Box h={8} bg={conf.color} />
      <Box h={8} bg={'gray.100'} mt={-8} borderTopRadius={'full'} />

      <KeyboardAvoidingView keyboardVerticalOffset={500} style={{flex: 1}}>
        {renderDate()}
        <Box h={'80%'} px={4} pb={6} flex={1} bg={'gray.100'}>
          <Modal
            isOpen={mbigimg}
            onClose={() => {
              setMbigimg(false);
              setBigimg(null);
            }}>
            <Modal.Content maxWidth="500px">
              <Modal.CloseButton />
              <Modal.Header>Detail gambar</Modal.Header>

              <Modal.Body>
                <Image size={'2xl'} source={{uri: bigimg}} />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <ScrollView>
            <Stack space={2} px={4} py={3} bg={'white'} borderRadius={'xl'}>
              {generateForm()}
            </Stack>
            {loading ? (
              <Spinner color={conf.color} />
            ) : (
              <Button
                size={'lg'}
                borderRadius="full"
                bg={conf.color}
                mt={4}
                onPress={() => {
                  setMsubmit(true);
                }}>
                <Text bold color="white">
                  SIMPAN
                </Text>
              </Button>
            )}
          </ScrollView>
        </Box>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
