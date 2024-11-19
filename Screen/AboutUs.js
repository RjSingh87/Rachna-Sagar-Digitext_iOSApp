import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { rsplTheme } from '../constant'

const AboutUs = (name) => {
  const screenName = useRef(`${name.route.params?.name}`).current
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.privacyPolicyTxt}>{screenName} coming soon...</Text>
      </ScrollView>
    </View>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  privacyPolicyTxt: {
    color: rsplTheme.rsplBackgroundColor,
    fontSize: 18,
    textAlign: "left",
    fontWeight: "500"
  }

})