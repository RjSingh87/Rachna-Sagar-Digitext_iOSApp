import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, } from 'react-native'
import React, { useState } from 'react'
import { rsplTheme } from '../constant'
import {useNavigation} from '@react-navigation/native'

const CBSEBoard = ({data, status, boardId}) => {
  const navigation = useNavigation()

  const [imgLoading, setImgLoading] = useState(false)


  const titles = [
    {
      id: 1,
      boardName: "CBSE Board",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1309-m-science.jpg",
      des: "Together with CBSE Pariksha Pre-Board Papers Hindi A Class 10 for Board Examination 2022-23",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)",
    },
    {
      id: 2,
      boardName: "ICSE/ISC Board",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1311-m-Math-Basic.jpg",
      des: "Together With CBSE Class 10 Science Question Bank/Study Material Exam 2023-24 (Based on the latest Syllabus)",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
    {
      id: 3,
      boardName: "State Board (GCERT)",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1340-m-Math.jpg",
      des: "Together With CBSE Class 10 Mathematics (Basic) Question Bank/Study Material Exam 2023-24 (Based on the latest Syllabus)",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
    {
      id: 4,
      boardName: "CUET - UG (NTA)",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1342-m-Science.jpg",
      des: "Together With CBSE Class 9 Mathematics Question Bank/Study Material Exam 2024 (Based on the latest Syllabus)",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
    {
      id: 5,
      boardName: "Educational Kits",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1181Pariksha_Hindi_A_10_F.jpg",
      des: "Together With CBSE Class 9 Science Question Bank/Study Material Exam 2023 - 2024 (Based on the latest Syllabus)",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
    {
      id: 6,
      boardName: "NSDC",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/1184Pariksha_Biology_12_F.jpg",
      des: "Together With CBSE Sample Paper (EAD) Class 12 Mathematics for Board Examination 2024",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
    {
      id: 7,
      boardName: "NSDC",
      imgPath: "https://www.rachnasagar.in/assets/images/product/small/2440-m-Mathematics.jpg",
      des: "Together With CBSE Class 11 English Core, Economics, English Core Pull Out Worksheets Question Bank (Set Of 3 books) Exam 2023-24( Based On Latest Syllabus).",
      mrp: "₹599",
      salePrice: "₹539.1",
      discount: "(10 % off)"
    },
  ]

  const onloading =(value, label)=>{
    console.log(value, "kumar")
    setImgLoading(value)
  }






  return (
    <View>

      {status &&
						<View style={{ flex: 1, marginTop: 20, }}>
							{titles?.map((item, index) => {
								return (
									<TouchableOpacity onPress={(()=>{navigation.navigate("ProductDetail",{name:"Product Details", image:item})})} style={{ flex: 1, flexDirection: "row", marginVertical: 5, }} key={item.id}>
										<View style={{ width: "30%", backgroundColor: "white", padding: 5, }}>
                      {imgLoading &&
                        <View style={{ alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                          <ActivityIndicator color={rsplTheme.rsplRed} />
                          <Text>Loading...</Text>
                        </View>

                      }
											<Image onLoadStart={()=> onloading(true, 'onLoadStart')} onLoadEnd={()=> onloading(false, "onLoadStart")} style={{ height: 160, width: "100%", borderWidth: .5, borderColor: rsplTheme.jetGrey, resizeMode: "cover" }} src={item?.imgPath} />
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

					}



    </View>
  )
}

export default CBSEBoard

const styles = StyleSheet.create({
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
	}

})