import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView
} from "react-native"
import {
    SafeAreaView
} from 'react-native-safe-area-context'

import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import ColorPicker from '../reusableComponents/ColorPicker'
import styles from './Styles/Style'
//TODO: To implement cart list
class ShoppingCart extends Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <ScrollView
                    contentContainerStyle={{
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 60
                    }}>
                    <View style={styles.parentContainer}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={innerStyles.mainTextBold}>Your bag</Text>
                            <Text style={innerStyles.lightText}>You have 3 items in your bag</Text>
                            <ColorPicker />
                        </View>
                    </View>
                </ScrollView>
                <Footer />
            </SafeAreaView>
        )
    }
}

innerStyles = StyleSheet.create({
    mainTextBold: {
        fontFamily: "Montserrat-Bold",
        fontSize: 30,
        fontStyle: "normal",
        lineHeight: 45,
        letterSpacing: 0,
        textAlign: "left",
        color: '#2d2d2f',
        marginTop: 10
    },
    lightText: {
        fontFamily: "Avenir-Book",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 1,
        color: '#8d8d8e',
    },
})
export default ShoppingCart;