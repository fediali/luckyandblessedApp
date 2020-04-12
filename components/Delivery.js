import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image,
    ImageBackground
} from 'react-native'

import LogoMedium from './Styles/LogoMedium'
import styles from './Styles/Style'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import { TextInput } from 'react-native-gesture-handler';

class Delivery extends Component {

    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header  navigation={this.props.navigation}/>
                <ScrollView contentContainerStyle={
                    {
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 60
                    }
                }>

                    <View styles={styles.parentContainer}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={innerStyles.mainTextBold}>Delivery</Text>
                            <Text style={[innerStyles.lightText, { textAlign: "left" }]}>Order number is 4839200012</Text>

                            <TouchableOpacity style={[styles.buttonContainer, { marginTop: 20, width: '100%' }]}>
                                <Text style={innerStyles.buttonTextContainer}>Shipping will be added later </Text>
                            </TouchableOpacity>

                            <View style={innerStyles.horizontalView}>
                                <TouchableOpacity style={[innerStyles.squareBoxButtons, { flex: 0.5 }]}>
                                    <Image style={{
                                        width: width * 0.12,
                                        height: height * 0.12,
                                    }} resizeMode="contain" source={require("../static/icon_done.png")} />
                                    <Text style={[innerStyles.lightText, { textAlign: 'center' }]}>Billing and delivery info are the same</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[innerStyles.squareBoxButtons, { flex: 0.5, marginStart: 20 }]}>
                                    <ImageBackground style={{
                                        width: width * 0.12,
                                        height: height * 0.12,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} resizeMode="contain" source={require("../static/icon_empty_round.png")} >
                                        <View style={{
                                            alignItems: 'center',
                                            

                                        }}>
                                            <Image style={{
                                                width: width * 0.08,
                                                height: height * 0.08,
                                            }} resizeMode="contain" source={require("../static/icon_plus.png")} />
                                        </View>
                                    </ImageBackground>
                                    <Text style={[innerStyles.lightText, { textAlign: 'center' }]}>Create a new profile</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Full name" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Street address" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="City / Town" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="State" />
                                <TextInput style={[styles.input, {marginStart: 20}]} placeholder="Zip code" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Phone number" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Email address" />
                            </View>
                        </View>
                        <View style={innerStyles.showOrderView}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                                <Text style={[styles.buttonText, { fontSize: 18, lineHeight: 30 }]}>Order amount: </Text>
                                <Text style={[styles.buttonText, { flex: 1, fontSize: 18, lineHeight: 30, textAlign: 'right' }]}>$103.88</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                                <Text style={[innerStyles.lightText, { lineHeight: 30 }]}>Your total amount of discount:</Text>
                                <Text style={[innerStyles.lightText, { flex: 1, lineHeight: 30, textAlign: 'right' }]}>-$55.02</Text>
                            </View>
                        </View>
                        <View style={[styles.buttonContainer, {
                            paddingHorizontal: 30, width: '100%',
                            backgroundColor: '#f6f6f6',
                            paddingBottom: 20
                        }]}>
                            <TouchableOpacity style={[innerStyles.buttonPaymentMethod]}>
                                <Text
                                    style={[
                                        styles.buttonText,
                                        {
                                            color: '#ffffff',
                                            fontSize: 18,
                                            lineHeight: 22
                                        },
                                    ]}>
                                    Payment method
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                <Footer  navigation={this.props.navigation}/>
            </SafeAreaView>
        )
    }
}

const innerStyles = StyleSheet.create({
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
    buttonTextContainer: {
        width: '100%',
        paddingVertical: 30,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#007de3",
        textAlign: 'center',
        fontSize: 18,
    },
    horizontalView: {
        flexDirection: 'row',
        paddingVertical: 10,
        flex: 1,
    },
    squareBoxButtons: {
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e6e6e7",
        alignItems: 'center',
    },
    showOrderView: {
        paddingTop: 15,
        flexDirection: 'column',
        flex: 1,
        marginTop: 15,
        width: '100%',
        backgroundColor: '#f6f6f6'
    },
    buttonPaymentMethod: {
        width: '100%',
        backgroundColor: '#2967ff',
        borderRadius: 6,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 15,
    },
})

export default Delivery;