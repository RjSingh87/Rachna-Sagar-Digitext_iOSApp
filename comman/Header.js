import { Dimensions, StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { rsplTheme } from '../constant'
import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get("window")


const Header = ({ title, leftIcon, rightIcon, onClickLeftIcon, onClickRightIcon }) => {
  return (
    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.header}>

      <TouchableOpacity style={styles.btn} onPress={() => { onClickLeftIcon(); }}>
        <Image source={leftIcon} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.title}> {title} </Text>

      <TouchableOpacity onPress={() => { onClickRightIcon() }} style={styles.btn}>
        <Image source={rightIcon} style={styles.icon} />
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 50,
    backgroundColor: rsplTheme.rsplBackgroundColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  btn: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: rsplTheme.rsplWhite
  },
  title: {
    color: rsplTheme.rsplWhite,
    fontSize: 20,
  },
})