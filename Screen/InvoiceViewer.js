import { StyleSheet, Text, View, ActivityIndicator, Dimensions, } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf'
import { useNavigation } from '@react-navigation/native'
import Header from '../comman/Header'
import { rsplTheme } from '../constant'

const InvoiceViewer = ({ route }) => {
  const invoiceUrl = `data:application/pdf;base64,${route.params?.data}`
  const { width, height } = Dimensions.get("window")
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1, }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Invoice"}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />

      <View style={[styles.container, { width: width, height: height }]}>
        <Pdf
          source={{ uri: invoiceUrl }}
          onError={((error) => { console.log(error, "err") })}
          renderActivityIndicator={(() => {
            return (
              <ActivityIndicator size={'large'} color={rsplTheme.jetGrey} />
            )
          })}
          showsVerticalScrollIndicator={false}
          style={styles.pdfContainer}
        />
      </View>








    </View>
  )
}

export default InvoiceViewer

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