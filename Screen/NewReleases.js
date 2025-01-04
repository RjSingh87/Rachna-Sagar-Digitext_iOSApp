import { StyleSheet, Text, View, Image, RefreshControl, ActivityIndicator, TextInput, TouchableOpacity, FlatList, Alert, } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant';
import Services from '../services';
import Loader from '../constant/Loader';
import { useNavigation } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import NoInternetConn from './NoInternetConn';
import Header from '../comman/Header';



const NewReleases = () => {
	const [search, setSearch] = useState('');
	const [data, setData] = useState([]);
	const [oldData, setOldData] = useState([])
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const searchRef = useRef()
	const navigation = useNavigation()

	const [isListening, setIsListening] = useState(false)
	// const [recognizeText, setRecognizeText] = useState("")

	// this function is search filter 
	const OnSearch = (text) => {
		setSearch(text)
		if (!text || text === '') {
			setData(oldData)
		} else {
			const filtered = oldData.filter((item) => {
				return item.Title.toLowerCase().indexOf(text.toLowerCase()) > -1
			});
			setData(filtered);
		}
		// setQuery(text)
	};

	useEffect(() => {
		newReleasesTitle();

		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechEnd = onSpeechEnd;
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechError = (error) => console.log("Speech Error:", error);

		return () => {
			Voice.destroy().then(() => Voice.removeAllListeners());
		};
	}, []);


	const onSpeechStart = (event) => {
		console.log("Speech Start.....", event);
		setIsListening(true)
	}
	const onSpeechEnd = (event) => {
		console.log("Speech End.....", event);
		setIsListening(false)
	}
	const onSpeechResults = (event) => {
		console.log("speechResults:", event);
		const text = event.value[0]
		setSearch(text)
		SearchFilter(text)
		setTimeout(() => {
			stopListening()
		}, 5000);

	}

	const startListening = async () => {
		try {
			setIsListening(true);
			await Voice.start("en-US");
			setTimeout(stopListening, 5000);
		} catch (error) {
			console.log("Start Listening Error:", error);
			setIsListening(false);
		}
	};

	const stopListening = async () => {
		try {
			await Voice.stop();
			setIsListening(false);
		} catch (error) {
			console.log("Stop Listening Error:", error);
		}
	};




	// this function is search filter with API based

	// const SearchFilter = async (text) => {
	// 	setSearch(text);
	// 	const newData = data.filter(item =>
	// 		item?.Title.toLowerCase().includes(text.toLowerCase())
	// 	);
	// 	if (!newData.length) {
	// 		setError(`Your search : ${text} did not match any product.`)
	// 	} else {
	// 		setOldData(newData);
	// 		setError("")
	// 	}
	// }


	const SearchFilter = (text) => {
		setSearch(text);

		if (!text) {
			setData(oldData);
			setError("");
			return;
		}

		const filtered = oldData.filter(item =>
			item.Title.toLowerCase().includes(text.toLowerCase())
		);

		setData(filtered);

		if (!filtered.length) {
			setError(`Your search: "${text}" did not match any products.`);
		} else {
			setError("");
		}
	};


	const newReleasesTitle = async () => {
		setLoading(true)
		const payLoad = { "api_token": token, }
		await Services.post(apiRoutes.newRelease, payLoad)
			.then((res) => {
				if (res.status === "Success" && res.length != 0) {
					setData(res.result)
					setOldData(res.result)
				} else {
					return
					Alert.alert("Info", res.message)
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { setLoading(false) })
	}



	const onRefresh = useCallback(() => {
		setLoading(true);
		setError("")
		setTimeout(() => {
			newReleasesTitle()
			setSearch("")
			setLoading(false)
		}, 1000);
	}, [loading])





	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity onPress={(() => { navigation.navigate("NewReleaseBooks", { id: item.id, name: "New Releases Books", title: "New Releases Books" }) })} style={styles.productItem}>
				<Image source={{ uri: item.image_Path }} style={styles.productImage} />
				<Text style={styles.productName}>{item.Title}</Text>
			</TouchableOpacity>
		)
	};


	if (loading) {
		return (
			<View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, }}>
				<Loader text='Loading...' />
			</View>
		)
	}







	return (
		<View style={{ flex: 1, }}>
			<Header
				leftIcon={require("../assets/icons/backArrow.png")}
				// rightIcon={require('../assets/icons/shopping-cart.png')}
				title={"NEW RELEASES"}
				onClickLeftIcon={() => { navigation.goBack() }}
				onClickRightIcon={() => { return }}

			/>

			<NoInternetConn />



			<View style={styles.container}>
				<Image style={styles.searchIcon} source={require("../assets/icons/search.png")} />
				<TextInput
					ref={searchRef}
					style={styles.input}
					placeholder={isListening ? "Speak now" : "Search by title and class"}
					value={search}
					onChangeText={(text) => SearchFilter(text)}
					autoCapitalize='none'
					autoComplete='off'
					autoCorrect={false}
				/>
				{search == "" ?
					(<TouchableOpacity
						onPress={(() => {
							isListening ? stopListening() : startListening()
						})}
					>
						{isListening ?
							(<View style={styles.stopVoice}></View>) :
							(<Image style={styles.mic} source={require("../assets/icons/mic.png")} />)
						}
					</TouchableOpacity>) :
					(
						<TouchableOpacity
							onPress={(() => {
								searchRef.current.clear()
								SearchFilter('')
								setSearch("")
							})}>
							<Image style={styles.closeIcon} source={require("../assets/icons/close.png")} />
						</TouchableOpacity>
					)}

			</View>

			<View style={styles.listContainer}>
				{error &&
					<>
						<Text style={styles.error}>{error}</Text>
						<Text style={styles.suggestion}>Suggestions:</Text>
					</>
				}
				<FlatList
					data={oldData}
					scrollEnabled={true}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					numColumns={2} // Display 2 items in a row
					// onEndReached={loadMoreData}
					onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={onRefresh}
						/>

					}

				/>
			</View>










		</View>
	)
}

