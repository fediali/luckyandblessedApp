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
    SafeAreaView,
    InteractionManager
} from 'react-native';
import { Icon } from 'react-native-elements'
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import LogoSmall from "./Styles/LogoSmall"
import Shimmer from 'react-native-shimmer';

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
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                    <Shimmer>
                        <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
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
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 30, lineHeight: 36, color: "#2d2d2f" }}>Payment</Text>
                                    <Text style={{ fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#8d8d8e" }}>Secure Checkout</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                                        <Image style={{ height: 25, width: 25, marginRight: 5 }} source={require("../static/icon_done.png")} />
                                        <Image style={{ height: 24, width: 149 }} source={require("../static/visaLogo.png")} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5}>

                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image style={{ height: 25, width: 25, marginRight: 5 }} source={require("../static/icon_done.png")} />
                                        <Image style={{ height: 21, width: 89 }} source={require("../static/paypalLogo.png")} />
                                    </View>
                                </TouchableOpacity>
                                {/* <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22, color: "#2967ff" }}>Credit Card</Text> */}
                                {/* <Text style={styles.heading}>Paypal</Text> */}
                            </View>
                            <View>
                                <Text style={[styles.heading, { marginTop: 29, marginBottom: 18 }]}>Delivery details:</Text>
                                <Text>UPS Shipping - shipping will be added later</Text>
                                <View style={{ marginTop: 29, marginBottom: 11, flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.heading}>Shipping address:</Text>
                                    <Text style={styles.textButton}>Edit</Text>
                                </View>
                                <Text style={{ width: width * 0.6 }}>Monika Willems,455 Larkspur Dr. california springs, Ca 92926, USA</Text>
                                <View style={{ marginTop: 36, marginBottom: 18, flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.heading}>Gift Certificate Or Promo Code:</Text>
                                    <Text style={styles.textButton}>Edit</Text>
                                </View>
                                <Text style={styles.smallGreyText}>123456576785857 - $200 added</Text>
                                <View style={{ marginTop: 34, marginBottom: 18, flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.heading}>Credit card</Text>
                                    <Text style={styles.textButton}>Clear All</Text>
                                </View>
                                <TextInput style={[styles.textInput, { borderRadius: 6 }]} placeholder="Card holder name" />
                                <TextInput style={[styles.textInput, { marginTop: 20, borderRadius: 6 }]} placeholder="Card number" />
                                <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 25 }}>
                                    <TextInput style={[styles.textInput, { marginRight: 13, flex: 1, borderRadius: 6 }]} placeholder="mm" />
                                    <TextInput style={[styles.textInput, { marginRight: 13, flex: 1, borderRadius: 6 }]} placeholder="yyyy" />
                                    <TextInput style={[styles.textInput, { flex: 1, borderRadius: 6 }]} placeholder="CVV" />
                                </View>

                            </View>
                        </View>
                        <View style={styles.divider}></View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <TextInput
                                style={[styles.textInput, { marginTop: 13, marginBottom: 15, borderRadius: 6 }]}
                                multiline={true}
                                numberOfLines={4}
                                placeholder="You can leave us a comment here" />
                        </View>
                        <View style={{ backgroundColor: "#f6f6f6", paddingHorizontal: 20, paddingVertical: 13 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                                <Text style={styles.heading}>Order Amount</Text>
                                <Text style={styles.heading}>$103.88</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text style={styles.smallGreyText}>Gift card/Promo applied:</Text>
                                <Text style={styles.smallGreyText}>-$55.02</Text>
                            </View>
                            <TouchableOpacity style={{ backgroundColor: "#2967ff", alignItems: "center", borderRadius: 6 }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    fontSize: 18,
                                    lineHeight: 22,
                                    color: "#fff",
                                    paddingVertical: 11
                                }}>Place Order</Text>
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
    }

})

export default Payment;