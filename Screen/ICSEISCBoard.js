import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'

const ICSEISCBoard = ({status}) => {
  return (
    <View>
      {status &&
        <Text>ICSEISCBoard</Text>
      }
    </View>
  )
}

export default ICSEISCBoard

const styles = StyleSheet.create({})