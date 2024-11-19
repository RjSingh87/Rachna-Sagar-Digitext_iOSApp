import { SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, Image, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { rsplTheme, apiRoutes, tokenMobileOTP, token, } from '../constant'
import Services from '../services'
import AppStatusBar from './AppStatusBar'
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../constant/Loader'
import NoInternetConn from './NoInternetConn'


const Login = ({ navigation }) => {

	const [inputValue, setInputValue] = useState({ activationCode: "", name: "", email: "", mobileNo: "" })
	const [loader, setLoader] = useState(false)

	const OnChangeTxt = (inputTxt, type) => {
		// console.log(inputValue.activationCode, "raju")
		if (type == "ActivationCode") {
			setInputValue((prev) => { return { ...prev, activationCode: inputTxt } })
		} else if (type == "Name") {
			setInputValue((prev) => { return { ...prev, name: inputTxt } })
		} else {
			Alert.alert("Info", "Please enter all fields")
			return
		}
	}


	const SubmitInput = () => {
		if (inputValue.activationCode == "" || inputValue.name == "") {
			Alert.alert("Info", "Please enter all fields")
			return
		} else {
			navigation.navigate("Dashboard")
		}

	}

	const TermAndCondition = (type) => {
		if (type == "Privacy Policy") {
			navigation.navigate("PrivacyPolicy", { name: type })
		} else if (type == "About Us") {
			navigation.navigate("AboutUs", { name: type })
		}


	}

	const onChangeText = (text, type) => {
		if (type == "contactNo") {
			setInputValue((prev) => { return { ...prev, mobileNo: text.replace(/[^0-9]/g, '') } });
		} else {
			Alert.alert("Info", "Input not found!")
			return
		}
	};






	const GetOTP = async () => {
		if (inputValue.mobileNo == "" || inputValue.mobileNo == undefined || inputValue.mobileNo == null) {
			Alert.alert("Please enter a mobile number")
			setInputValue((prev) => { return { ...prev, mobileNo: "" } })
			return
		}

		setLoader(true)
		const payLoadOTP = {
			"api_token": token,
			"contactNo": inputValue.mobileNo
		}
		await Services.post(apiRoutes.mobileOTP, payLoadOTP)
			.then((res) => {
				if (res.status == "success") {
					// Alert.alert("Info", res.otp)
					navigation.navigate("OtpVerify", { mobileNo: inputValue.mobileNo, message: res.message, otp: res.otp, name: "Sign In" })

				} else if (res.status == "error") {
					Alert.alert(`${res.message}`)
				}

			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error", `${err.message}`) }
			})
			.finally(() => { setLoader(false) })
	}

	// if (loader) {
	// 	return (
	// 		<View style={{ flex: 1, width: "100%", backgroundColor: rsplTheme.rsplWhite, borderRadius: 12 }}>
	// 			<Loader text='Loading...' />
	// 		</View>
	// 	)
	// }









	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, }}>

			<NoInternetConn />

			<View style={styles.mainContainer}>
				<View style={styles.skip}>
					<TouchableOpacity onPress={(() => { navigation.navigate("Main") })}>
						<Text style={styles.skipText}>Skip</Text>
					</TouchableOpacity>
					<View style={styles.iconView}>
						<Image style={styles.mobileIcon} source={require("../assets/icons/mobileIcon.png")} />
					</View>
				</View>
				<ScrollView style={{ flex: 1, marginBottom: "10%" }}>
					<Text style={styles.signIn}>Sign in {"\n"}to Rachna Sagar</Text>
					<Text style={styles.accessAddres}>to access your Addresses, Orders & Wishlist.</Text>

					<View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, }}>
						<Text style={{ margin: 0, color: rsplTheme.textColorLight, fontSize: 18, }}>+91</Text>
						<TextInput
							style={styles.input}
							value={inputValue.mobileNo}
							placeholder='Enter your mobile number'
							onChangeText={(text) => onChangeText(text, "contactNo")}
							keyboardType='numeric'
							maxLength={10}
							autoFocus={true}
							// returnKeyLabel='Done'
							returnKeyType={'done'}
						/>
					</View>





					<TouchableOpacity onPress={(() => { GetOTP() })} style={styles.poweredBy}>
						<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
							{loader ?
								<ActivityIndicator color={rsplTheme.rsplWhite} /> :
								<Text style={styles.buttonText}>Get OTP</Text>
							}
						</LinearGradient>
					</TouchableOpacity>

				</ScrollView>










				{/* <>
				<View style={{ position:"absolute", left:0,}}>
					<Image style={{width:90, height:125, opacity:0.3, resizeMode:"contain"}} source={require('../assets/icons/rightArrow.png')} />
				</View>
				<View style={{ position:"absolute", right:0, bottom:0,}}>
					<Image style={{width:90, height:125, opacity:0.3, resizeMode:"contain"}} source={require('../assets/icons/leftArrow.png')} />
				</View>

				<View style={styles.logoBox}>
					<Image style={styles.logoImg} source={require("../assets/RSPL.png")} />
				</View>
				<View>
					<Text style={styles.login}>Login</Text>
					<Text style={styles.welcome}>Welcome to <Text style={{color:rsplTheme.rsplBgColor, fontWeight:"500"}}>Rachna Sagar DigiText App</Text></Text>
				</View>

				<View style={styles.loginView}>
					<ScrollView>
						<View style={styles.typeBox}>
							<View style={styles.username}>
							<Image style={styles.usernameIcon} source={require('../assets/icons/username.png')} />
							<Text style={styles.loginType}>Username*</Text>
							</View>
							<TextInput onChangeText={inputTxt => OnChangeTxt(inputTxt, "ActivationCode")} style={styles.txtInput} placeholder='Enter username' />
						</View>

						<View style={styles.typeBox}>
						<View style={styles.username}>
							<Image style={styles.usernameIcon} source={require('../assets/icons/padlock.png')} />
							<Text style={styles.loginType}>Password*</Text>
							</View>
							
							<TextInput onChangeText={inputTxt => OnChangeTxt(inputTxt, "Name")} style={styles.txtInput} placeholder='Enter password' />
						</View>

						<View style={{alignItems:"center", marginVertical:5,}}>
							<Text style={{color:rsplTheme.rsplBorderGrey}}>*Login with registered email ID and password </Text>
						</View>


						<TouchableOpacity onPress={(()=>{SubmitInput()})} style={styles.submitBox}>
							<Text style={styles.submitTxt}>Submit</Text>
						</TouchableOpacity>

						
						<View style={{alignItems:"center", marginVertical:20,}}>
							<Text style={{color:rsplTheme.jetGrey}}>Don't have an account?
								<TouchableOpacity onPress={(()=>{navigation.navigate("SignUp",{name:"Create Account"})})} style={{marginTop:-3,}}>
									<Text style={styles.signUp}>  Sign Up</Text>
								</TouchableOpacity>
							</Text>
						</View>


						<View style={styles.privacyBtn}>
							<TouchableOpacity onPress={(()=>{TermAndCondition("Privacy Policy")})} style={styles.privacyType}>
								<Text style={styles.privacyTxt}>Privacy Policy</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={(()=>{TermAndCondition("About Us")})} style={styles.privacyType}>
								<Text style={styles.privacyTxt}>About Us</Text>
							</TouchableOpacity>
						</View>
						
					</ScrollView>
				</View>

				<View style={styles.poweredBy}>
					<Text style={styles.poweredByTxt}>Powered by Rachna Sagar</Text>
				</View>
				</> */}
			</View>
		</KeyboardAvoidingView>

	)
}

