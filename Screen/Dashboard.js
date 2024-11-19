import { Alert, Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { rsplTheme } from '../constant'

import CBSEBoard from './CBSEBoard'
import ICSEISCBoard from './ICSEISCBoard'
import StateBoard from './StateBoard'
import CUET from './CUET'
import EducationalKits from './EducationalKits'
import NSDC from './NSDC'



const boardType = [
	{
		id: 1,
		boardName: "CBSE Board",
		imgPath: "https://www.rachnasagar.in/assets/category/62e519634dd31cbse.png",

	},
	{
		id: 2,
		boardName: "ICSE/ISC Board",
		imgPath: "https://www.rachnasagar.in/assets/category/62e519747a6cbicse.png",
	},
	{
		id: 3,
		boardName: "State Board (GCERT)",
		imgPath: "https://www.rachnasagar.in/assets/category/62e51bd1687d5GCERT.png",
	},
	{
		id: 4,
		boardName: "CUET - UG (NTA)",
		imgPath: "https://www.rachnasagar.in/assets/category/62e5182a2a5b9NTA.png",
	},
	{
		id: 5,
		boardName: "Educational Kits",
		imgPath: "https://www.rachnasagar.in/assets/category/62e519ebca765Educational-Kits.png",
	},
	{
		id: 6,
		boardName: "NSDC",
		imgPath: "https://www.rachnasagar.in/assets/category/634d1c823b3dbnsdc.png",
	},
]

const allClass = [
	{
		id: 1,
		class: "1"
	},
	{
		id: 2,
		class: "2"
	},
	{
		id: 3,
		class: "3"
	},
	{
		id: 4,
		class: "4"
	},
	{
		id: 5,
		class: "5"
	},
	{
		id: 6,
		class: "6"
	},
	{
		id: 7,
		class: "7"
	},
	{
		id: 8,
		class: "8"
	},
	{
		id: 13,
		class: "Level-A"
	},
	{
		id: 14,
		class: "Level-B"
	},
	{
		id: 15,
		class: "Level-C"
	},
]





const Dashboard = ({ navigation }) => {

	const [boardTypeValue, setBoardTypeValue] = useState(1)
	const [userValue, setUserValue] = useState({ class: "", typeofBooks: "", subject: "", status: false })
	const [toggleView, setToggleView] = useState(true)
	const [classValue, setClassValue] = useState()
	// const [isEnabled, setIsEnabled] = useState(false);
	const [modalViewBox, setModalViewBox] = useState(false)
	const toggleSwitch = () => setToggleView(toggleView => !toggleView);




	const userValueSubmit = () => {
		if (userValue.class == "" || userValue.typeofBooks == "" || userValue.subject == "") {
			Alert.alert("Please fill all fields")
			return
		} else {
			if (boardTypeValue == 1) {
				setUserValue((prev) => { return { ...prev, status: true, } })
				setToggleView(false)
			} else if (boardTypeValue == 2) {
				setUserValue((prev) => { return { ...prev, status: !true, } })
				setToggleView(false)
			} else if (boardTypeValue == 3) {
				setUserValue((prev) => { return { ...prev, status: !true, } })
				setToggleView(false)
			} else if (boardTypeValue == 4) {
				setUserValue((prev) => { return { ...prev, status: !true, } })
			} else if (boardTypeValue == 5) {
				setUserValue((prev) => { return { ...prev, status: !true, } })
			} else if (boardTypeValue == 6) {
				setUserValue((prev) => { return { ...prev, status: !true, } })
			} else {
				setUserValue((prev) => { return { ...prev, status: false, } })
			}

		}
	}


	const modalView = () => {
		setModalViewBox(true)
	}

	const SelectClassValue = (classId) => {
		setClassValue(classId)
	}

	return (
		<View style={styles.mainContainer}>


			{/* <DrawerNavigation/> */}


			{/* <View style={styles.headerBox}>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/menu.png')} />
				</TouchableOpacity>
				<Text style={styles.rsplTitle} >Rachna Sagar DigiText App</Text>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/shopping-cart.png')} />
				</TouchableOpacity>
			</View> */}




			<View style={styles.schoolHeader}>

				<ScrollView horizontal >
					{boardType?.map((item, index) => {
						return (
							<View key={item.id}>
								<TouchableOpacity onPress={(() => { setBoardTypeValue(item.id), setToggleView(true) })} style={{ alignItems: "center", marginHorizontal: 6, }}>
									<View style={[styles.imgCircle, { backgroundColor: item.id == boardTypeValue ? rsplTheme.rsplBgColor : rsplTheme.rsplWhite }]}>
										<Image style={styles.schoolLogo} src={item.imgPath} />
									</View>
									<Text style={[styles.rsplText, {}]}>{item.boardName}</Text>
								</TouchableOpacity>
							</View>
						)
					})}



				</ScrollView>






				{/* <View style={styles.imgCircle}>
					<Image style={styles.schoolLogo} source={require("../assets/RSPL.png")} />
				</View>
				<Text style={styles.rsplText}>Rachna Sagar School</Text> */}
			</View>

			<View style={styles.containBox}>
				<ScrollView>
					<Switch
						trackColor={{ false: '#767577', true: rsplTheme.rsplGreen }}
						thumbColor={toggleView ? rsplTheme.rsplWhite : '#f4f3f4'}
						ios_backgroundColor={rsplTheme.rsplBorderGrey}
						onValueChange={toggleSwitch}
						value={toggleView}
						style={{ alignSelf: "flex-end", flex: 1 }}

					/>
					{toggleView &&
						<>
							<View style={styles.txtInputView}>
								<Text style={styles.inputType}>Class</Text>
								<TextInput onChangeText={text => { setUserValue((prev) => { return { ...prev, class: text } }) }} placeholder='Please enter class' style={styles.txtInput} />
								<Text>{classValue == null ? "Select class" : classValue} </Text>
								<TouchableOpacity onPress={(() => { modalView() })}>
									<Image style={styles.downArrow} source={require("../assets/icons/down-arrow.png")} />
								</TouchableOpacity>
							</View>
							<View style={styles.txtInputView}>
								<Text style={styles.inputType}>Type of books</Text>
								<TextInput onChangeText={text => { setUserValue((prev) => { return { ...prev, typeofBooks: text } }) }} placeholder='Please enter type of books' style={styles.txtInput} />
							</View>
							<View style={styles.txtInputView}>
								<Text style={styles.inputType}>Subject</Text>
								<TextInput onChangeText={text => { setUserValue((prev) => { return { ...prev, subject: text } }) }} placeholder='Please enter subject' style={styles.txtInput} />
							</View>
							<TouchableOpacity onPress={(() => { userValueSubmit() })} style={styles.submitBtnView}>
								<Text style={styles.submitTxt}>Submit</Text>
							</TouchableOpacity>
						</>
					}



					{boardTypeValue == 1 && <CBSEBoard status={userValue.status} />}
					{boardTypeValue == 2 && <ICSEISCBoard status={userValue.status} />}
					{boardTypeValue == 3 && <StateBoard status={userValue.status} />}
					{boardTypeValue == 4 && <CUET status={userValue.status} />}
					{boardTypeValue == 5 && <EducationalKits status={userValue.status} />}
					{boardTypeValue == 6 && <NSDC status={userValue.status} />}



					{/* {userValue.status &&
						<View style={{ flex: 1, marginTop: 20, }}>
							{titles?.map((item, index) => {
								return (
									<TouchableOpacity onPress={(()=>{navigation.navigate("ProductDetail",{name:"Product Details", image:item})})} style={{ flex: 1, flexDirection: "row", marginVertical: 5, }} key={item.id}>
										<View style={{ width: "30%", backgroundColor: "white", padding: 5, }}>
											<Image style={{ height: 160, width: "100%", borderWidth: .5, borderColor: rsplTheme.jetGrey, resizeMode: "cover" }} src={item?.imgPath} />
										</View>
										<View style={{ flex: 1, width: "70%", backgroundColor: "white", padding: 5, paddingLeft: 12, }}>
											<Text style={styles.description}>{item.des}</Text>
											<Text style={styles.salePrice}>{item.salePrice}</Text>
											<Text style={styles.mrp}>{item.mrp}</Text>
											<Text style={styles.discount}>{item.discount}</Text>
										</View>
									</TouchableOpacity>
								)
							})}
						</View>

					} */}




				</ScrollView>
			</View>


			{/* footer view */}
			{/* <View style={[styles.headerBox, {backgroundColor:rsplTheme.rsplWhite,}]}>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/home.png')} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/loupe.png')} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/love.png')} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/shopping-cart.png')} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn}>
					<Image style={styles.iconSize} source={require('../assets/icons/user.png')} />
				</TouchableOpacity>
			</View> */}


			{modalViewBox &&
				<Modal
					animationType='slide'
					transparent={true}
					visible={modalViewBox}
					style={styles.modal}
				>
					<View style={{ backgroundColor: rsplTheme.jetGrey + 75, flex: 1, justifyContent: "flex-end", alignItems: "center", }}>
						<View style={{ width: "100%", height: "50%", backgroundColor: "white", justifyContent: "flex-end" }}>
							<View style={{ width: 60, height: 10, borderRadius: 20, backgroundColor: rsplTheme.rsplBorderGrey, alignSelf: "center" }}></View>
							{allClass.map((item, index) => {
								const backgroundColor = item.class == classValue ? rsplTheme.rsplBgColor : "transparent";
								const width = item.class == classValue ? 8 : 16
								const height = item.class == classValue ? 8 : 16
								const borderRadius = item.class == classValue ? 4 : 8

								return (
									<View style={{ padding: 10, backgroundColor: "white", }} key={item.id}>
										<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", }} onPress={(() => { SelectClassValue(item.class), setModalViewBox(false) })}>
											<View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: rsplTheme.jetGrey, alignItems: "center", justifyContent: "center" }}><View style={{ width, height, borderRadius, backgroundColor }}></View></View>
											<Text style={{ color: rsplTheme.jetGrey, fontSize: 16, marginLeft: 8, }}> {item.class}</Text>
										</TouchableOpacity>
									</View>
								)
							})}
							<TouchableOpacity onPress={(() => { setModalViewBox(false) })}>
								<Text>close</Text>
							</TouchableOpacity>
						</View>
					</View>


				</Modal>

			}




		</View>
	)
}

