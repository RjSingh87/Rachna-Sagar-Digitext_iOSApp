import { Button, StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import { apiRoutes, rsplTheme, token } from '../constant';
import NoInternetConn from './NoInternetConn';
import Services from '../services';
import { MyContext } from '../Store';
import Loader from '../constant/Loader';
import EvilIcons from 'react-native-vector-icons/EvilIcons';



const WishlistScreen = () => {
  const navigation = useNavigation()
  const { userData, addToCart, setSelectedTab } = useContext(MyContext)
  const [wishListProduct, setWishListProduct] = useState({ item: [], msg: "" })
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    getWishListProduct()
  }, [])


  const startShopping = () => {
    setSelectedTab(0)
    navigation.navigate("Main")
  }



  const getWishListProduct = async () => {
    setLoader(true)
    const payLoadWishListProduct = {
      "api_token": token,
      "userId": userData.data[0]?.id
    }
    await Services.post(apiRoutes.viewWishlistProduct, payLoadWishListProduct)
      .then((res) => {
        if (res.status == "success") {
          setWishListProduct((prev) => {
            return { ...prev, item: res.result }
          })
        } else {
          setWishListProduct((prev) => {
            return { msg: res.message }
          })
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader(false) })

  }

  if (loader) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }


  const WishlistProduct = ({ product, onRemove }) => {
    return (
      <View style={styles.containers}>
        <Image source={{ uri: product.full_front_image_path }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{product.product_title}</Text>
          {/* <Text style={styles.price}>{`ISBN ${product.isbn}`}</Text> */}
          <Text style={styles.price}>{`Class: ${product.class}`}</Text>
          <Text style={styles.price}>{`Subject: ${product.subject}`}</Text>
          <Text style={styles.price}>{`Product Type: ${product.product_type}`}</Text>
          <Text style={[styles.price, { fontSize: 14, fontWeight: "500", color: rsplTheme.jetGrey }]}>{`\u20B9 ${product.book_mrp}`}</Text>
        </View>


        <View style={styles.moveTocartDele}>
          <TouchableOpacity onPress={(() => {
            // onRemove(product.productId)
            removeFromWishlist(product.productId, product.product_type)
          })}>
            {/* <Image style={{ width: 20, height: 20, resizeMode: "center", alignSelf: "center", }} source={require("../assets/icons/delete.png")} /> */}
            <EvilIcons name="trash" size={30} color={rsplTheme.rsplRed} alignSelf="center" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moveToCartBtn} onPress={(() => { moveToCartFromWishlist(product.productId, product.product_type) })}>
            {/* <Image style={{ width: 20, height: 20, resizeMode: "center", alignSelf: "center", }} source={require("../assets/icons/shopping.png")} /> */}
            <EvilIcons name="cart" size={26} alignSelf="center" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const removeProduct = (productId) => {
    setWishListProduct(wishListProduct?.item.filter(product => product.id !== productId));
  };

  const removeFromWishlist = async (productId, productType, type) => {
    const payLoadOfWishlist = {
      "api_token": token,
      "userId": userData.data[0]?.id,
      "bookId": productId,
      "product_type": productType
    }
    await Services.post(apiRoutes.deleteToWishlist, payLoadOfWishlist)
      .then((res) => {
        if (res.status == "success") {
          Alert.alert(`${type == "MovetoCart" ? "Product move to cart successfully." : `${res.message}`}`)
          getWishListProduct()
        } else {
          Alert.alert("Info", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })
  }

  const removeAllWishlistProduct = async () => {
    const payLoad = {
      "api_token": token,
      "userId": userData.data[0]?.id
    }
    Services.post(apiRoutes.removeAllFromWishlist, payLoad)
      .then((res) => {
        if (res.status == "success") {
          Alert.alert("Info", res.message)
          getWishListProduct()
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })

  }

  const moveToCartFromWishlist = (bookId, bookType) => {
    addToCart(navigation, bookId, bookType)
    removeFromWishlist(bookId, bookType, "MovetoCart")
  }


  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Wishlist"}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      {!wishListProduct?.item?.length ?
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 150, height: 150, borderRadius: 150 / 2, backgroundColor: "#fff", justifyContent: "center", }}>
            <Image style={{ width: "100%", height: 100, resizeMode: "contain" }} source={require("../assets/icons/EmptyWishlist.png")} />
          </View>
          <Text style={{ fontWeight: "500", fontSize: 15, color: rsplTheme.jetGrey, margin: 5 }}>{`${wishListProduct?.msg}` == "undefined" ? "Your Wishlist is Empty" : `${wishListProduct?.msg}`}</Text>
          <Text style={{ color: rsplTheme.rsplBorderGrey, }}>Explore more and shortlist some items.</Text>
          <TouchableOpacity onPress={(() => { startShopping() })} style={{ padding: 10, }}>
            <Text style={{ fontWeight: "500", textTransform: "uppercase", textAlign: "center", fontSize: 16, color: rsplTheme.rsplRed }}>Start Shopping</Text>
          </TouchableOpacity>
        </View> :

        <View style={styles.wishListViewContainer}>
          <Text style={styles.myWishlist}>My Wishlist</Text>

          <Button title='Remove All' color={rsplTheme.rsplRed} onPress={removeAllWishlistProduct} />

          <FlatList
            data={wishListProduct.item}
            keyExtractor={item => `${Math.floor(Math.random() * 10000)}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <WishlistProduct product={item} onRemove={removeProduct} />
            )}
          />
          {/* <Button title='Product' onPress={getWishListProduct} /> */}
        </View>
      }
    </View>
  )
}

export default WishlistScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: rsplTheme.rsplWhite,
    backgroundColor: '#f5f5f5',
  },
  wishListViewContainer: {
    // flex: 1,
    // borderWidth: 1,
    paddingBottom: 210
  },
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },

  myWishlist: {
    fontSize: 22,
    fontWeight: "500",
    color: rsplTheme.jetGrey,
    padding: 10,
  },
  moveToCartBtn: {
    // backgroundColor: rsplTheme.rsplBorderGrey,
    // padding: 10,
    // borderRadius: 20,
  },
  moveToCartHeading: {
    fontWeight: "500",
    color: rsplTheme.jetGrey,
    textAlign: "center",
    // fontStyle: "italic"
    // fontSize: 15
  },
  moveTocartDele: {
    width: 70,
    borderLeftWidth: .5,
    borderLeftColor: rsplTheme.jetGrey,
    flexDirection: "column",
    justifyContent: "space-around",
    // paddingLeft: 8,
    // justifyContent: "space-evenly",
  },

  //
  containers: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 100,
    resizeMode: "contain",
    borderRadius: 8,
    alignSelf: "center"
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
    color: '#888',
  },
})