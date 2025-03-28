import { FlatList, Image, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Text, TouchableOpacity, View, Modal, Alert, LogBox, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant'
import Header from '../comman/Header';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Services from '../services';
import Loader from '../constant/Loader';
import StarRating from './StarRating';
import SwipeDownModal from './SwipeDownModal';
import { MyContext } from '../Store';
import AddToCartPopupMessage from './AddToCartPopupMessage';
import NoInternetConn from './NoInternetConn';
import Icon from 'react-native-vector-icons/AntDesign';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';



const ProductDetail = ({ navigation, route }) => {
	const { userData, logout, addToCart, setSelectedTab, addToCartPopup, setAddToCartPopup, cartList, getWishListProduct } = useContext(MyContext)





	const { item, title, imgArray, productId, } = route.params || {}
	const { width, height } = Dimensions.get("window")
	const [currentIndex, setCurrentIndex] = useState(0)
	const [modalView, setModalView] = useState(false)
	const [singleProduct, setSingleProduct] = useState({ frontBackImgArry: [], isPaperbackAvailable: "", isEbookAvailable: "", eBook_stock: "", book_stock: "", item: [], comment: [], isWishList: "", commentNotFounde: "" })
	const [loading, setLoading] = useState(false)
	const [activeButton, setActiveButton] = useState("Paperback")
	const [addWishListMessage, setAddWishListMessage] = useState({ isVisible: false, message: "" })
	const [lastCartId, setLastCartId] = useState(null)
	const [descriptionAndReviewsBtn, setDescriptionAndReviewsBtn] = useState(0)




	const viewCartIds = []
	for (const key in cartList.Data) {
		// console.log(cartList.Data, "cartList.Data")
		viewCartIds.push(cartList.Data[key].productId)
		if (cartList.Data[key].productId == productId && lastCartId == null) {
			setLastCartId(cartList?.Data[key]?.id)
		}
	}


	const ImageView = ({ img }) => {
		return (
			<View style={{}}>
				{loading && <View style={styles.loader}><Loader text='Image loading...' /></View>}
				<TouchableOpacity onPress={(() => {
					setModalView(true);
				})}
					style={{ width: width, justifyContent: "center", alignItems: "center", backgroundColor: rsplTheme.rsplLightGrey }}>
					<Image onLoad={() => setLoading(false)} onError={() => { setLoading(false) }} style={{ width: "95%", height: "95%", resizeMode: "contain", }} src={img} />
				</TouchableOpacity>
			</View>
		)
	}

	const handleButton = (buttonName) => {
		setActiveButton(buttonName)
		checkProductInWishlist(buttonName)
	}


	useEffect(() => {
		getSingleProductList()
	}, [])

	const getSingleProductList = async () => {
		setLoading(true)
		const payLoad = {
			"api_token": token,
			"id": productId,
			"userId": userData.data[0]?.id,
			"productType": activeButton
		}
		// console.log(payLoad, "dkdk>?:")
		await Services.post(apiRoutes.singleProductList, payLoad)
			.then((res) => {
				if ((res.status == "Success") && (res.result?.length != 0)) {
					const frontImage = res.result[0].full_front_image_path;
					const backImage = res.result[0].full_back_image_path
					const paperBack = res.result[0].paperbook_available
					const eBook = res.result[0].eBook_available
					const eBookPublish = res.result[0].ebook_publish
					const eBook_stock = res.result[0].eBook_stock
					const book_stock = res.result[0].book_stock
					setSingleProduct((prev) => { return { ...prev, frontBackImgArry: [frontImage, backImage], isPaperbackAvailable: paperBack, isEbookAvailable: eBook, isEbookPublish: eBookPublish, eBook_stock: eBook_stock, book_stock: book_stock, item: res.result, isWishList: res.isWishlist } })
					getUserComments()
				} else if (res.status == "failed") {
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

	const getUserComments = async () => {
		const payLoad = {
			"api_token": token,
			"id": productId
		}
		// console.log(payLoad, "of Comments??")

		await Services.post(apiRoutes.productReviews, payLoad)
			.then((res) => {
				if (res.status === "success" && res.result.length != 0) {
					setSingleProduct((prev) => { return { ...prev, comment: res.result } })
				} else {
					setSingleProduct((prev) => { return { ...prev, commentNotFounde: res.message } })
					return
					Alert.alert("Review", res.message)
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { })
	}

	const productAddtoCart = () => {
		if (!userData.isLogin) {
			setSelectedTab(4)
			navigation.navigate("Main")
		} else {
			// setSelectedTab(0)
			addToCart(navigation, productId, activeButton,)
		}

	}

	const productBuyNow = () => {
		if (!userData.isLogin) {
			setSelectedTab(4)
			navigation.navigate("Main")
		} else {
			addToCart(navigation, productId, activeButton, "buyNow")
			navigation.navigate("BuyNow", { productId, singleProduct, activeButton, lastCartId })
		}
	}

	const addToWishlist = async () => {
		const payLoadOfWishlist = {
			"api_token": token,
			"userId": userData.data[0]?.id,
			"bookId": singleProduct.item[0]?.productId,
			"product_type": activeButton
		}
		await Services.post(apiRoutes.addToWishlist, payLoadOfWishlist)
			.then((res) => {
				if (res.status == "success") {
					// setWishListActive(!wishListActive)
					setAddWishListMessage((prev) => { return { ...prev, isVisible: true, message: res.message } })
					getSingleProductList()
					setTimeout(() => {
						setAddWishListMessage((prev) => { return { ...prev, isVisible: false } })
						getWishListProduct()
					}, 2000)
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { })
	}

	const removeToWishlist = async () => {
		const payLoadOfWishlist = {
			"api_token": token,
			"userId": userData.data[0]?.id,
			"bookId": singleProduct.item[0]?.productId,
			"product_type": activeButton
		}
		// console.log(payLoadOfWishlist, "FFF")

		await Services.post(apiRoutes.deleteToWishlist, payLoadOfWishlist)
			.then((res) => {
				if (res.status == "success") {
					setAddWishListMessage((prev) => { return { ...prev, isVisible: true, message: res.message } })
					getSingleProductList()
					setTimeout(() => {
						setAddWishListMessage((prev) => { return { ...prev, isVisible: false } })
						getWishListProduct()
					}, 2000)
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { })
	}

	const checkProductInWishlist = async (buttonName) => {
		const payLoad = {
			"api_token": token,
			"id": productId,//singleProduct.item[0]?.productId,
			"userId": userData.data[0]?.id,
			"productType": buttonName
		}
		// console.log(payLoad, "payllll>>??")
		await Services.post(apiRoutes.checkItemInWishlist, payLoad)
			.then((res) => {
				if (res.status == "success") {
					setSingleProduct((prev) => { return { ...prev, isWishList: 1 } })
				} else {
					setSingleProduct((prev) => { return { ...prev, isWishList: 0 } })
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { });

	}






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
				rightIcon={require('../assets/icons/shopping-cart.png')}
				title={title}
				onClickLeftIcon={() => { navigation.goBack() }}
				onClickRightIcon={() => { setSelectedTab(3); navigation.navigate("Main") }}
			/>

			<NoInternetConn />


			{/* Notifications of cart items */}
			{userData.isLogin && cartList.length > 0 &&
				<TouchableOpacity onPress={(() => { setSelectedTab(3); navigation.navigate("Main") })} style={styles.cartNotiFi}>
					<Text style={styles.cartLengthValue}>{cartList.length}</Text>
				</TouchableOpacity>
			}

			<View style={{ height: 55, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
				{singleProduct?.isPaperbackAvailable == 1 ?
					(<TouchableOpacity onPress={(() => { handleButton("Paperback") })} style={{ backgroundColor: activeButton == "Paperback" ? rsplTheme.textColorBold : "transparent", borderWidth: .5, width: "45%", height: 40, justifyContent: "center", alignItems: "center" }}>
						<Text style={[styles.paperback, { color: activeButton == "Paperback" ? rsplTheme.rsplWhite : null }]}>Paperback </Text>
					</TouchableOpacity>) : null
				}
				{singleProduct?.isEbookAvailable === 1 && singleProduct?.isEbookPublish === 1 ?

					(<TouchableOpacity onPress={(() => { handleButton("Ebook") })} style={{ backgroundColor: activeButton == "Ebook" ? rsplTheme.textColorBold : "transparent", borderWidth: .5, width: "45%", height: 40, justifyContent: "center", alignItems: "center" }}>
						<Text style={[styles.eBook, { color: activeButton == "Ebook" ? rsplTheme.rsplWhite : null }]}>Ebook</Text>
					</TouchableOpacity>) : null
				}


			</View>


			<ScrollView showsVerticalScrollIndicator={false} style={styles.scrolHeight}>

				<View style={{ height: height / 2, backgroundColor: rsplTheme.rsplWhite }}>
					<TouchableOpacity onPress={(() => {
						if (!userData.isLogin) {
							setSelectedTab(4)
							navigation.navigate("Main")
						}
						singleProduct.isWishList == 0 ? addToWishlist() : removeToWishlist()
					})} style={styles.wishListPosition}>
						<Icon name={singleProduct.isWishList ? "heart" : "hearto"} size={25} color={singleProduct.isWishList ? rsplTheme.rsplRed : rsplTheme.rsplBlack} />
						{/* <Image style={[styles.wishListIcon, { tintColor: singleProduct.isWishList ? rsplTheme.rsplRed : rsplTheme.rsplBlack }]} source={singleProduct.isWishList ? require("../assets/icons/love_fill.png") : require("../assets/icons/love.png")} /> */}
					</TouchableOpacity>
					<FlatList
						data={singleProduct?.frontBackImgArry}
						renderItem={({ item, index }) => <ImageView img={item} />}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						pagingEnabled
						onScroll={e => {
							const offsetVal = e.nativeEvent.contentOffset.x
							setCurrentIndex((offsetVal / width).toFixed(0))
						}}
					/>
				</View>


				{/* image scroll gesture view */}
				<View style={{ flexDirection: "row", width: width, justifyContent: "center", alignItems: "center" }}>
					{singleProduct.frontBackImgArry?.map((item, index) => {
						return (
							<View key={index}
								style={[styles.imgView, { backgroundColor: currentIndex == index ? rsplTheme.rsplBackgroundColor : rsplTheme.rsplWhite }]}>
							</View>
						)
					})}
				</View>

				{/* product details meta data ..... */}
				<View>
					{singleProduct.item.map((item, index) => {
						return (
							<View style={styles.metaDataBox} key={item.productId}>
								<Text style={styles.productHeading}>{item.product_title}</Text>
								<View style={styles.allPrictType}>
									{activeButton == "Ebook" ?
										(
											<>
												<Text style={styles.productPrice}><Text style={{ fontSize: 24, color: rsplTheme.textColorBold, }}>{`\u20B9`}</Text>{`${item.ebook_price}`}</Text>
												{item.ebook_perDiscount != 0 &&
													<>
														<Text style={{ fontSize: 16, color: rsplTheme.textColorBold }}><Text style={styles.productMrp}>{`\u20B9${item.ebook_mrp}`}</Text></Text>
														<Text style={styles.productDiscount}>({item.ebook_perDiscount}% off) </Text>
													</>
												}
											</>
										) :
										(
											<>
												<Text style={styles.productPrice}><Text style={{ fontSize: 24, color: rsplTheme.textColorBold, }}>{`\u20B9`}</Text>{`${item.book_price}`}</Text>
												{item.book_perDiscount != 0 &&
													<>
														<Text style={{ fontSize: 16, color: rsplTheme.textColorBold }}><Text style={styles.productMrp}>{`\u20B9${item.book_mrp}`}</Text></Text>
														<Text style={styles.productDiscount}>({item.book_perDiscount}% off) </Text>
													</>
												}
											</>
										)
									}

								</View>

								<View style={{ flex: 1, }}>

									<View style={styles.metaDataDetail}>
										<View style={styles.side1}>
											<Text style={[styles.descriptionOfBook, { fontSize: 20, fontWeight: "600" }]}>Description:</Text>
										</View>
										<View style={styles.side2}>
											<Text style={styles.descriptionOfBook}></Text>
										</View>
									</View>

									{activeButton == "Ebook" ?
										(
											<>
												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Publisher:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Publisher}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Author:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Author}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Language:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Language}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Class:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.class}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Subject:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.subject}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>ISBN:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.isbn}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Supported Device:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.supported_device}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Note:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={[styles.descriptionOfBook, { color: rsplTheme.rsplRed }]}>{`${item.note} \n ${item.eBook}`}</Text>
													</View>
												</View>
											</>
										) :
										(
											<>
												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Delivery:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.delivery}</Text>
													</View>
												</View>
												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Publisher:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Publisher}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Binding:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Binding}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Author:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Author}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Language:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.Language}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Class:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.class}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Subject:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.subject}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>ISBN:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.isbn}</Text>
													</View>
												</View>

												<View style={styles.metaDataDetail}>
													<View style={styles.side1}>
														<Text style={styles.descriptionOfBook}>Weight:</Text>
													</View>
													<View style={styles.side2}>
														<Text style={styles.descriptionOfBook}>{item.book_weight / 1000} KG</Text>
													</View>
												</View>
											</>
										)
									}
								</View>
							</View>
						)
					})}
				</View>


				{/* comment and review section   */}

				<View style={styles.commentBox}>

					<View style={{ padding: 6, borderTopWidth: 1, borderTopColor: rsplTheme.jetGrey, flexDirection: "row", justifyContent: "space-around" }}>
						<TouchableOpacity onPress={() => setDescriptionAndReviewsBtn(0)} style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: rsplTheme.jetGrey, backgroundColor: descriptionAndReviewsBtn === 0 ? rsplTheme.jetGrey : rsplTheme.rsplWhite }}>
							<Text style={{ color: descriptionAndReviewsBtn === 0 ? rsplTheme.rsplWhite : rsplTheme.jetGrey, fontWeight: "500" }} >Description</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setDescriptionAndReviewsBtn(1)} style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: rsplTheme.jetGrey, backgroundColor: descriptionAndReviewsBtn === 1 ? rsplTheme.jetGrey : rsplTheme.rsplWhite }}>
							<Text style={{ color: descriptionAndReviewsBtn === 1 ? rsplTheme.rsplWhite : rsplTheme.jetGrey, fontWeight: "500" }}>Reviews</Text>
						</TouchableOpacity>
					</View>

					{descriptionAndReviewsBtn === 0 &&
						<>
							{singleProduct?.item?.map((item, index) => {
								let source = null;
								if (activeButton === "Paperback") {
									source = { html: `${item?.book_desc == "" ? "No description available." : item?.book_desc} ` };
								} else if (activeButton === "Ebook") {
									source = { html: `${item?.ebook_desc == null ? "eBook description is not available." : item?.ebook_desc} ` };
								}
								return (
									<View key={item.productId}>
										<RenderHtml
											contentWidth={width}
											source={source}
										/>
									</View>
								)
							})}
						</>
					}
					{descriptionAndReviewsBtn === 1 &&
						<>
							<Text style={styles.reviewComment}>Customer Review</Text>
							{singleProduct?.comment.length > 0 ?
								<View>
									{singleProduct.comment?.map((item, index) => {
										const currentDate = new Date(item.created_at);
										const dateFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
										const formattedDate = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(currentDate);
										const timeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
										const formattedTime = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(currentDate);
										const dateTime = `${formattedDate} ${formattedTime}`
										return (
											<View key={item.id}>
												<View style={styles.metaDataDetail}>
													<View style={[styles.side1, { width: 60, }]}>
														<View style={styles.ratingCircle}>
															<Text style={[styles.descriptionOfBook, { fontSize: 20, fontWeight: "600", color: "white" }]}>{item.name[0]}</Text>
														</View>
													</View>
													<View style={[styles.side2, { borderBottomWidth: .5, marginBottom: 12, }]}>
														<Text style={styles.reviewName}>{item.name}</Text>
														<Text style={styles.reviewHeading}>{item.headline}</Text>
														<Text style={styles.reviewDate}>{dateTime}</Text>
														<StarRating rating={item.star} />
														<Text style={styles.descriptionOfBook}>{item.review}</Text>
													</View>
												</View>

											</View>
										)
									})}
								</View> :
								<View>
									<Text>{singleProduct?.commentNotFounde}</Text>
								</View>
							}
						</>

					}


				</View>







			</ScrollView>

			<SwipeDownModal modalView={modalView} setModalView={setModalView} image={singleProduct.frontBackImgArry} />


			{/* add to cart and buy now footer button display */}
			{singleProduct?.book_stock != 0 ?
				<View style={styles.addToCartBox}>
					{viewCartIds.includes(productId) ?
						<TouchableOpacity onPress={(() => { setSelectedTab(3); navigation.navigate("Main") })} style={styles.addToCart}>
							<Text style={styles.addNbuy} >Go to Cart</Text>
						</TouchableOpacity> :
						<TouchableOpacity onPress={(() => { productAddtoCart() })} style={styles.addToCart}>
							<Text style={styles.addNbuy} >Add to Cart</Text>
						</TouchableOpacity>
					}

					<TouchableOpacity onPress={(() => { productBuyNow() })} style={styles.buyNow}>
						<Text style={styles.addNbuy} >Buy Now</Text>
					</TouchableOpacity>
				</View> :
				<View style={[styles.addToCart, { alignSelf: "center" }]}>
					<Text style={styles.addNbuy} >OUT OF STOCK</Text>
				</View>
			}

			{addToCartPopup.isVisible &&
				<AddToCartPopupMessage isVisible={addToCartPopup.isVisible} message={addToCartPopup.message} />
			}
			{addWishListMessage.isVisible &&
				<AddToCartPopupMessage isVisible={addWishListMessage.isVisible} message={addWishListMessage.message} />
			}
		</View>
	)
}

