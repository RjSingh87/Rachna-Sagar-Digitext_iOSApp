import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native'
import React, { useContext, useState } from 'react'
import Header from '../comman/Header'
import { rsplTheme } from '../constant'
import User from './User'
import Cart from './Cart'
import Filter from './Filter'
import ReadEBook from './ReadEBook'
import WelcomStore from './WelcomStore'
import WishlistScreen from './WishlistScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MyContext } from '../Store'

const BottomTab = createBottomTabNavigator()


const HomeScreen = ({ navigation, route }) => {

    const { userData, selectedTab, setSelectedTab, cartList, wishListProduct } = useContext(MyContext)
    // const [selectedTab, setSelectedTab] = useState(0)
    return (
        <View style={styles.container}>
            {/* ------------Header---------------- */}
            {/* <Header
                leftIcon={require("../assets/icons/menu.png")}
                rightIcon={require('../assets/icons/shopping-cart.png')}
                title={"Rachna Sagar DitiText"}
                onClickLeftIcon={()=>{navigation.openDrawer();}}
            /> */}


            {/* -----------Footer---------- */}

            {/* <BottomTab.Navigator>
                <BottomTab.Screen
                    name='WelcomStore'
                    component={WelcomStore}
                    options={{
                        headerShown: false,
                        // tabBarLabel: "hello",
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return (<Image style={styles.bottomTabIcon} source={focused ? require("../assets/icons/store_fill.png") : require("../assets/icons/store.png")} />)
                        }
                    }}
                />
                <BottomTab.Screen
                    name='Filter'
                    component={Filter} options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return (<Image style={styles.bottomTabIcon} source={focused ? require("../assets/icons/filters_fill.png") : require("../assets/icons/filters.png")} />)
                        }
                    }}
                />
                <BottomTab.Screen
                    name='ReadEBook'
                    component={ReadEBook} options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return (<Image style={styles.bottomTabIcon} source={focused ? require("../assets/icons/book_fill.png") : require("../assets/icons/book.png")} />)
                        }
                    }}
                />
                <BottomTab.Screen
                    name='Cart'
                    component={Cart} options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return (<Image style={styles.bottomTabIcon} source={focused ? require("../assets/icons/shopping_fill.png") : require("../assets/icons/shopping.png")} />)
                        }
                    }}
                />
                <BottomTab.Screen
                    name='User'
                    component={User} options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return (<Image style={styles.bottomTabIcon} source={focused ? require("../assets/icons/person_fill.png") : require("../assets/icons/person.png")} />)
                        }
                    }}
                />

            </BottomTab.Navigator> */}

            {selectedTab == 0 ? (<WelcomStore />) : selectedTab == 1 ? (<Filter />) : selectedTab == 2 ? (<ReadEBook />) : selectedTab == 3 ? (<Cart />) : selectedTab == 4 ? (<User />) : selectedTab == 5 ? (<WishlistScreen />) : null}
            <View style={styles.bottomView}>
                <TouchableOpacity onPress={(() => { setSelectedTab(0) })} style={styles.bottomTab}>
                    <Image style={styles.bottomTabIcon} source={selectedTab == 0 ? require("../assets/icons/store_fill.png") : require('../assets/icons/store.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 0 ? "500" : null, color: selectedTab == 0 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>Product</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(() => { setSelectedTab(1) })} style={styles.bottomTab}>
                    <Image style={styles.bottomTabIcon} source={selectedTab == 1 ? require("../assets/icons/filters_fill.png") : require('../assets/icons/filters.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 1 ? "500" : null, color: selectedTab == 1 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(() => { setSelectedTab(2) })} style={styles.bottomTab}>
                    <Image style={styles.bottomTabIcon} source={selectedTab == 2 ? require("../assets/icons/book_fill.png") : require('../assets/icons/book.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 2 ? "500" : null, color: selectedTab == 2 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>E-Book</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(() => { setSelectedTab(5) })} style={styles.bottomTab}>
                    <Image style={[styles.bottomTabIcon, { tintColor: rsplTheme.gradientColorLeft }]} source={selectedTab == 5 ? require("../assets/icons/love_fill.png") : require('../assets/icons/love.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 5 ? "500" : null, color: selectedTab == 5 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>WishList</Text>
                    {userData.isLogin && wishListProduct?.item?.length > 0 &&
                        < View style={[styles.cartNotiFi, { borderWidth: .5, borderColor: rsplTheme.rsplWhite, }]}>
                            <Text style={styles.cartLengthValue}>{wishListProduct?.item?.length}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={(() => { setSelectedTab(3) })} style={styles.bottomTab}>
                    <Image style={styles.bottomTabIcon} source={selectedTab == 3 ? require("../assets/icons/shopping_fill.png") : require('../assets/icons/shopping.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 3 ? "500" : null, color: selectedTab == 3 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>Cart</Text>
                    {userData.isLogin && cartList.length > 0 &&
                        < View style={styles.cartNotiFi}>
                            <Text style={styles.cartLengthValue}>{cartList.length}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={(() => { setSelectedTab(4) })} style={styles.bottomTab}>
                    <Image style={[styles.bottomTabIcon, { width: 20, height: 20 }]} source={selectedTab == 4 ? require("../assets/icons/person_fill.png") : require('../assets/icons/person.png')} />
                    <Text style={{ marginVertical: 3, textAlign: "center", fontSize: 8, fontWeight: selectedTab == 4 ? "500" : null, color: selectedTab == 4 ? rsplTheme.rsplRed : rsplTheme.jetGrey }}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: rsplTheme.rsplWhite,
        borderTopWidth: 1.5,
        borderTopColor: rsplTheme.rsplBorderGrey
    },
    bottomTab: {
        width: "20%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    bottomTabIcon: {
        width: 25,
        height: 25,
    },
    cartNotiFi: {
        position: "absolute",
        top: 4,
        right: "26%",
        width: 16,
        height: 16,
        borderRadius: 16 / 2,
        backgroundColor: rsplTheme.gradientColorRight,
        alignItems: "center",
        justifyContent: "center",
    },
    cartLengthValue: {
        fontSize: 10,
        color: rsplTheme.rsplWhite
    }
})