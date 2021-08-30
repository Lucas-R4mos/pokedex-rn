import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ActivityIndicator,
	Modal,
	Button,
	Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import {
	PressStart2P_400Regular,
	useFonts
} from '@expo-google-fonts/press-start-2p'
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

export default function App() {
	const [isLoading, setLoading] = useState(true)
	const [pokeList, setPokeList] = useState([])
	const [selection, setSelection] = useState()
	const [modalVisible, setModalVisible] = useState(false)
	const [pokeData, setPokeData] = useState({})
	const [isModalLoading, setModalLoading] = useState(true)

	let [fontsLoaded] = useFonts({
		PressStart2P_400Regular,
		Roboto_400Regular
	})

	useEffect(() => {
		loadData()
	}, [])

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const loadData = async () => {
		const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
		const data = await res.json()
		const filteredData = data.results.map((poke) => {
			let pokeInitData = {}
			pokeInitData.label = capitalizeFirstLetter(poke.name)
			pokeInitData.value = poke.url

			return pokeInitData
		})

		await setPokeList(filteredData)
		await setLoading(false)
	}

	const handleDropdownChange = async (value) => {
		await setModalLoading(true)
		await setModalVisible(true)

		try {
			const res = await fetch(value)
			const data = await res.json()

			await setPokeData(data)
		} catch (err) {
			if (err) console.log('Error on request:', err)
		}

		await setSelection(value)
		await setModalLoading(false)

	}

	if (isLoading || !fontsLoaded) {
		return (
			<SafeAreaView style={styles.mainContainer}>
				<ActivityIndicator size={100} color='#212121' />
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={styles.mainCard}>
				<Text style={styles.Header} >Pokedex</Text>
				<Text style={styles.RobotoText}>
					Choose a Pokémon:
				</Text>
				<View style={styles.PickerContainer}>
					<Picker
						selectedValue={selection}
						onValueChange={handleDropdownChange}
						mode={'dialog'}
						style={styles.Picker}
					>
						{
							pokeList === []
								? <></>
								: pokeList.map((poke, index) => {
									return <Picker.Item key={index} label={poke.label} value={poke.value} style={styles.RobotoText} />
								})
						}
					</Picker>
				</View>
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => { setModalVisible(!modalVisible) }}
			>
				<View
					style={styles.modalView}
				>
					{
						isModalLoading
							? <ActivityIndicator size={75} color='#212121' />
							: <>
								<View style={styles.dataContainer}>
									<Image
										source={{
											uri: pokeData.sprites.other["official-artwork"].front_default,
											width: 225,
											height: 225,
											method: 'GET',
										}}
									/>
									<Text style={styles.RobotoText}>{capitalizeFirstLetter(pokeData.name)}</Text>
									<Text style={styles.RobotoText}>Podekex nº {pokeData.id}</Text>
									<Text style={styles.RobotoText}>Type(s):</Text>
									{
										pokeData.types.map((type) => {
											return <Text style={styles.RobotoText} key={type.slot}>    - {capitalizeFirstLetter(type.type.name)}</Text>
										})
									}
								</View>
								<Button
									onPress={() => { setModalVisible(false) }}
									title={'x'}
									color='#121212'
								/>
							</>
					}
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#FB1B1B',
		alignItems: 'center',
		justifyContent: 'flex-start',
		minWidth: '100%',
		paddingBottom: 300
	},
	secContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	Header: {
		fontSize: 50,
		fontFamily: 'PressStart2P_400Regular'
	},
	RobotoText: {
		fontSize: 18,
		fontFamily: 'Roboto_400Regular'
	},
	mainCard: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalView: {
		backgroundColor: "white",
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	PickerContainer: {
		backgroundColor: '#EFEFEF',
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginTop: 20
	},
	Picker: {
		width: 200
	},
});
