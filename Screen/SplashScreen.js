import { StyleSheet, Text, View, Image, } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { MyContext } from '../Store'
import { useNavigation } from '@react-navigation/native'

const SplashScreen = ({ }) => {
  const navigation = useNavigation()

  const { userData, logout } = useContext(MyContext)
  console.log(userData, "SplashScreen UserData..")

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('HomeScreen'); // Navigate to the home page after 3 seconds
    }, 5000); // 3000 milliseconds = 3 seconds
    return () => clearTimeout(timer); // Clear the timer if the component unmounts

  }, [navigation])


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/SplashScreen.png')} // Replace 'splash.png' with your splash screen image
        style={styles.image}
      />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})