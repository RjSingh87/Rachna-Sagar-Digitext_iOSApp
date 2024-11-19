import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CatchError = ({ message, fontSize, color, marginVertical }) => {
  // console.log(message, "whate??")
  return (
    <View>
      <Text style={{ color, fontSize, marginVertical }}>{message}</Text>
    </View>
  )
}

export default CatchError

const styles = StyleSheet.create({})