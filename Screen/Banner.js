import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Animated, Alert, ActivityIndicator, } from "react-native";
import Slide from "./Slider";
import { apiRoutes, rsplTheme, token } from "../constant";
import Services from "../services";
// import Loader from "../constant/Loader";

const { width, heigth } = Dimensions.get("window");



const Banner = () => {
	const flatlistRef = useRef()
	const scrollX = new Animated.Value(0);
	let position = Animated.divide(scrollX, width);
	const [activeIndex, setActiveIndex] = useState(0)
	const [data, setData] = useState([])
	const [loader, setLoader] = useState(false)


	useEffect(() => {
		let interval = setInterval(() => {
			if (activeIndex === data.length - 1) {
				flatlistRef.current?.scrollToIndex({
					index: 0,
					animated: true,
				});
			} else {
				flatlistRef.current?.scrollToIndex({
					index: activeIndex + 1,
					animated: true,
				});
			}

		}, 3000);

		return () => clearInterval(interval);

	}, [activeIndex])

	useEffect(() => {
		fetchBanner()
	}, [])



	const fetchBanner = async () => {
		setLoader(true)
		const payLoad = {
			"api_token": token
		}
		await Services.post(apiRoutes.getBanners, payLoad)
			.then((res) => {
				if (res.status == "success") {
					setData(res.data)
				} else {
					return
					Alert.alert("Info", res.message)
				}
			})
			.catch((err) => {
				if (err.message == "TypeError: Network request failed") {
					Alert.alert("Network Error", `Please try again.`)
				} else { Alert.alert("Error Raju", `${err.message}`) }
			})
			.finally(() => { setLoader(false) })
	}







	const handleItemLayout = (data, index) => ({
		length: width,
		offset: width * index,
		index: index
	})


	const handleScroll = (event) => {
		const scrollPosition = event.nativeEvent.contentOffset.x
		const index = scrollPosition / width
		setActiveIndex(Math.round(index))
	}

	if (loader) {
		return (
			<View style={{ position: "absolute", zIndex: 999, top: 80, left: 0, bottom: 0, right: 0, }}>
				{/* <Loader Text="Loading" /> */}
				<ActivityIndicator color={rsplTheme.rsplWhite} />
			</View>
		)
	}





	if (data && data.length) {
		return (
			<View>
				<FlatList
					keyExtractor={(item, index) => "key" + index}
					ref={flatlistRef}
					data={data}
					renderItem={({ item }) => {
						return <Slide item={item} />;
					}}
					horizontal={true}
					pagingEnabled={true}
					onScroll={handleScroll}
					getItemLayout={handleItemLayout}
					showsHorizontalScrollIndicator={false}
					scrollEnabled
					snapToAlignment="center"
					scrollEventThrottle={16}
					decelerationRate={"fast"}
				/>

				{/* Active Dot view  */}
				<View style={styles.dotView}>
					{data.map((_, index) => {
						let backgColor = rsplTheme.rsplWhite + 75
						if (activeIndex === index) {
							backgColor = rsplTheme.rsplWhite
						}
						return (
							<Animated.View
								key={index.toString()}
								style={{
									// opacity,
									height: 10,
									width: 10,
									backgroundColor: backgColor,
									margin: 8,
									borderRadius: 5,
								}}
							/>
						)
					})}
				</View>
			</View>
		);
	}

	return null;
};

const styles = StyleSheet.create({
	dotView: { flexDirection: "row", justifyContent: "center" },
});

export default Banner;