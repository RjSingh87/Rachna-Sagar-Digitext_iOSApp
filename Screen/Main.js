import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeScreen from './HomeScreen'
import User from './User'
// import Dashboard from './Dashboard'

const Drawer = createDrawerNavigator()


const Main = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Home Screen' component={HomeScreen} options={({ route }) => ({ drawerLabel: "Home", headerShown: false, })} />
      {/* <Drawer.Screen name='Home User' component={User} options={({ route }) => ({ drawerLabel: "Profile", headerShown: false, })} /> */}
      {/* <Drawer.Screen name='Dashboard' component={Dashboard} options={{ headerShown: false }} /> */}
    </Drawer.Navigator>
  )
}

export default Main

const styles = StyleSheet.create({})