export default ProductDetail

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
		right: 0,
		zIndex: 1,
	},
	imgSize: {
		width: "100%",
		aspectRatio: 1,
		resizeMode: "contain",
		// borderWidth:1,
		// flex:1,
	},
	metaDataBox: {
		margin: 10,
		padding: 5,
		// backgroundColor: rsplTheme.rsplLightGrey
	},
	productHeading: {
		fontWeight: "500",
		fontSize: 20,
		color: rsplTheme.jetGrey,
		// padding: 10
	},
	allPrictType: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	productPrice: {
		fontSize: 35,
		fontWeight: '600',
		paddingVertical: 6,
		alignSelf: "flex-start",
		color: rsplTheme.textColorBold,
	},
	productMrp: {
		fontSize: 25,
		// padding:3,
		color: rsplTheme.rsplRed,
		textDecorationLine: "line-through"
	},
	productDiscount: {
		fontSize: 25,
		// padding:3,
		// color: '#888',
		color: rsplTheme.rsplGreen
	},
	imgCarousel: {
		backgroundColor: rsplTheme.rsplWhite,
		minHeight: 350,
		marginTop: 10,
		padding: 10,
	},
	salePrice: {
		padding: 10,
		fontSize: 40,
		fontWeight: "500",
		color: rsplTheme.rsplBackgroundColor
	},
	addToCartBox: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		position: "absolute",
		bottom: 0,
		flex: 1,
		width: "100%",
		padding: 10,
		backgroundColor: rsplTheme.rsplWhite
	},
	addToCart: {
		backgroundColor: rsplTheme.orange,
		width: "45%",
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
		borderRadius: 50
	},
	buyNow: {
		backgroundColor: rsplTheme.rsplBgColor,
		width: "45%",
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
		borderRadius: 50
	},
	addNbuy: {
		color: rsplTheme.rsplBlack,
		fontWeight: "500",
		fontSize: 15
	},
	description: {
		fontSize: 20,
		fontWeight: "500",
		color: rsplTheme.jetGrey,
		marginBottom: 5,
	},
	discount: {
		width: 45,
		height: 45,
		borderRadius: 45 / 2,
		backgroundColor: rsplTheme.rsplRed,
		position: "absolute",
		left: "2%",
		top: "20%",
		zIndex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	discountTxt: {
		color: rsplTheme.rsplWhite,
		fontWeight: "600",
		textAlign: "center"
	},
	imgView: {
		width: 12,
		height: 12,
		borderRadius: 6,
		borderWidth: .5,
		borderColor: rsplTheme.jetGrey,
		marginLeft: 15,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// marginTop: 22,
		// width:"100%",
		// backgroundColor: "red"
	},
	modalView: {
		// margin: 20,
		// flex: 1,
		width: "100%",
		minHeight: "100%",
		backgroundColor: rsplTheme.rsplLightGrey + 75,
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	paperback: {
		fontSize: 16,
		color: rsplTheme.textColorBold
	},
	eBook: {
		fontSize: 16,
		color: rsplTheme.textColorBold
	},
	scrolHeight: {
		marginBottom: "15%",
		width: "100%"
	},
	metaDataDetail: {
		flexDirection: 'row',
		flex: 1,
		// backgroundColor: "green",
	},
	side1: {
		width: 125,
		padding: 4,

	},
	side2: {
		padding: 4,
		flex: 1,
		// backgroundColor: "white",
	},
	descriptionOfBook: {
		fontSize: 16,
		// paddingVertical: 8,
		fontWeight: "500",
		color: rsplTheme.textColorBold
	},
	wishListIcon: {
		width: 30,
		height: 30,
		resizeMode: "center",
	},
	wishListPosition: {
		position: "absolute",
		top: "5%",
		left: "91%",
		// right: 0,
		// bottom: 0,
		zIndex: 999,
	},
	commentBox: {
		flex: 1,
		margin: 10,
		// backgroundColor: "grey"
		// padding: 10,

	},
	reviewComment: {
		paddingVertical: 10,
		fontSize: 20,
		fontWeight: "600",
		color: rsplTheme.textColorBold,
	},
	ratingCircle: {
		width: 45,
		height: 45,
		borderRadius: 45 / 2,
		backgroundColor: rsplTheme.textColorLight,
		alignItems: "center",
		justifyContent: "center",

	},
	reviewHeading: {
		fontSize: 16,
		fontWeight: "400",
		color: rsplTheme.textColorBold,
	},
	reviewName: {
		fontSize: 18,
		fontWeight: "600",
		color: rsplTheme.textColorBold,
	},

	reviewDate: {
		fontSize: 15,
		color: rsplTheme.textColorLight,
		paddingVertical: 5
	},
	cartNotiFi: {
		position: "absolute",
		top: 8,
		right: "4%",
		width: 18,
		height: 18,
		borderRadius: 18 / 2,
		backgroundColor: rsplTheme.rsplWhite,
		borderWidth: .2,
		alignItems: "center",
		justifyContent: "center",
	},
	cartLengthValue: {
		fontSize: 10,
		color: rsplTheme.textColorBold
	}

})