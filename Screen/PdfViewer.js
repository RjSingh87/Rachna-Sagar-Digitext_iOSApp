import { StyleSheet, Text, View, Platform, Alert, Button } from 'react-native'
import React, { useState } from 'react'
import { WebView } from 'react-native-webview';
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import NoInternetConn from './NoInternetConn';


const PdfViewer = ({ route }) => {
  const navigation = useNavigation()
  const filePath = route.params?.bookid
  const [error, setError] = useState({ status: false, errMsg: "" });
  const [loading, setLoading] = useState(true);


  let url = ""
  if (filePath == 1337) {
    url = "https://swaadhyayan.com/data/learningContent/1/Computer/pdf/com1ch1.pdf"
  } else {
    url = "https://swaadhyayan.com/s1/drylab.pdf"
  }

  const handleError = (err) => {
    const { nativeEvent } = err;
    const errMsg = nativeEvent?.description
    setError(() => { return { status: true, errMsg: errMsg } });

  }
  const handleLoad = () => {
    setLoading(false);
  }

  const reload = () => {
    setError(() => { return { status: false } });
    setLoading(true);
  };




  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"eBook"}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />

      <NoInternetConn />


      {loading && !error?.status && <Text>Loading...</Text>}
      {error?.status ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{`An error occurred: ${error.errMsg}`}</Text>
          <Button title="Retry" onPress={reload} />
        </View>
      ) : (
        <WebView
          source={{ uri: url }}
          onError={handleError}
          onLoad={handleLoad}
          style={styles.webview}
        />
      )}
    </View>

  )
}

export default PdfViewer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 400,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
})