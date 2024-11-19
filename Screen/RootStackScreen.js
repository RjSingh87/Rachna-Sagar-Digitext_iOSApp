import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { MyContext } from '../Store'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from './SplashScreen'
import Login from './Login'

const RootStack = createNativeStackNavigator()

const RootStackScreen = ({ navigation }) => {
  const { userData, logout } = useContext(MyContext)
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "green"
        },
        headerTitleStyle: {
          fontWeight: "500",
          color: "red",
        }
      }}

    >
      <RootStack.Screen name='SplashScreen' component={SplashScreen} />
      <RootStack.Screen name='Login' component={Login} />
    </RootStack.Navigator>
  )
}

export default RootStackScreen

const styles = StyleSheet.create({})