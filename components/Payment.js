import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { Icon } from 'react-native-elements'
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import LogoSmall from "./Styles/LogoSmall"
class Payment extends Component {
    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header />
                <View style={styles.subContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 30, lineHeight: 36, color: "#2d2d2f" }}>Payment</Text>
                            <Text style={{ fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#8d8d8e" }}>Secure Checkout</Text>
                        </View>

                        <Image style={{
                            alignSelf: "flex-end",
                            width: width * 0.2,
                            height: height * 0.15,
                            marginTop: -30
                        }} resizeMode="contain" source={require("../static/logo-signIn.png")} />
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22, color: "#2967ff" }}>Credit Card</Text>
                        <Text  style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22, color: "#2d2d2f" }}>Paypal</Text>
                    </View>
                </View>

                <Footer />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
})

export default Payment;