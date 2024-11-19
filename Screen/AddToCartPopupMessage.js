import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { rsplTheme } from '../constant';

const AddToCartPopupMessage = ({ isVisible, message }) => {
  if (!isVisible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.messageInsideBox}>
        <Text style={styles.messageTxt}>✓ {message}</Text>
      </View>
    </View>
  )
}

export default AddToCartPopupMessage

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: rsplTheme.rsplLightGrey + 70,
    justifyContent: "flex-end",
  },
  messageInsideBox: {
    margin: 20,
    marginBottom: 60,
    backgroundColor: rsplTheme.rsplGreen,
    padding: 15,
    borderRadius: 10,
  },
  messageTxt: {
    // fontSize: 18,
    fontWeight: "600",
    color: rsplTheme.rsplWhite
  }
})