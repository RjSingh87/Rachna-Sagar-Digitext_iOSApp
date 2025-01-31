import { Alert, Button, StyleSheet, Text, TextInput, View, Dimensions, PixelRatio, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Pdf from 'react-native-pdf'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { rsplTheme } from '../constant'
import base64 from 'react-native-base64'


const PdfViewerPasswordProtected = ({ route }) => {
  const serverSitePdfUrl = route.params?.pdfUrl?.eBookUrl?.pdfUrl //route.params?.pdfUrl?.pdfUrl
  const serverSiteLink = route.params?.pdfUrl?.eBookUrl?.psw //route.params?.pdfUrl?.link
  const bookID = route.params?.pdfUrl?.bookid
  const [error, setError] = useState("")
  const { width, height } = Dimensions.get("window")
  const navigation = useNavigation()


  function stringReverse(str) {
    return str.split('').reverse().join('');
  }
  const reversedString = stringReverse(serverSiteLink);
  const password = base64.decode(reversedString)

  // const pdfWithPassword = "https://swaadhyayan.com/s1/drylab.pdf"
  // const pdfWithPassword1 = "https://swaadhyayan.com/s1/TogetherWithExpressionsEnglishMCB1.pdf"
  // const passwordOfPdf = "AbC@#123"
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