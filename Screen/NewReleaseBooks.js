import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, TextInput, Image, RefreshControl, } from 'react-native'
import React, { useEffect, useRef, useState, useCallback, } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';
import Voice from '@react-native-voice/voice';
import NoInternetConn from './NoInternetConn';




const NewReleaseBooks = ({ route }) => {
	const navigation = useNavigation()
	const myTitleRef = useRef({ title: route.params.title, name: route.params.name, id: route.params.id });
	const { title, name, id } = myTitleRef.current;

	const [newRelesesAllBook, setNewRelesAllBook] = useState([])
	const [oldNewRelesesAllBook, setOldNewRelesAllBook] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("");
	const [search, setSearch] = useState('');
	const searchRef = useRef()
	const [isListening, setIsListening] = useState(false)

	useEffect(() => {
		NewReleaseAllBook()
		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechEnd = onSpeechEnd;
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechError = (error) => { console.log("onSpeechError:", error) };
		return () => { Voice.destroy().then(Voice.removeAllListeners) }
	}, [])


	const NewReleaseAllBook = async () => {
		setLoading(true)
		const payLoad = {
			"api_token": token,
			"id": id
		}

		await Services.post(apiRoutes.newReleasesAllBooks, payLoad)
			.then((res) => {
				if (res.status === "Success" && res.length != 0) {
					setNewRelesAllBook(res.result)
					setOldNewRelesAllBook(res.result)
				} else {
					return
					Alert.alert("Info", res.massage)
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
		setError("");
		setTimeout(() => {
			NewReleaseAllBook()
			setSearch("")
			setLoading(false)
		}, 1000);
	}, [loading])

	const SearchFilter = async (text) => {
		setSearch(text);
		const newData = newRelesesAllBook.filter(item =>
			item?.product_title.toLowerCase().includes(text.toLowerCase())
		);
		if (!newData.length) {
			setError(`Your search : ${text} did not match any product.`)
		} else {
			setOldNewRelesAllBook(newData);
			setError("")
		}

	}

	const GetProductDetails = (item) => {
		navigation.navigate("ProductDetail",
			{
				item: [item],
				productId: item.productId,
				imgArray: [
					{ item: item.full_front_image_path },
					{ item: item.full_back_image_path }
				],
				title: "Product details"
			}
		)

	}


	const onSpeechEnd = (event) => {
		console.log("Speech End.....", event);
		setIsListening(false)

	}
	const onSpeechStart = (event) => {
		console.log("Speech Start.....", event);
		setIsListening(true)
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
			await Voice.start("en-US",)
			setTimeout(() => {
				setIsListening(false)
			}, 5000);
		} catch (er) {
			console.log("Start Listening error:", er)
		}
	}

	const stopListening = async () => {
		try {
			await Voice.stop();
			Voice.removeAllListeners();
			setIsListening(false);
		} catch (error) {
			console.log("Stop Listening error:", error)
		}
	}


	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity onPress={(() => { GetProductDetails(item) })} style={styles.productItem}>
				<Image source={{ uri: item.full_front_image_path }} style={styles.productImage} />
				<Text numberOfLines={3} style={styles.productName}>{item.product_title}</Text>
				<Text style={styles.productPrice}><Text style={{ fontSize: 18, color: rsplTheme.textColorBold, }}>{`\u20B9`}</Text> {`${item.book_price}`}</Text>
				{item?.book_perDiscount != 0 &&
					<View style={styles.priceBox}>
						<Text style={{}}>MRP:</Text>
						<Text style={styles.productMrp}>{`\u20B9 ${item.book_mrp}`}</Text>
						<Text style={styles.productDiscount}>{`(${item?.book_perDiscount == undefined ? 0 : item?.book_perDiscount}% off)`}</Text>
					</View>
				}
			</TouchableOpacity>
		)
	};






	if (loading) {
		return (
			<View style={styles.loader}>
				<Loader text='Loading...' />
			</View>
		)
	}





	return (
		<View style={styles.container}>
			<Header
				leftIcon={require("../assets/icons/backArrow.png")}
				// rightIcon={require('../assets/icons/shopping-cart.png')}
				title={title}
				onClickLeftIcon={() => { navigation.goBack() }}
				onClickRightIcon={() => { return }}
			/>

			<NoInternetConn />

			<View style={styles.searchContainer}>
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
				// maxLength={40}
				/>
				{search == "" ?
					(
						<TouchableOpacity
							onPress={(() => {
								isListening ? stopListening() : startListening()
							})}
						>
							{isListening ?
								(<View style={styles.stopVoice}></View>) :
								(<Image style={styles.mic} source={require("../assets/icons/mic.png")} />)
							}
						</TouchableOpacity>
					) :
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





			<View style={{ flex: 1, }}>
				{error &&
					<>
						<Text style={styles.error}>{error}</Text>
						<Text style={styles.suggestion}>Suggestions:</Text>
					</>
				}
				<FlatList
					data={oldNewRelesesAllBook}
					scrollEnabled={true}
					keyExtractor={(item) => item.productId}
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

export default NewReleaseBooks

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: rsplTheme.rsplWhite
	},
	loader: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		right: 0
	},
	searchContainer: {
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
		// backgroundColor: rsplTheme.rsplLightGrey,
		// borderRadius: 10,
		fontSize: 18,
		color: rsplTheme.textColorBold
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
		width: "100%",
		fontWeight: '600',
		color: rsplTheme.textColorBold,
		// textAlign: 'center',
	},
	priceBox: {
		marginVertical: 5,
		width: "100%",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		// alignItems:"center",
	},
	productPrice: {
		fontSize: 24,
		fontWeight: '600',
		paddingVertical: 6,
		alignSelf: "flex-start",
		color: rsplTheme.textColorBold,
	},
	productMrp: {
		fontSize: 16,
		// padding:3,
		color: rsplTheme.rsplRed,
		textDecorationLine: "line-through"
	},
	productDiscount: {
		fontSize: 16,
		// padding:3,
		color: '#888',
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
	},
	stopVoice: {
		width: 15,
		height: 15,
		margin: 10,
		borderRadius: 15 / 2,
		alignSelf: "center",
		backgroundColor: rsplTheme.rsplRed
	},
	mic: {
		width: 20,
		height: 20,
		resizeMode: "contain",
		margin: 10,
		alignSelf: "center",
		tintColor: rsplTheme.textColorLight
	},

})