import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { rsplTheme } from '.'

const Loader = ({ text = "" }) => {
    return (
        // <View style={styles.loader}>
        //     <ActivityIndicator size="small" color={rsplTheme.textColorBold} />
        //     {text != "" &&
        //         <Text style={[styles.text, { color: rsplTheme.textColorLight }]}>{text}</Text>
        //     }
        // </View>
        <View style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={rsplTheme.textColorBold} />
                    {text != "" &&
                        <Text style={[styles.text, { color: rsplTheme.textColorLight }]}>{text}</Text>
                    }
                </View>
            </View>
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        backgroundColor: rsplTheme.rsplWhite,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // This is for Android, but it won't affect iOS
    },
    loadingText: {
        color: '#ffffff',
        marginTop: 10,
    },
    text: {
        padding: 4,
        textAlign: 'center',
        fontWeight: '400',
        // marginTop: 10,
        // paddingVertical: 8,
        // backgroundColor: 'blue'
    }
})