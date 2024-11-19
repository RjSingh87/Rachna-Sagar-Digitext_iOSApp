import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useContext, useState, useEffect, } from 'react'
import { MyContext } from '../Store'
import { rsplTheme } from '../constant'

const NoInternetConn = () => {
  const { isConnected } = useContext(MyContext)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowOfflineMessage(false);
    } else {
      const timer = setTimeout(() => {
        setShowOfflineMessage(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <>
      {!isConnected ?
        <View style={[styles.container, { backgroundColor: isConnected ? rsplTheme.rsplGreen : rsplTheme.jetGrey }]}>
          {showOfflineMessage && (
            <Text style={styles.offlineText}>No Internet Connection</Text>
          )}
        </View> : null
      }
    </>
  );
}

export default NoInternetConn

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    position: "absolute",
    zIndex: 1,
    left: 0,
    bottom: 50,
  },
  offlineText: {
    color: 'white',
    padding: 8
    // marginBottom: 10,
  },
})