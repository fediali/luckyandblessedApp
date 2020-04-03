import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView} from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// This Component is the Actual SignIn screen / Different from WalkThrough screen that will the intial screen(Greeting Screen)
// TODO: code onPress to the Buttons
// Naming Conventions for assets camelCase = **assetName-componentName**
class SignIn extends Component {
    render() {
        return (
            <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={styles.subContainer}>
                    <Image style={styles.logo} resizeMode="contain" source={require("../static/logo-signIn.png")} />
                    {/* TODO: Image has to be changed with orignal one */}
                    <View style={styles.emailInputView}>
                        <TextInput style={styles.input} placeholder="Email" />
                    </View>
                    <View style={styles.passwordInputView}>
                        <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" />
                    </View>
                    <View style={styles.buttonContainer}>
                        {/* TODO: Check whether to apply the touchable opacity or ripple */}
                        <TouchableOpacity style={styles.buttonSignUp}>
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSignIn}>
                            <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

            </View>
            </SafeAreaView>
        )
    }
}
styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    subContainer: {
        flex: 1,
        alignItems: "center"
    },
    input: {
        borderRadius: 6,
        backgroundColor: "#f6f6f6",
        flex: 1,
        top: 6.7,
        paddingTop: 4.1,
        paddingLeft: 6.7,
        paddingBottom: 2.2,
        fontFamily: "Avenir-Book",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0,
        color: "#2d2d2f"

    },
    logo : {
        width: wp("53%"),
        height: hp("17.8%"),
        marginTop: 21.7,
        marginLeft: 28.3,
        marginRight: 30.4
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 25
    },
    buttonSignUp: {
        backgroundColor: "#2d2d2f",
        borderRadius: 6,
        paddingVertical: 11,
        paddingHorizontal: 38,
        marginRight: 15
    },
    buttonSignIn: {
        backgroundColor: "#2967ff",
        borderRadius: 6,
        paddingVertical: 11,
        paddingHorizontal: 38

    },
    buttonText: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    forgotPassword: {
        fontFamily: "Avenir-Book",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#2967ff",
        marginTop: 20

    },
    passwordInputView: {
        marginTop: 5,
        marginHorizontal: 10.7,
        flexDirection: "row",
        width: wp('82.9%'),
        height: hp('5.4%'),
        
    },
    emailInputView: {
        flexDirection: "row",
        marginTop: 21.4,
        marginHorizontal: 10.7,
        width: wp('82.9%'),
        height: hp('5.4%'),
    }
})

export default SignIn