export default NewReleases

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 10,
		marginVertical: 10,
		borderColor: rsplTheme.textColorBold,
		borderWidth: .5,
		borderRadius: 50,
		margin: 10,
	},
	searchIcon: {
		marginRight: 15,
		width: 18,
		height: 18,
		tintColor: rsplTheme.textColorLight,
		resizeMode: 'contain',
	},
	mic: {
		width: 20,
		height: 20,
		resizeMode: "contain",
		margin: 10,
		alignSelf: "center",
		tintColor: rsplTheme.textColorLight
	},
	voiceButtonText: {
		fontSize: 24,
		// margin: 10,
		width: 25,
		// height: 25,
	},
	stopVoice: {
		width: 15,
		height: 15,
		margin: 10,
		borderRadius: 15 / 2,
		alignSelf: "center",
		backgroundColor: rsplTheme.rsplRed
	},
	closeIcon: {
		margin: 5,
		width: 25,
		height: 25,
		resizeMode: 'contain',
	},
	input: {
		flex: 1,
		// height: 50,
		paddingVertical: 8,
		paddingHorizontal: 8,
		// borderRadius: 10,
		fontSize: 18,
		color: rsplTheme.textColorBold
	},
	listContainer: {
		flex: 1,
		padding: 8,
		// marginBottom: "12%"
	},

	productItem: {
		flex: 1,
		margin: 8,
		backgroundColor: rsplTheme.rsplLightGrey,
		borderRadius: 8,
		overflow: 'hidden',
		padding: 16,
		alignItems: 'center',
	},
	productImage: {
		width: "100%",
		height: 200,
		resizeMode: "contain",
		marginBottom: 8,
		borderRadius: 8,
	},
	productName: {
		fontSize: 15,
		fontWeight: '600',
		color: rsplTheme.textColorBold
	},
	productPrice: {
		fontSize: 14,
		color: '#888',
	},
	loader: {
		marginVertical: 20,
	},
	error: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "400",
		color: "#e23636"
	},
	suggestion: {
		color: rsplTheme.textColorBold,
		marginVertical: 10,
		fontSize: 16,
		fontWeight: "600"
	}

})