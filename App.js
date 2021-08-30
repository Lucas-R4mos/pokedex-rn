import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	ActivityIndicator,
	Modal,
	Button,
	Image
} from 'react-native';
import { Dropdown } from 'sharingan-rn-modal-dropdown';
import {
	PressStart2P_400Regular,
	useFonts
} from '@expo-google-fonts/press-start-2p'

export default function App() {
	const [isLoading, setLoading] = useState(true)
	const [pokeList, setPokeList] = useState([])
	const [selection, setSelection] = useState()
	const [modalVisible, setModalVisible] = useState(false)
	const [pokeData, setPokeData] = useState({})
	const [isModalLoading, setModalLoading] = useState(true)

	let [fontsLoaded] = useFonts({
		PressStart2P_400Regular
	})

	useEffect(() => {
		loadData()
	}, [])

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const loadData = async () => {
		const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
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
			{/* <KeyboardAvoidingView style={styles.secContainer}> */}
			<View style={styles.mainCard}>
				<Text style={styles.Header} >Pokedex</Text>
				<Text style={{ paddingBottom: 20 }}>
					Choose a Pokémon:
				</Text>
				<Dropdown
					mainContainerStyle={styles.dropdown}
					label='I choose you!'
					data={pokeList}
					// enableSearch
					value={selection}
					onChange={handleDropdownChange}
					disableSort
				/>
			</View>
			{/* </KeyboardAvoidingView> */}
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
											width: 150,
											height: 150,
											method: 'GET',
										}}
									/>
									<Text>{capitalizeFirstLetter(pokeData.name)}</Text>
									<Text>Podekex nº {pokeData.order}</Text>
									<Text>Type(s):</Text>
									{
										pokeData.types.map((type) => {
											return <Text key={type.slot}>    - {capitalizeFirstLetter(type.type.name)}</Text>
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
		justifyContent: 'center',
		minWidth: '100%',
		paddingTop: 100
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
	mainCard: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dropdown: {
		width: 200
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
	dataContainer: {

	}
});
