import { Alert, StyleSheet, Text, View, FlatList, Button, RefreshControl, Image, TouchableOpacity, ActivityIndicator, } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import Header from '../comman/Header'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
import { MyContext } from '../Store'
import Loader from '../constant/Loader'
import CartSummery from './CartSummery'
import NoInternetConn from './NoInternetConn'



const Cart = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [quantity, setQuantity] = useState();
  const [cartId, setCartId] = useState()
  const [loader, setLoader] = useState({ isProductUpdateLoader: false, isProductDeleteLoader: false })

  const {
    userData, //for userData details
    addToCart,
    setSelectedTab, //for selected Bottom Tab function
    getAllCartItems, //for Cart Item list functions in Store.js
    setCartList, //for Cart Item set when seccess in Store.js
    cartList, //for Cart Item variable in Store.js
    getGrandTotal, //for grand total function in Store.js
    grandTotal,
  } = useContext(MyContext)


  // useEffect(() => {
  //   if (userData.isLogin && cartList.length) {
  //     const cartIDs = []
  //     if (isFocused) {
  //       for (let cart of cartList.Data) {
  //         cartIDs.push(cart.id)
  //       }
  //       getGrandTotal(cartIDs)
  //     }
  //   }
  // }, [isFocused,])

  useEffect(() => {
    updateCartQuantity()
  }, [quantity])





  // const onRefresh = useCallback(() => {
  //   setCartList((prev) => { return { ...prev, isLoader: true, } });
  //   setTimeout(() => {
  //     getAllCartItems()
  //     setCartList((prev) => { return { ...prev, isLoader: false, } });
  //   }, 1000);
  // }, [cartList.isLoader])


  const increaseQuantity = (item) => {
    const productId = item.productId
    const productType = item.product_type
    addToCart(navigation, productId, productType, "IncrementalQnty")
    // setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = async (item) => {
    const productId = item.productId
    const productType = item.product_type
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0].id,
      "bookid": productId,
      "product_type": productType,
    }
    await Services.post(apiRoutes.productQuantityDecrement, payLoad)
      .then((res) => {
        if (res.status == "success") {
          getAllCartItems() // for cart items refresh every decreasing quantity
        } else if (res.success == false) {
          Alert.alert(`${res.errors}`)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })
  };

  const deleteCartItem = async (cartId) => {
    setCartId(cartId)
    setLoader((prev) => { return { ...prev, isProductDeleteLoader: true } })
    const payLoad = {
      "api_token": token,
      "cart_id": cartId
    }
    await Services.post(apiRoutes.removeCardItem, payLoad)
      .then((res) => {
        if (res.status == "success") {
          getAllCartItems() //// for cart items refresh every delete cart item
        } else if (res.status == "failed") {
          Alert.alert(`${res.message}`)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader((prev) => { return { ...prev, isProductDeleteLoader: false } }) })
  }

  // if (cartList?.isLoader) {
  //   return (
  //     <View style={styles.loader}>
  //       <Loader text='Loading...' />
  //     </View>
  //   )
  // }


  const increment = (cartId) => {
    setQuantity(cartId.quantity);
    setQuantity(prevCount => prevCount + 1);
    setCartId(cartId?.id)
  };

  const decrement = (cartId) => {
    setQuantity(cartId.quantity);
    setQuantity(prevCount => (prevCount > 1 ? prevCount - 1 : prevCount));
    setCartId(cartId?.id)
  };

  const updateCartQuantity = async () => {
    setLoader((prev) => { return { ...prev, isProductUpdateLoader: true } })
    const payLoad = {
      "api_token": `${token}`,
      "userid": `${userData?.data[0]?.id}`,
      "cartID": `${cartId}`,
      "quantity": `${quantity}`
    }
    // console.log(payLoad, "updateCartQuantity")
    await Services.post(apiRoutes.updateCartQuantity, payLoad)
      .then((res) => {
        if (res.status == "success") {
          getAllCartItems() // for upadate qunatity and price, discount
        } else if (res.status == "error") {
          console.log(res.message, "else if")
        }

      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader((prev) => { return { ...prev, isProductUpdateLoader: false } }) })
  }



  const renderItem = ({ item, index }) => {
    // textDecorationLine: "line-through"
    // console.log(index, "Product")
    return (
      <View style={styles.cartMainContainer}>
        <TouchableOpacity onPress={(() => { navigation.navigate("CartItemDetails", { data: item }) })} style={styles.containerOfItem}>
          <Image source={{ uri: item.full_image_url }} style={styles.image} />

          <View style={{ flex: 1, }}>
            <Text numberOfLines={2} style={styles.title}>{item.product_title}</Text>
            <View style={{ flexDirection: "row", }}>
              <View style={{ width: 100 }}>
                <Text style={styles.price}>Class</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.price}>{`${item.class}`}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", }}>
              <View style={{ width: 100 }}>
                <Text style={styles.price}>Subject</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.price}>{`${item.subject}`}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", }}>
              <View style={{ width: 100 }}>
                <Text style={styles.price}>Product Type</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.price}>{`${item.product_type}`}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", }}>
              <View style={{ width: 100, }}>
                <Text style={styles.price}>Quantity</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.price}>{`${item.quantity}`}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.price, { fontSize: 17, color: rsplTheme.rsplGreen, fontWeight: "600", }]}>{`₹ ${item.total_price}`}</Text>
              <Text style={[styles.price, { textDecorationLine: "line-through", color: rsplTheme.jetGrey, marginLeft: 12, }]}>{`₹ ${item.total_mrp}`}</Text>
            </View>

            {item.disPercent != 0 &&
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 145, }}>
                  <Text style={[styles.price, { fontWeight: "600" }]}>{`You save ₹ ${item?.total_discount}    `} </Text>
                </View>
                <View style={{ flex: 1, }}>
                  <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <Text style={{ padding: 4, backgroundColor: rsplTheme.rsplRed, color: rsplTheme.rsplWhite, textAlign: "center", }}>{`${item.disPercent}% off`}</Text>
                  </View>
                </View>
              </View>
            }

          </View>

        </TouchableOpacity>


        <View style={styles.quantityContainer}>
          {item.product_type !== "Ebook" &&
            <>

              {loader.isProductUpdateLoader && cartId == item.id ?
                <View style={{ alignSelf: "center", width: 130, height: 35, }}>
                  <ActivityIndicator />
                </View> :
                <View style={styles.buttonContainer}>
                  <TouchableOpacity disabled={item.quantity <= 1} onPress={(() => { decrement(item) })} style={[styles.pulsButton]}>
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  {/* <Text style={styles.countText}>{quantity}</Text> */}
                  <Text style={styles.countText}>{item.quantity}</Text>

                  <TouchableOpacity onPress={(() => { increment(item) })} style={[styles.minusButton]}>
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              }

              {/* <TouchableOpacity disabled={item.quantity <= 1} onPress={(() => { decreaseQuantity(item) })} style={[styles.quantityButton]}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={(() => { increaseQuantity(item) })} style={[styles.quantityButton]}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity> */}
            </>
          }

          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
            {loader.isProductDeleteLoader && cartId == item.id ?
              <ActivityIndicator /> :
              <TouchableOpacity onPress={(() => { deleteCartItem(item.id) })} >
                <Image style={styles.deleteImg} source={require("../assets/icons/trash.png")} />
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    )
  };





  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Cart Items"}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      <View style={styles.listContainer}>
        {cartList?.Data.length > 0 ?
          <View style={{ position: "relative", flex: 1, }}>
            <FlatList
              data={cartList.Data}
              scrollEnabled={true}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentInset={{ top: 0, bottom: 65, left: 0, right: 0 }}
              contentInsetAdjustmentBehavior="automatic"
              // numColumns={2} // Display 2 items in a row
              // onEndReached={loadMoreData}
              onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <Text style={styles.cartLength}>{`Cart Item ${cartList.Data.length}`}</Text>
                </>
              }
              // ListFooterComponent={<CartSummery totalItem={cartList.Data} />}
              stickyHeaderIndices={[cartList.Data.length]}
              contentContainerStyle={{ flexGrow: 1 }}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={cartList.isLoader}
            //     onRefresh={onRefresh}
            //   />
            // }
            />
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: rsplTheme.rsplWhite }}>
              <View style={{ flexDirection: "row", padding: 5, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ width: "50%", padding: 10, color: rsplTheme.textColorBold, fontSize: 18, fontWeight: "600" }}>{`\u20B9 ${grandTotal?.total}`}</Text>
                <TouchableOpacity onPress={(() => { navigation.navigate("OrderSummery") })} style={{ flex: 1, backgroundColor: rsplTheme.gradientColorRight, padding: 10, borderRadius: 6 }}>
                  <Text style={{ textAlign: "center", fontSize: 16, color: rsplTheme.rsplWhite, fontWeight: "600" }}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <View style={styles.emptyCartContain}>
            <View style={styles.emptyCartIconContainer}>
              <Image style={styles.emptyCartIcon} source={require("../assets/icons/empty-cart.png")} />
            </View>
            {/* <CartEmptyMessage text={cartList.message} /> */}
            <Text style={styles.cartEmpty}>{cartList?.message == "" ? "Empty cart" : cartList?.message}</Text>
            {/* Your Cart is <Text style={[styles.cartEmpty, { color: rsplTheme.gradientColorRight }]}>Empty</Text> */}
            <Text style={styles.cartStart}>Add items to get started</Text>
            <TouchableOpacity
              onPress={(() => {
                setSelectedTab(0)
                navigation.navigate("Main")
              })}
              style={{ backgroundColor: rsplTheme.gradientColorRight, padding: 10, width: 200, borderRadius: 50, marginTop: 20, }}>
              <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600", color: rsplTheme.rsplWhite }}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        }
      </View>





      {/* <RootStackScreen /> */}
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  cartLength: {
    fontSize: 15,
    color: rsplTheme.textColorBold,
    fontWeight: '600',
    marginBottom: 10
  },
  listContainer: {
    flex: 1,
    padding: 8,
    marginBottom: "10%",
    // backgroundColor: rsplTheme.rsplLightPink + 80
  },
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: rsplTheme.rsplLightGrey,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    // alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: "green"
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    // marginBottom: 8,
    // borderRadius: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: rsplTheme.textColorBold
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cartMainContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    // backgroundColor: rsplTheme.rsplWhite,
    backgroundColor: rsplTheme.OFFWhite

  },

  containerOfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // marginVertical: 10,
    // backgroundColor: rsplTheme.rsplLightGrey,
  },
  image: {
    width: "30%",
    height: 150,
    resizeMode: "contain",
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: rsplTheme.textColorBold,
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: rsplTheme.textColorLight,
    paddingVertical: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  pulsButton: {
    borderRightWidth: .5,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    width: 36,
  },
  minusButton: {
    borderLeftWidth: .5,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 36,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    // color: '#888',
    color: rsplTheme.textColorBold
  },
  quantity: {
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 10,
  },
  deleteImg: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  emptyCartContain: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    transform: [
      { translateY: -50 },
    ],
  },
  emptyCartIconContainer: {
    backgroundColor: rsplTheme.gradientColorRight + 30,
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  cartEmpty: {
    fontSize: 18,
    color: rsplTheme.gradientColorRight + 60,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 6,
  },
  cartStart: {
    color: rsplTheme.jetGrey,
    fontSize: 15,
  },
  emptyCartIcon: {
    width: "100%",
    height: 70,
    resizeMode: "contain",
    tintColor: rsplTheme.gradientColorRight + 60,
  },

  countText: {
    fontSize: 18,
    textAlign: "center",
    color: rsplTheme.rsplBlue
    // marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    width: 130,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    borderRadius: 5,
    backgroundColor: rsplTheme.rsplWhite,
  },




})