export default Login

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: rsplTheme.rsplWhite,
		flex: 1,
		// alignItems: "center",
		// justifyContent: "center"
		padding: 10,
	},
	mobileIcon: {
		width: "100%",
		height: 160,
		// maxHeight:"30%",
		resizeMode: "contain",
	},
	iconView: {
		// backgroundColor:"grey",
		width: "100%",
		// flex:1,
		// minHeight:"50%",
		// alignItems:"center",
		// justifyContent:"center"
	},
	skip: {
		marginVertical: 10,
		// backgroundColor:"red"
		// borderWidth:1,
	},
	skipText: {
		fontSize: 20,
		fontWeight: "400",
		color: rsplTheme.rsplBackgroundColor,
		textAlign: "right",
	},

	signIn: {
		fontSize: 30,
		fontWeight: "600",
		color: rsplTheme.textColorBold,
		lineHeight: 38,
	},
	accessAddres: {
		fontSize: 16,
		color: rsplTheme.textColorLight,
		marginVertical: 10,
	},

	input: {
		height: 40,
		margin: 12,
		borderBottomWidth: 1,
		borderBottomColor: rsplTheme.textColorBold,
		padding: 10,
		// backgroundColor:"#e1e1e1",
		// width:"87%"
		flex: 1,
		fontSize: 20,
		fontWeight: "500",
		color: rsplTheme.textColorBold
	},



	loginView: {
		backgroundColor: rsplTheme.rsplLightGrey,
		// borderWidth:1,
		// borderColor:"white",
		padding: 20,
		// flex:1,
		margin: 20,
		borderRadius: 20,
		// height: "80%",
		// width: "90%",
		// shadowColor: '#171717',
		// shadowOffset: { width: -2, height: 4 },
		// shadowOpacity: 0.3,
		// shadowRadius: 3,
	},
	logoBox: {
		width: 100,
		height: 100,
		borderRadius: 100 / 2,
		backgroundColor: rsplTheme.rsplWhite,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		marginTop: 20,
		borderWidth: 3.5,
		borderColor: rsplTheme.jetGrey + 65,

	},
	logoImg: {
		width: 70,
		height: 70,
		resizeMode: "contain"
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
	poweredByTxt: {
		color: rsplTheme.jetGrey + 75,
		textAlign: "center",
		fontWeight: "500",
		fontSize: 16,
	},

	linearGradient: {
		flex: 1,
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
		top: 10,
		height: 45,
		borderRadius: 12,
		color: rsplTheme.jetGrey,
		borderWidth: .5,
		borderColor: rsplTheme.jetGrey

	},
	loginType: {
		color: rsplTheme.jetGrey,
		fontWeight: "500",
		fontSize: 16,
	},
	typeBox: {
		marginTop: 10,
		marginBottom: 20,
	},
	submitBox: {
		backgroundColor: rsplTheme.rsplBgColor,
		padding: 12,
		width: "100%",
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 15,
		alignSelf: "center",
		shadowColor: '#171717',
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
	},
	submitTxt: {
		color: rsplTheme.rsplWhite,
		fontWeight: "500",
		fontSize: 18,
	},
	privacyBtn: {
		marginTop: 10,
		padding: 10,
		flexDirection: "row",
		flex: 1,
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	privacyType: {
		// width:"33.3333%",
		// backgroundColor:"red",
		alignItems: "center",
		justifyContent: "center",
	},
	privacyTxt: {
		color: rsplTheme.jetGrey,
		fontSize: 16,
		fontWeight: "500",
	},
	login: {
		fontSize: 20,
		textAlign: "center",
		fontWeight: "500",
		paddingVertical: 10,
		color: rsplTheme.jetGrey,
	},
	welcome: {
		// fontSize:20,
		textAlign: "center",
		color: rsplTheme.jetGrey,
	},
	signUp: {
		fontSize: 16,
		color: rsplTheme.rsplBgColor,
		fontWeight: "500"
	},
	usernameIcon: {
		width: 22,
		height: 22,
		resizeMode: "contain",
		marginRight: 12,
	},
	username: {
		flexDirection: "row",
		alignItems: "center",

	}
})