export default Dashboard

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: rsplTheme.rsplLightGrey,
		flex: 1,
	},
	schoolHeader: {
		// height: "30%",
		backgroundColor: rsplTheme.rsplWhite,
		justifyContent: "space-around",
		padding: 8,
		alignItems: "center",
		shadowColor: '#171717',
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	rsplText: {
		color: rsplTheme.rsplTextColor,
		fontSize: 15,
		fontWeight: "600",
		marginTop: 5,
		width: 100,
		textAlign: "center",
		// backgroundColor:"grey"
	},
	dashText: {
		color: rsplTheme.rsplWhite,
		fontSize: 20,
	},
	imgCircle: {
		width: 80,
		height: 80,
		borderRadius: 80 / 2,
		borderWidth: 1,
		borderColor: "#eb6864",
		alignItems: "center",
		justifyContent: "center"
	},
	schoolLogo: {
		// flex:1,
		// width: "100%",
		// height: 200,
		width: 65,
		height: 65,
		resizeMode: "contain",
	},
	containBox: {
		flex: 1,
		padding: 10,
		top: 10
	},
	txtInput: {
		backgroundColor: rsplTheme.rsplWhite,
		padding: 10,
		marginTop: 6,
		marginBottom: 6,
		color: rsplTheme.jetGrey,
		borderRadius: 10,
		height: 45,
		borderWidth: .7,
		borderColor: rsplTheme.jetGrey
	},
	txtInputView: {
		marginTop: 6,
	},
	inputType: {
		fontSize: 16,
		color: rsplTheme.jetGrey
	},
	submitBtnView: {
		backgroundColor: rsplTheme.rsplWhite,
		width: "50%",
		alignSelf: "center",
		padding: 10,
		borderRadius: 20,
		marginTop: 10,
		shadowColor: '#171717',
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	submitTxt: {
		color: rsplTheme.rsplBackgroundColor,
		textAlign: "center",
		fontWeight: "500",
		fontSize: 18
	},
	description: {
		color: rsplTheme.rsplBackgroundColor,
		fontWeight: "600",
		fontSize: 15,
		marginBottom: 10,

	},
	salePrice: {
		fontSize: 20,
		fontWeight: "600",
		color: rsplTheme.rsplBlack
	},
	mrp: {
		color: rsplTheme.jetGrey,
		fontSize: 18,
		fontWeight: "500",
		textDecorationLine: 'line-through'
	},
	discount: {
		color: rsplTheme.rsplGreen,
		fontSize: 18,
		fontWeight: "500",
	},
	headerBox: {
		// flex: 1,
		// height:65,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: rsplTheme.rsplLightGrey
	},
	btn: {
		width: 60,
		height: 60,
		// backgroundColor:rsplTheme.rsplWhite,
		alignItems: "center",
		justifyContent: "center",

	},
	iconSize: {
		width: 22,
		height: 22,
		resizeMode: "cover",
	},
	rsplTitle: {
		color: rsplTheme.jetGrey,
		fontSize: 18,
		fontWeight: "500",
	},
	modal: {
		backgroundColor: "green",
		flex: 1,
	},
	downArrow: {
		width: 20,
		height: 20,
		resizeMode: "contain",
		position: "absolute",
		right: 10,
		top: -40,
	}


})