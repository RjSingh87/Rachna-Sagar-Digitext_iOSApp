import { Alert, Button, StyleSheet, Text, TextInput, View, Dimensions, PixelRatio, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Pdf from 'react-native-pdf'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import base64 from 'react-native-base64'
import DeviceInfo from 'react-native-device-info'
import Services from '../services'
import { MyContext } from '../Store'



const PdfViewerPasswordProtected = ({ route }) => {

  const { userData } = useContext(MyContext)


  const serverSitePdfUrl = route.params?.pdfUrl?.eBookUrl?.pdfUrl //route.params?.pdfUrl?.pdfUrl
  const serverSiteLink = route.params?.pdfUrl?.eBookUrl?.psw //route.params?.pdfUrl?.link
  const bookID = route.params?.pdfUrl?.productId
  const subscriptionType = route.params?.pdfUrl?.subscription_type
  const [error, setError] = useState("")
  const { width, height } = Dimensions.get("window")
  const navigation = useNavigation()

  const [deviceID, setDeviceID] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(null);




  useEffect(() => {
    const authorizeDevice = async () => {
      if (subscriptionType === "Paid") {
        const authorized = await checkDeviceAuthorization(bookID);
        setIsAuthorized(authorized);
      }
    };
    authorizeDevice();

  }, []);

  const getDeviceID = async () => {
    const uniqueId = DeviceInfo.getUniqueId();  // Har device ka ek alag ID hota hai
    return uniqueId;
  };


  const checkDeviceAuthorization = async (bookID) => {
    try {
      const deviceId = await getDeviceID();
      const payLoad = {
        "api_token": token,
        "userID": userData.data[0]?.id,
        "productId": bookID, //"3124", //bookID,
        "deviceID": deviceId, //"59961f43dd911d056" //deviceId
      }
      console.log({ payLoad })
      const response = await Services.post(apiRoutes.checkDeviceId, payLoad)
      if (response.status === "success") {
        Alert.alert("Device is authorized")
      } else if (response.status === "failed") {
        Alert.alert("Device:", response.message)
        navigation.goBack()
      }
    } catch (error) {
      if (error.message == "TypeError: Network request failed") {
        Alert.alert("Network Error", `Please try again.`)
      } else {
        Alert.alert("Error", `${error.message}`)
      }
    }
  };




  // console.log({ deviceID, deviceModel, osVersion })


  function stringReverse(str) {
    return str.split('').reverse().join('');
  }
  const reversedString = stringReverse(serverSiteLink);
  const password = base64.decode(reversedString)


  // const pdfWithPassword = "https://swaadhyayan.com/s1/drylab.pdf"
  // const pdfWithPassword1 = "https://swaadhyayan.com/s1/TogetherWithExpressionsEnglishMCB1.pdf"
  // const passwordOfPdf = "AbC@#123" Raju007
  // const pdfWithWithoutPassword = "https://swaadhyayan.com/data/learningContent/1/Computer/pdf/com1ch1.pdf"
  return (
    <View style={{ flex: 1, }}>

      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Read eBook PDF"}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />

      <View style={[styles.container, { width: width, height: height }]}>
        <Pdf
          // When come final pdfURL from server site then call variable {`${serverSitePdfUrl}`} in pdf source
          source={{ uri: serverSitePdfUrl }}
          password={password}
          onError={((error) => { if (error) { setError("Load pdf failed.") } })}
          renderActivityIndicator={(() => {
            return (
              <ActivityIndicator size={'large'} color={rsplTheme.jetGrey} />
            )
          })}
          showsVerticalScrollIndicator={false}
          style={styles.pdfContainer}
        />
        {error &&
          <View style={{ position: "absolute", left: 0, top: 80, bottom: 0, right: 0, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: rsplTheme.rsplRed }}>{error}</Text>
          </View>
        }
      </View>









    </View>
  )
}

export default PdfViewerPasswordProtected

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginTop: 25,
  },
  pdfContainer: {
    flex: 1,
  }

})