import { StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'
import { rsplTheme } from '../constant';
import LinearGradient from 'react-native-linear-gradient';

const ModalTopBottomClose = () => {
  const [remember, setRemember] = useState({ rememberPass: false, forgotPassModal: false })
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={remember.forgotPassModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setRemember((prev) => { return { ...prev, forgotPassModal: false } });
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity style={{ width: "100%", flex: 1, }} onPress={() => setRemember((prev) => { return { ...prev, forgotPassModal: false } })} />
          <View style={styles.modalView}>
            <View style={styles.emailPass}>
              <Text style={styles.EmaiPass}>Email</Text>
              <TextInput placeholder='Type your email id' style={styles.txtInput} />
            </View>

            <TouchableOpacity onPress={() => setRemember((prev) => { return { ...prev, forgotPassModal: false } })} style={[styles.poweredBy, { width: "50%", marginTop: 10, alignSelf: "center" }]}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
                <Text style={styles.buttonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ width: "100%", flex: 1, }} onPress={() => setRemember((prev) => { return { ...prev, forgotPassModal: false } })} />
        </View>
      </Modal>
    </View>
  )
}

export default ModalTopBottomClose

const styles = StyleSheet.create({
  EmaiPass: {
    fontSize: 16,
    paddingBottom: 6,
    color: rsplTheme.textColorLight
  },

  // txtInput: {
  //   backgroundColor: "#e1e1e1",
  //   height: 40,
  // },
  emailPass: {
    marginTop: 10,
  },


  poweredBy: {
    // backgroundColor: rsplTheme.rsplBgColor,
    // borderWidth:1,
    // position: "absolute",
    bottom: 0,
    // left:10,
    padding: 10,
    width: "100%",
    // flex: 1,
  },

  linearGradient: {
    // flex: 1,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    // margin: 10,
    color: rsplTheme.rsplWhite,
  },
  txtInput: {
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
    // top: 10,
    height: 45,
    borderRadius: 6,
    color: rsplTheme.jetGrey,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey

  },

  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: rsplTheme.jetGrey + 75
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
    // flex: 1,
    width: "92%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // alignItems: 'center',
  },

})