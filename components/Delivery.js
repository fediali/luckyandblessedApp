import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image,
    ImageBackground,
    InteractionManager
} from 'react-native'

import LogoMedium from './Styles/LogoMedium'
import styles from './Styles/Style'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import { TextInput } from 'react-native-gesture-handler';
import Shimmer from 'react-native-shimmer';

class Delivery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        }
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ isReady: true })
        })
    };

    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;

        if (!this.state.isReady) {
            return (
                <View style={innerStyles.loader}>
                    <Shimmer>
                        <Image style={innerStyles.loaderImage} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )

        }

        return (
            <SafeAreaView style={innerStyles.maincontainer}>
                <Header navigation={this.props.navigation} />
                <ScrollView contentContainerStyle={
                    innerStyles.scrollView
                }>

                    <View styles={innerStyles.parentContainer}>
                        <View style={innerStyles.paddingHorizontal}>
                            <Text style={innerStyles.mainTextBold}>Delivery</Text>
                            <Text style={[innerStyles.lightText, innerStyles.textAlignLeft]}>Order number is 4839200012</Text>

                            <TouchableOpacity activeOpacity={0.5} style={[styles.buttonContainer, styles.buttonContainerAdd]}>
                                <Text style={innerStyles.buttonTextContainer}>Shipping will be added later </Text>
                            </TouchableOpacity>

                            <View style={innerStyles.horizontalView}>
                                <TouchableOpacity activeOpacity={0.5} style={innerStyles.squareBoxButtons}>
                                    <Image style={innerStyles.iconDoneStyle} resizeMode="contain" source={require("../static/icon_done.png")} />
                                    <Text style={[innerStyles.lightText, innerStyles.textAlignCenter]}>Billing and delivery info are the same</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={[innerStyles.squareBoxButtons, innerStyles.marginStart]}>
                                    <ImageBackground style={innerStyles.iconDoneStyle} resizeMode="contain" source={require("../static/icon_empty_round.png")} >
                                        <View style={innerStyles.alignCenter}>
                                            <Image style={innerStyles.plusIconStyle} resizeMode="contain" source={require("../static/icon_plus.png")} />
                                        </View>
                                    </ImageBackground>
                                    <Text style={[innerStyles.lightText, innerStyles.textAlignCenter]}>Create a new profile</Text>
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
                                <TextInput style={[styles.input, innerStyles.marginStart]} placeholder="Zip code" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Phone number" />
                            </View>

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Email address" />
                            </View>
                        </View>
                        <View style={innerStyles.showOrderView}>
                            <View style={innerStyles.orderViewNested}>
                                <Text style={[styles.buttonText, innerStyles.textBold]}>Order amount: </Text>
                                <Text style={[styles.buttonText, innerStyles.textBold, innerStyles.alignRight]}>$103.88</Text>
                            </View>
                            <View style={innerStyles.orderViewNested}>
                                <Text style={innerStyles.lightText}>Your total amount of discount:</Text>
                                <Text style={[innerStyles.lightText, innerStyles.priceText]}>-$55.02</Text>
                            </View>
                        </View>
                        <View style={[styles.buttonContainer, innerStyles.buttonStyles]}>
                            <TouchableOpacity activeOpacity={0.5} style={[innerStyles.buttonPaymentMethod]} onPress={() => { this.props.navigation.navigate("Payment") }}>
                                <Text
                                    style={[
                                        styles.buttonText,
                                        innerStyles.paymentText,
                                    ]}>
                                    Payment method
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                <Footer navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    paymentText: {
        color: '#ffffff',
        fontSize: 18,
        lineHeight: 22
    },
    buttonStyles: {
        paddingHorizontal: 30, width: '100%',
        backgroundColor: '#f6f6f6',
        paddingBottom: 20
    },
    priceText: { flex: 1, lineHeight: 30, textAlign: 'right' },
    marginStart: { marginStart: 20 },
    alignRight: { flex: 1, textAlign: 'right' },
    textBold: { fontSize: 18, lineHeight: 30 },
    orderViewNested: { flexDirection: 'row', paddingHorizontal: 20 },
    plusIconStyle: {
        width: width * 0.08,
        height: height * 0.08,
    },
    paddingHorizontal: { paddingHorizontal: 20 },
    iconDoneStyle: {
        width: width * 0.12,
        height: height * 0.12,
        justifyContent: "center"
    },
    marginStart: { marginStart: 20 },
    buttonContainerAdd: { marginTop: 20, width: '100%' },
    maincontainer: { flex: 1, backgroundColor: "#fff" },
    scrollView: {
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 60
    },
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
        lineHeight: 30
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
        flex: 0.5
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
    loader: { flex: 1, alignItems: "center", justifyContent: "center", },
    loaderImage: { height: 200, width: 200 },
    textAlignLeft: { textAlign: "left" },
    textAlignCenter: { textAlign: 'center' },
    alignCenter:{
        alignItems: 'center',
    }
})

export default Delivery;