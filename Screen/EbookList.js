import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Button, FlatList, Dimensions, RefreshControl, Clipboard, } from 'react-native'
import React, { useEffect, useState, useCallback, memo, useContext } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant';
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';
import { MyContext } from '../Store';


const { width, height } = Dimensions.get("window")

const EbookList = () => {
  const navigation = useNavigation()
  const { userData } = useContext(MyContext)
  const [eBookDataList, setEbookDataList] = useState({ data: [], loaderStatus: false, message: "" })



  useEffect(() => {
    eBookListing()
  }, [])
  const onRefresh = useCallback(() => {
    setEbookDataList((prev) => { return { ...prev, loaderStatus: true } })
    setTimeout(() => {
      eBookListing()
      setEbookDataList((prev) => { return { ...prev, loaderStatus: false } })
    }, 1000);
  }, [eBookDataList.loaderStatus])

  const eBookListing = async () => {
    setEbookDataList((prev) => { return { ...prev, loaderStatus: true } }) // for loader true
    const payload = {
      "api_token": token,
      "userid": userData.data[0]?.id // when user logging successfully then get userID dynamically.
    }
    await Services.post(apiRoutes.eBookList, payload)
      .then((res) => {
        if (res.status === "success" && res.data.length != 0) {
          setEbookDataList((prev) => { return { ...prev, data: res.data, loaderStatus: true } })
        } else if (res.success == "error" || res.status == "error") {
          if (userData.isLogin) {
            setEbookDataList((prev) => { return { ...prev, message: res.message } })
          } else {
            setEbookDataList((prev) => { return { ...prev, message: "Please login." } })
          }
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setEbookDataList((prev) => { return { ...prev, loaderStatus: false } }) })

  }

  if (eBookDataList.loaderStatus) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }


  const eBookRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={(() => { pdfViewer(item) })} key={item.id} style={styles.productItem}>
        <Image style={styles.eBookImage} source={{ uri: item?.productData?.url }} />
        <Text style={styles.eBookTitleName} numberOfLines={2}>{item?.productData?.product_title}</Text>
      </TouchableOpacity>
    )
  }


  const pdfViewer = (pdfUrl) => {
    navigation.navigate("PdfViewerPasswordProtected", { pdfUrl: pdfUrl })
    return
    navigation.navigate("PdfViewer", { bookid: bookid })

  }




  return (
    <View sltye={styles.mainContainer}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Ebook"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />


      <View style={styles.listContainer}>
        {eBookDataList.data.length ?
          <FlatList
            data={eBookDataList?.data}
            renderItem={eBookRenderItem}
            // keyExtractor={(item, index) => { index.toString() }}
            numColumns={2} // Display 2 items in a row
            onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={eBookDataList.loaderStatus}
                onRefresh={onRefresh}
              />
            }
          /> :
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: rsplTheme.rsplRed }} >{eBookDataList.message}</Text>
          </View>


        }

      </View>
    </View>
  )
}

export default EbookList

const styles = StyleSheet.create({
  mainContainer: {
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
  listContainer: {
    // flex: 1,
    padding: 8,
    height: height - 132,
    // marginBottom: "25%",
    backgroundColor: rsplTheme.rsplWhite
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
  eBookImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  eBookTitleName: {
    fontSize: 14,
    fontWeight: "500",
    color: rsplTheme.textColorBold,
    textAlign: "center",
    marginVertical: 10,
  }
})