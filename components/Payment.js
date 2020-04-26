import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    InteractionManager
} from 'react-native';
import { Icon } from 'react-native-elements'
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import LogoSmall from "./Styles/LogoSmall"
import Shimmer from 'react-native-shimmer';
import FastImage from 'react-native-fast-image'

class Payment extends Component {

    constructor(props) {
        super(props)
        this.state = {
             isReady: false
        }
    }
    

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({isReady: true})
        })
      };

    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;

        if (!this.state.isReady) {
            return (
                <View style={styles.shimmerMainView}>
                    <Shimmer>
                        <FastImage style={styles.shimmerImage} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )
      
        }
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header  navigation={this.props.navigation}/>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                    <View style={{ marginBottom: 50 }}>
                        <View style={styles.subContainer}>
                            <View style={styles.paymentAndSecureView}>
                                <View>
                                    <Text style={styles.paymentText}>Payment</Text>
                                    <Text style={styles.secureCheckoutText}>Secure Checkout</Text>
                                </View>
                            </View>
                            <View style={styles.cardSelectorView}>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <View style={styles.cardSelectorTouchView}>

                                        <FastImage style={styles.imageDone} source={require("../static/icon_done.png")} />
                                        <FastImage style={styles.imageVisaLogo} source={require("../static/visaLogo.png")} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5}>

                                    <View style={styles.cardSelectorTouchView}>
                                        <FastImage style={styles.imageDone} source={require("../static/icon_done.png")} />
                                        <FastImage style={styles.imagePaypalLogo} source={require("../static/paypalLogo.png")} />
                                    </View>
                                </TouchableOpacity>
                                {/* <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22, color: "#2967ff" }}>Credit Card</Text> */}
                                {/* <Text style={styles.heading}>Paypal</Text> */}
                            </View>
                            <View>
                                <Text style={[styles.heading, styles.deliveryDetailText]}>Delivery details:</Text>
                                <Text>UPS Shipping - shipping will be added later</Text>
                                <View style={styles.shippingAddressView}>
                                    <Text style={styles.heading}>Shipping address:</Text>
                                    <Text style={styles.textButton}>Edit</Text>
                                </View>
                                <Text style={styles.monikaWillemsText}>Monika Willems,455 Larkspur Dr. california springs, Ca 92926, USA</Text>
                                <View style={styles.promoAndCreditCardView}>
                                    <Text style={styles.heading}>Gift Certificate Or Promo Code:</Text>
                                    <Text style={styles.textButton}>Edit</Text>
                                </View>
                                <Text style={styles.smallGreyText}>123456576785857 - $200 added</Text>
                                <View style={styles.promoAndCreditCardView}>
                                    <Text style={styles.heading}>Credit card</Text>
                                    <Text style={styles.textButton}>Clear All</Text>
                                </View>
                                <TextInput style={[styles.textInput, styles.cardHolderTextInput]} placeholder="Card holder name" />
                                <TextInput style={[styles.textInput, styles.cardNumTextInput]} placeholder="Card number" />
                                <View style={styles.cardInfoView}>
                                    <TextInput style={[styles.textInput, styles.dateTextInput]} placeholder="mm" />
                                    <TextInput style={[styles.textInput, styles.dateTextInput]} placeholder="yyyy" />
                                    <TextInput style={[styles.textInput, styles.cvvTextInput]} placeholder="CVV" />
                                </View>

                            </View>
                        </View>
                        <View style={styles.divider}></View>
                        <View style={styles.commentView}>
                            <TextInput
                                style={[styles.textInput, styles.commentTextInput]}
                                multiline={true}
                                numberOfLines={4}
                                placeholder="You can leave us a comment here" />
                        </View>
                        <View style={styles.orderView}>
                            <View style={styles.orderRowView}>
                                <Text style={styles.heading}>Order Amount</Text>
                                <Text style={styles.heading}>$103.88</Text>
                            </View>
                            <View style={styles.orderRowView}>
                                <Text style={styles.smallGreyText}>Gift card/Promo applied:</Text>
                                <Text style={styles.smallGreyText}>-$55.02</Text>
                            </View>
                            <TouchableOpacity style={styles.orderTouch}>
                                <Text style={styles.orderTouchText}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <Footer  navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    heading: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        lineHeight: 22,
        color: "#2d2d2f"
    },
    textButton: {
        fontFamily: "Avenir-Book",
        fontSize: 18,
        lineHeight: 24,
        color: "#2967ff"
    },
    textInput: {
        backgroundColor: "#f6f6f6",
        fontSize: 18,
        lineHeight: 24,
        color: "#2d2d2f",
        paddingHorizontal: 20,
        paddingVertical: 12
    },
    divider: {
        height: 0.009 * height,
        width: width,
        backgroundColor: '#f6f6f6',
    },
    smallGreyText: {
        fontFamily: "Avenir-Book",
        fontSize: 14,
        lineHeight: 18,
        color: "#8d8d8e"
    },
    shimmerMainView:{
        flex: 1, alignItems: "center", justifyContent: "center", 
    },
    shimmerImage:{
        height: 200, width: 200 
    },
    paymentAndSecureView:{ 
        flexDirection: "row", justifyContent: "space-between" 
    },
    paymentText:{
        fontFamily: "Montserrat-Bold", fontSize: 30, lineHeight: 36, color: "#2d2d2f" 
    },
    secureCheckoutText:{
        fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#8d8d8e" 
    },
    cardSelectorView:{
        flexDirection: "row", justifyContent: "space-between", marginTop: 25 
    },
    cardSelectorTouchView:{
        flexDirection: "row", alignItems: "center" 
    },
    imageDone:{
        height: 25, width: 25, marginRight: 5 
    },
    imageVisaLogo:{
        height: 24, width: 149 
    },
    imagePaypalLogo:{
        height: 21, width: 89 
    },
    deliveryDetailText:{
        marginTop: 29, marginBottom: 18 
    },
    shippingAddressView:{
        marginTop: 29, marginBottom: 11, flexDirection: "row", justifyContent: "space-between" 
    },
    monikaWillemsText:{
        width: width * 0.6 
    },
    promoAndCreditCardView:{
        marginTop: 36, marginBottom: 18, flexDirection: "row", justifyContent: "space-between" 
    },
    cardHolderTextInput:{
        borderRadius: 6
    },
    cardNumTextInput:{
        marginTop: 20, borderRadius: 6 
    },
    cardInfoView:{
        flexDirection: "row", marginTop: 20, marginBottom: 25 
    },
    dateTextInput:{
        marginRight: 13, flex: 1, borderRadius: 6 
    },
    cvvTextInput:{
        flex: 1, borderRadius: 6
    },
    commentView:{
        paddingHorizontal: 20 
    },
    commentTextInput:{
        marginTop: 13, marginBottom: 15, borderRadius: 6 
    },
    orderView:{
        backgroundColor: "#f6f6f6", paddingHorizontal: 20, paddingVertical: 13 
    },
    orderRowView:{
        flexDirection: "row", justifyContent: "space-between", marginBottom: 8 
    },
    orderTouch:{
        backgroundColor: "#2967ff", alignItems: "center", borderRadius: 6 
    },
    orderTouchText:{
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        lineHeight: 22,
        color: "#fff",
        paddingVertical: 11
    }

})

export default Payment;