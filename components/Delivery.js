import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native'

import LogoMedium from './Styles/LogoMedium'
import styles from './Styles/Style'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import { TextInput } from 'react-native-gesture-handler';

class Delivery extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                <ScrollView contentContainerStyle={
                    {
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 60
                    }
                }>

                    <SafeAreaView styles={styles.parentContainer}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={innerStyles.mainTextBold}>Delivery</Text>
                            <Text style={[innerStyles.lightText, { textAlign: "left" }]}>Order number is 4839200012</Text>

                            <TouchableOpacity style={[styles.buttonContainer, { marginTop: 20, width: '100%' }]}>
                                <Text style={innerStyles.buttonTextContainer}>Shipping will be added later </Text>
                            </TouchableOpacity>

                            <View style={innerStyles.horizontalView}>
                                <TouchableOpacity style={[innerStyles.squareBoxButtons, { flex: 0.5 }]}>
                                    <LogoMedium />
                                    <Text style={[innerStyles.lightText, { textAlign: 'center' }]}>Billing and delivery info are the same</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[innerStyles.squareBoxButtons, { flex: 0.5, marginStart: 20 }]}>
                                    <LogoMedium />
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
                                <TextInput style={styles.input} placeholder="Zip code" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Phone number" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Email address" />
                            </View>
                        </View>
                        <View style={innerStyles.showOrderView}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Text style={[styles.buttonText, { fontSize: 25, lineHeight: 30 }]}>Order amount: </Text>
                                <Text style={[innerStyles.lightText, { lineHeight: 30 }]}>Your total amount of discount:</Text>


                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20, marginEnd: 0 }}>
                                <Text style={[styles.buttonText, { fontSize: 25, lineHeight: 30 }]}>$103.88</Text>
                                <Text style={[innerStyles.lightText, { lineHeight: 30 }]}>-$55.02</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer, {
                            paddingHorizontal: 30, width: '100%',
                            backgroundColor: '#f6f6f6',
                            paddingBottom: 20
                        }}>
                            <TouchableOpacity style={[innerStyles.buttonPaymentMethod]}>
                                <Text
                                    style={[
                                        styles.buttonText,
                                        {
                                            color: '#ffffff',
                                            fontSize: 20
                                        },
                                    ]}>
                                    Payment method
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                </ScrollView>
                <Footer />
            </View>
        )
    }
}

const innerStyles = StyleSheet.create({
    mainTextBold: {
        fontFamily: "Montserrat-Bold",
        fontSize: 40,
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
        fontSize: 20,
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
        paddingTop:15,
        flexDirection: 'row',
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