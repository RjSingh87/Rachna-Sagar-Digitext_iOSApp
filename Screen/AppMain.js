import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation, NavigationContainer, } from '@react-navigation/native'
import { MyContext } from '../Store'
import RootStackScreen from './RootStackScreen'
import HomeScreen from './HomeScreen'


const AppMain = () => {
  const { userData, logout } = useContext(MyContext)
  return (
    <NavigationContainer independent={true}>
      {!userData.isLogin ?
        <RootStackScreen /> :
        <HomeScreen />
      }
    </NavigationContainer>
  )
}

export default AppMain

const styles = StyleSheet.create({})