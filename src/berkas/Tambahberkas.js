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
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import axios, {Axios} from 'axios';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';

export default function Tambahberkas({route, navigation}) {
  	const [loading, setLoading] = useState(true);
  	const [nama, setNama] = useState("");
	const [agenda, setAgenda] = useState("");
	const [perihal, setPerihal] = useState("");
	const [pengirim, setPengirim] = useState("");
	const [uraian, setUraian] = useState("");
	const [tanggalDiterima, setTanggalDiterima] = useState(null);
	const [tanggalDiterimaVisible, setTanggalDiterimaVisible] = useState(false);
	const [tanggalDokumen, setTanggalDokumen] = useState(null);
	const [tanggalDokumenVisible, setTanggalDokumenVisible] = useState(false);
	const [tanggalAgenda, setTanggalAgenda] = useState(null);
	const [tanggalAgendaVisible, setTanggalAgendaVisible] = useState(false);
	const [dokumen, setDokumen] = useState(null);

	toggleTanggalDiterima = () => {
		setTanggalDiterimaVisible(tanggalDiterimaVisible ? false : true);
	};

	confirmTanggalDiterima = (date) => {
		setTanggalDiterima(date);
		toggleTanggalDiterima();
	};

	toggleTanggalDokumen = () => {
		setTanggalDokumenVisible(tanggalDokumenVisible ? false : true);
	};

	confirmTanggalDokumen = (date) => {
		setTanggalDokumen(date);
		toggleTanggalDokumen();
	};

	toggleTanggalAgenda = () => {
		setTanggalAgendaVisible(tanggalAgendaVisible ? false : true);
	};

	confirmTanggalAgenda = (date) => {
		setTanggalAgenda(date);
		toggleTanggalAgenda();
	};

	handleFilePick = async () => {
		try {
			const result = await DocumentPicker.pick({
				type: "application/pdf",
			});

			if (result.type === "success") {
        setDokumen(result);
				console.log(result.uri, result.name, result.size);
			}
		} catch (err) {
			throw err;
		}
	};

	const handleSimpanBerkas = async () => {
		const formData = new FormData();
    
		formData.append("p_nama_dokumen", nama);
		formData.append("p_agenda", agenda);
		formData.append("p_perihal", perihal);
		formData.append("p_nama_pengirim", pengirim);
		formData.append("p_ringkasan_dokumen", uraian);
		formData.append(
			"p_tanggal_diterima",
			tanggalDiterima ? tanggalDiterima.toISOString().split("T")[0] : ""
		);
		formData.append(
			"p_tanggal_dokumen",
			tanggalDokumen ? tanggalDokumen.toISOString().split("T")[0] : ""
		);
		formData.append(
			"p_tanggal_agenda",
			tanggalAgenda ? tanggalAgenda.toISOString().split("T")[0] : ""
		);
    if (dokumen) {
      formData.append(
        "p_lampiran",
        {
          uri: dokumen.uri,
          name: dokumen.name,
          type: 'application/pdf',
        }
      );
    }

		console.log("Create:", formData);
		try {
			const headers = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			const response = await axios.post(
				"http://103.100.27.59/~lacaksurat/register_surat.php",
				formData,
				headers
			);
      
      if (response.data.code === 200) {
        setLoading(true)
        Alert.alert(response.data.message + ' Tiket ID: ' + response.data.tiket_id);
        navigation.replace("Daftarberkas");
        console.log("Response", response.data);
      } else {
        Alert.alert("Error: ", response.data.message)
      }
		} catch (error) {
			console.error("Error", error);
		}
	};

	return (
		<NativeBaseProvider>
      <ScrollView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Text>Nama Dokumen*</Text>
				<TextInput style={styles.input} value={nama} onChangeText={setNama} />

				<Text>Agenda Dokumen*</Text>
				<TextInput
					style={styles.input}
					value={agenda}
					onChangeText={setAgenda}
				/>

				<Text>Perihal</Text>
				<TextInput
					style={styles.input}
					value={perihal}
					onChangeText={setPerihal}
				/>

				<Text>Nama Pengirim*</Text>
				<TextInput
					style={styles.input}
					value={pengirim}
					onChangeText={setPengirim}
				/>

				<Text>Uraian Dokumen</Text>
				<TextInput
					style={styles.inputBox}
					multiline={true}
					numberOfLines={4}
					value={uraian}
					onChangeText={setUraian}
				/>

				<Text>Tanggal Diterima</Text>
				<Pressable style={styles.buttonDate} onPress={toggleTanggalDiterima}>
					<Text style={styles.buttonText}>
						{tanggalDiterima
							? tanggalDiterima.toLocaleDateString()
							: "Pilih Tanggal"}
					</Text>
				</Pressable>
				<DateTimePickerModal
					isVisible={tanggalDiterimaVisible}
					mode="date"
					onConfirm={confirmTanggalDiterima}
					onCancel={toggleTanggalDiterima}
				/>

				<Text>Tanggal Dokumen</Text>
				<Pressable style={styles.buttonDate} onPress={toggleTanggalDokumen}>
					<Text style={styles.buttonText}>
						{tanggalDokumen
							? tanggalDokumen.toLocaleDateString()
							: "Pilih Tanggal"}
					</Text>
				</Pressable>
				<DateTimePickerModal
					isVisible={tanggalDokumenVisible}
					mode="date"
					onConfirm={confirmTanggalDokumen}
					onCancel={toggleTanggalDokumen}
				/>

				<Text>Tanggal Agenda</Text>
				<Pressable style={styles.buttonDate} onPress={toggleTanggalAgenda}>
					<Text style={styles.buttonText}>
						{tanggalAgenda
							? tanggalAgenda.toLocaleDateString()
							: "Pilih Tanggal"}
					</Text>
				</Pressable>
				<DateTimePickerModal
					isVisible={tanggalAgendaVisible}
					mode="date"
					onConfirm={confirmTanggalAgenda}
					onCancel={toggleTanggalAgenda}
				/>

				<Text>Attachment Dokumen</Text>
				<Pressable style={styles.buttonDate} onPress={handleFilePick}>
					<Text style={styles.buttonText}>
          				{dokumen
							? dokumen.name
							: "Pilih Berkas PDF"
						}
					</Text>
				</Pressable>

				<Pressable style={styles.buttonSimpan} onPress={handleSimpanBerkas}>
					<Text style={styles.buttonText}>Simpan</Text>
				</Pressable>
			</View>
		</ScrollView>
    </NativeBaseProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	input: {
		marginBottom: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 4,
	},
	inputBox: {
		height: 80,
		marginBottom: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 4,
	},
	buttonDate: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: "#e81c4c",
		marginBottom: 10,
	},
	buttonSimpan: {
		marginTop: 40,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: "#e81c4c",
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: "bold",
		letterSpacing: 0.25,
		color: "white",
	},
});