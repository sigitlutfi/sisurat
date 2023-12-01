import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  NativeBaseProvider,
  Popover,
  Pressable,
  Stack,
  Text,
  Toast,
  View,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, {useEffect, useState} from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../common/Header';
import AuthContext from '../../AuthContext';

import {Get, Post} from '../common/Req';
import axios from 'axios';
import {Alert, BackHandler, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';

export default function Profil({route, navigation}) {
  const {conf, user} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const [mkeluar, setMkeluar] = useState(false);
  const [informasi, setInformasi] = useState(false);
  const [mganti, setMganti] = useState(false);
  const [password, setPassword] = useState('');
  const [lpassword, setLpassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [show, setShow] = useState(false);
  const [rshow, setRshow] = useState(false);
  const [lshow, setLshow] = useState(false);

  const [image, setImage] = useState(null);

  const {ganti} = React.useContext(AuthContext);
  const [informasiDetails, setInformasiDetails] = useState(null);

  const showInformasiDetails = () => {
    const details = `
    Deskripsi Aplikasi: 
    Aplikasi Tracking surat ini adalah sebuah
    aplikasi untuk memantau pergerakan 
    berkas yang ada pada kantor.
    
    Versi Aplikasi:
    1.0.0
    
    Tanggal Rilis: 
    01 Januari 2023
  `;
    setInformasiDetails(details);
    setInformasi(true);
  };

  useEffect(() => {
    if (user !== null) {
      setImage(user.foto);
    }
  }, []);
  console.log(user);
  return (
    <NativeBaseProvider>
      <Modal isOpen={mkeluar} onClose={() => setMkeluar(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Body>Anda yakin ingin keluar ?</Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setMkeluar(false);
                }}>
                Batal
              </Button>
              <Button
                bg={conf.color}
                onPress={() => {
                  setMkeluar(false);
                  signOut();
                  navigation.replace('MyTabs');
                }}>
                Ya
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Stack bg={'gray.200'} flex={1}>
        <Heading ml={8} mt={5}>
          Profil pengguna
        </Heading>
        <Box bg={'white'} m={4} borderRadius={'2xl'} p={4}>
          <Image
            alt="..."
            resizeMode="stretch"
            source={
              user.foto == null
                ? require('../../assets/user.png')
                : {uri: user.foto}
            }
            h={91}
            w={91}
            mt={8}
            alignSelf={'center'}
            borderRadius={'full'}
            bg={'gray.400'}
          />
          <Heading color={conf.color} alignSelf={'center'} mt={4}>
            {user.nama_pegawai}
          </Heading>
          <Text alignSelf={'center'}>
            {user.email ? user.email : 'dummy@mail.com'}
          </Text>
          <Divider my={4} />
          <HStack>
            <Stack w={32} space={2}>
              <Text bold>Username</Text>
              <Text bold>Daerah</Text>
              <Text bold>Verifikasi email</Text>
            </Stack>
            <Stack space={2}>
              <Text>: {user.username ? user.username : 'dummyuser'}</Text>
              <Text>: {conf.daerah}</Text>
              <Text>
                :{' '}
                {user.email_verified_at
                  ? 'Terverifikasi'
                  : 'Belum Terverifikasi'}
              </Text>
            </Stack>
          </HStack>
        </Box>

        {user !== null ? (
          <Box borderRadius={'2xl'} px={4}>
            <Pressable 
              bg={'white'} 
              borderRadius={'2xl'} 
              p={4}
              onPress={showInformasiDetails}
              mt={4}>
              <HStack justifyContent={'space-between'}>
                <HStack>
                  <Icon
                    as={MaterialCommunityIcons}
                    name="information-outline"
                    color="black"
                    size={8}
                  />
                  <Text color="black" bold fontSize={14} mt={2} ml={3}>
                    Informasi
                  </Text>
                </HStack>
                <Icon
                  as={MaterialCommunityIcons}
                  name="chevron-right"
                  color="black"
                  size={8}
                />
              </HStack>
            </Pressable>

            <Pressable
              bg={'white'}
              borderRadius={'2xl'}
              p={4}
              onPress={() => setMkeluar(true)}
              mt={4}>
              <HStack justifyContent={'space-between'}>
                <HStack>
                  <Icon
                    as={MaterialCommunityIcons}
                    name="logout"
                    color="black"
                    size={7}
                  />
                  <Text color="black" bold fontSize={14} mt={2} ml={5} mr={2}>
                    Keluar
                  </Text>
                </HStack>
                <Icon
                  as={MaterialCommunityIcons}
                  name="chevron-right"
                  color="black"
                  size={8}
                />
              </HStack>
            </Pressable>
            <Modal isOpen={informasi} onClose={() => setInformasi(false)}>
        <Modal.Content maxWidth="800px" height="50%">
          <Modal.CloseButton />

          <Modal.Body>
            {informasiDetails ? (
              <Text>{informasiDetails}</Text>
            ) : (
              <Text>No information available.</Text>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
          </Box>
        ) : null}
      </Stack>
    </NativeBaseProvider>
  );
}
