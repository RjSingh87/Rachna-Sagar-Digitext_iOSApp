import { Alert, Button, StyleSheet, Text, DeviceEventEmitter, TextInput, View, Dimensions, TouchableOpacity, PixelRatio, useWindowDimensions, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import Pdf from 'react-native-pdf'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import base64 from 'react-native-base64'
import DeviceInfo from 'react-native-device-info'
import Services from '../services'
import { MyContext } from '../Store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScreenGuardModule from 'react-native-screenguard';
import NoInternetConn from './NoInternetConn'



const PdfViewerPasswordProtected = ({ route }) => {
  // console.log(route.params.pdfPsw, "route.params?Raju")

  const { userData } = useContext(MyContext)


  const finalPdfUrl = route.params?.pdfUrl //route.params?.pdfUrl?.pdfUrl
  const finalPdfPsw = route.params?.pdfPsw
  const pdfTitle = route.params?.pdfTitle
  const serverSitePdfUrl = route.params?.pdfUrl?.eBookUrl?.pdfUrl //route.params?.pdfUrl?.pdfUrl
  const serverSiteLink = route.params?.pdfUrl?.eBookUrl?.psw //route.params?.pdfUrl?.link
  const bookID = route.params?.bookID
  const subscriptionType = route.params?.pdfSubscriptionType
  const [error, setError] = useState("")
  const { width, height } = Dimensions.get("window")
  const navigation = useNavigation()

  const [deviceID, setDeviceID] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(null);

  const pdfRef = useRef(null);
  const paginationScrollRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);


  const handlePageChange = async (page) => {
    pdfRef.current.setPage(page);
    setCurrentPage(page);
    await AsyncStorage.setItem(`last_page_${bookID}`, String(page));
  };

  useEffect(() => {
    if (paginationScrollRef.current) {
      const BUTTON_WIDTH = 50; // total width including margin & padding
      const screenWidth = Dimensions.get("window").width;
      const scrollToX = (currentPage - 1.9) * BUTTON_WIDTH - screenWidth / 2 + BUTTON_WIDTH / 2;

      paginationScrollRef.current.scrollTo({
        x: scrollToX > 0 ? scrollToX : 0,
        animated: true,
      });
    }
  }, [currentPage]);


  // user last page visited
  useEffect(() => {
    const getLastPage = async () => {
      try {
        const savedPage = await AsyncStorage.getItem(`last_page_${bookID}`);
        if (savedPage) {
          const pageNumber = parseInt(savedPage, 10);
          if (!isNaN(pageNumber)) {
            setCurrentPage(pageNumber);
            setTimeout(() => {
              pdfRef.current?.setPage(pageNumber);
            }, 200); // Give PDF time to load
          }
        }
      } catch (err) {
        console.log("Failed to load last page:", err);
      }
    };

    getLastPage();
  }, []);


  //screenshot disabled
  useEffect(() => {
    // Register blur overlay when app goes background → foreground
    ScreenGuardModule.register({
      backgroundColor: rsplTheme.gradientColorRight,
      timeAfterResume: 2000,
    });

    // ✅ Add ScreenshotTaken listener to suppress warning
    const screenshotListener = DeviceEventEmitter.addListener('ScreenshotTaken', () => {
      console.log('📸 ScreenshotTaken event captured');
      // Optionally show blur overlay manually
    });

    return () => {
      ScreenGuardModule.unregister();
      screenshotListener.remove();
    };
  }, []);






  // useEffect(() => {
  //   const authorizeDevice = async () => {
  //     if (subscriptionType === "Paid") {
  //       const authorized = await checkDeviceAuthorization(bookID);
  //       setIsAuthorized(authorized);
  //     }
  //   };
  //   authorizeDevice();

  // }, []);

  // const getDeviceID = async () => {
  //   const uniqueId = DeviceInfo.getUniqueId();  // Har device ka ek alag ID hota hai
  //   return uniqueId;
  // };


  // const checkDeviceAuthorization = async (bookID) => {
  //   try {
  //     const deviceId = await getDeviceID();
  //     const payLoad = {
  //       "api_token": token,
  //       "userID": userData?.data[0]?.id,
  //       "productId": bookID, //"3124", //bookID,
  //       "deviceID": deviceId, //"59961f43dd911d056" //deviceId
  //     }
  //     // console.log({ payLoad })
  //     const response = await Services.post(apiRoutes.checkDeviceId, payLoad)
  //     if (response.status === "success") {
  //       return
  //       Alert.alert("Device is authorized")
  //     } else if (response.status === "failed") {
  //       Alert.alert("Device:", response.message)
  //       navigation.goBack()
  //     }
  //   } catch (error) {
  //     if (error.message == "TypeError: Network request failed") {
  //       Alert.alert("Network Error", `Please try again.`)
  //     } else {
  //       Alert.alert("Error", `${error.message}`)
  //     }
  //   }
  // };


  return (
    <View style={{ flex: 1 }}>

      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        title={pdfTitle}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />


      <NoInternetConn />

      <View style={styles.container}>
        {/* PDF Container */}
        <View style={styles.pdfWrapper}>
          <Pdf
            horizontal
            ref={pdfRef}
            source={{ uri: finalPdfUrl }}
            password={finalPdfPsw}
            onError={(error) => {
              if (error) setError("Load pdf failed.");
            }}
            renderActivityIndicator={() => (
              <ActivityIndicator size={'large'} color={rsplTheme.jetGrey} />
            )}
            showsVerticalScrollIndicator={false}
            enablePaging={true}
            style={styles.pdfContainer}
            onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
            onPageChanged={(page) => {
              setCurrentPage(page);
              AsyncStorage.setItem(`last_page_${bookID}`, String(page));
            }}

          />
          {error && (
            <View style={styles.errorBox}>
              <Text style={{ color: rsplTheme.rsplRed }}>{error}</Text>
            </View>
          )}
        </View>

        {/* Pagination Bar */}
        <View style={styles.paginationBar}>
          <ScrollView
            ref={paginationScrollRef}
            horizontal
            contentContainerStyle={styles.paginationContainer}
            showsHorizontalScrollIndicator={false}
          >
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageButton, isActive && styles.activePageButton]}
                  onPress={() => handlePageChange(page)}
                >
                  <Text style={[styles.pageText, isActive && styles.activePageText]}>{page}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default PdfViewerPasswordProtected

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  pdfWrapper: {
    flex: 1, // Takes remaining space except bottom pagination
  },

  pdfContainer: {
    flex: 1,
    width: '100%',
  },

  errorBox: {
    position: "absolute",
    left: 0,
    top: 80,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },

  paginationBar: {
    height: 55,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: "center"
  },

  paginationContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  pageButton: {
    marginHorizontal: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#cccccc',
    height: 35,
    alignItems: "center",
    justifyContent: "center"
  },

  activePageButton: {
    backgroundColor: rsplTheme.rsplRed,
  },

  pageText: {
    color: '#000',
    fontSize: 16,
  },

  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },

})