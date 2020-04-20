import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,ScrollView, ActivityIndicator } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { Icon } from 'react-native-elements'
import PostData from '../reusableComponents/API/PostData';
import Toast from 'react-native-simple-toast';
import GetData from '../reusableComponents/API/GetData';
import AsyncStorage from '@react-native-community/async-storage';

const baseUrl = "http://dev.landbw.co/";

// This Component is the Actual SignIn screen / Different from WalkThrough screen that will the intial screen(Greeting Screen)
// Naming Conventions for assets camelCase = **assetName-componentName**
class SignIn extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            requested:false
        }

    }

    _storeData = async (user) => {
        try {
            console.log("vaing ", user)
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            // Error saving data
            console.log(error)
        }
    };

    signInClick = () => {
        if (this.isValid()) {
            var promises = []
            this.setState({requested:true})
            promises.push(GetData(baseUrl + `api/users?email=${this.state.email}`))
            Promise.all(promises).then((promiseResponses) => {
                Promise.all(promiseResponses.map(res => res.json())).then((responses) => {
                    console.log(responses[0].users.length)
                    // this.props.navigation.navigate("MainPage", {userName:"asdasd"}) //Passing user Name

                    if (responses[0].users.length > 0) {
                        console.log(responses[0].users[0].user_id) //TODO: Save this UID
                        console.log(responses[0].users[0].firstname + " " + responses[0].users[0].lastname)
                        Toast.show('Login Successful');
                        console.log(responses[0].users[0].firstname + " " + responses[0].users[0].lastname)
                        var user={
                            user_id: responses[0].users[0].user_id,
                            name: responses[0].users[0].firstname + " " + responses[0].users[0].lastname
                        }
                        this._storeData(user)
                        //TODO: uncomment this
                        this.props.navigation.navigate("MainPage", { userName: responses[0].users[0].firstname + " " + responses[0].users[0].lastname }) //Passing user Name
                    }
                    else {
                        Toast.show('Username or password incorrect', Toast.LONG);
                        this.setState({requested:false})
                    }

                }).catch(ex => { console.log("Inner Promise", ex); alert(ex); })
            }).catch(ex => { console.log("Outer Promise", ex); alert(ex); })
        }
        this.props.navigation.navigate("MainPage",{userName: "Test Name"}) //TODO: Remove this

    }

    isValid() {
        let validFlag = true

        if (this.state.email == "") {
            this.setState({ emailError: "Email is required." })
            validFlag = false;
        } else {
            this.setState({ emailError: "" })
        }

        if (this.state.password == "") {
            this.setState({ passwordError: "Password is required." })
            validFlag = false;
        } else {
            this.setState({ passwordError: "" })
        }

        return validFlag;
    }

    showErrorMessage(errorMessage) {
        return (
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 15 }}>
                <Icon size={30} name='md-information-circle-outline' type='ionicon' color='#FF0000' />
                <Text style={{ paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%' }}>{errorMessage}</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
            
                <View style={styles.subContainer}>
                    <Image style={{
                        width: "53%",
                        height: "35%",
                        marginBottom:20
                    
                    }} resizeMode="contain" source={require("../static/logo-signIn.png")} />
                    {/* TODO: Image has to be changed with orignal one */}
                    <View style={styles.emailInputView}>
                        <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => { this.setState({ email: text }) }} />
                    </View>
                    {this.state.emailError != "" ? this.showErrorMessage(this.state.emailError) : <View></View>}
                    <View style={styles.passwordInputView}>
                        <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" onChangeText={(text) => { this.setState({ password: text }) }} />
                    </View>
                    {this.state.passwordError != "" ? this.showErrorMessage(this.state.passwordError) : <View></View>}

                    <View style={styles.buttonContainer}>
                        {/* TODO: Check whether to apply the touchable opacity or ripple */}
                        <TouchableOpacity style={styles.buttonSignUp} onPress={() => { this.props.navigation.navigate("SignUp") }} >
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSignIn} onPress={() => { this.signInClick() }}>
                            <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                    {
                        this.state.requested?<ActivityIndicator style={{marginTop:30}}size="large" color="#2967ff"/>
                        :null
                    }
                </View>

            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
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
        paddingHorizontal: 15,
        fontFamily: "Avenir-Book",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        // lineHeight: 24,
        letterSpacing: 0,
        color: "#2d2d2f",
        paddingVertical: 11,


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
        flexDirection: "row",
        paddingHorizontal: 40,
        marginTop: 15,

    },
    emailInputView: {
        flexDirection: "row",
        paddingHorizontal: 40,

    }
})

export default SignIn