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

import { Icon } from 'react-native-elements'
import styles from './Styles/Style'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import { TextInput } from 'react-native-gesture-handler';
import Shimmer from 'react-native-shimmer';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';


const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;


class Delivery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            fullName: "",
            fullNameError: "",
            streetAddress: "",
            streetAddressError: "",
            cityTown: "",
            cityTownError: "",
            stateText: "",
            stateTextError: "",
            zipCode: "",
            zipCodeError: "",
            email: "",
            emailError: "",
            phoneNumber: "",
            phoneNumberError: "",
        }
    }



    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ isReady: false })
            // Retriving the user_id
            RetrieveDataAsync(STORAGE_USER).then((user) => {
                this.getData(JSON.parse(user));
            });
        })
    };

    getData = (user) => {
        var promises = [];
        promises.push(
            GetData(
                baseUrl +
                `api/userprofiles?user_id=${user.user_id}`,
            ),

        );
        console.log(baseUrl +
            `api/userprofiles?user_id=${user.user_id}`);
        Promise.all(promises)
            .then((promiseResponses) => {
                Promise.all(promiseResponses.map((res) => res.json()))
                    .then((responses) => {
                        if("firstname" in responses[0].users[0] && "lastname" in responses[0].users[0])
                        this.setState({
                            fullName: responses[0].users[0].firstname+" "+responses[0].users[0].lastname,
                        })
                        
                        if("email" in responses[0].users[0])
                        this.setState({
                            email: responses[0].users[0].email,
                        })
                        
                        if("street_address" in responses[0].users[0])
                        this.setState({
                            streetAddress: responses[0].users[0].street_address,
                        })
                        
                        if("zip" in responses[0].users[0])
                        this.setState({
                            zipCode: responses[0].users[0].zip,
                        })
                        
                        if("state" in responses[0].users[0])
                        this.setState({
                            stateText: responses[0].users[0].state,
                        })
                        
                        if("city" in responses[0].users[0])
                        this.setState({
                            cityTown: responses[0].users[0].city,
                        })
                        
                        if("phone_number" in responses[0].users[0])
                        this.setState({
                            phoneNumber: responses[0].users[0].phone_number,
                        })

                        this.setState({isReady: true})
                    })
                    .catch((ex) => {
                        console.log('Inner Promise', ex);
                    });
            })
            .catch((ex) => {
                console.log('Outer Promise', ex);
                alert(ex);
            });
    };

    validateAndRedirect=()=>{
        if(this.isValid()){
            //TODO: Call post userdetails API here. All input data is stored in state
            this.props.navigation.navigate("Payment")
        } 
    }

    isValid() {
        let validFlag = true

        if (this.state.fullName == "") {
            this.setState({ fullNameError: "Full Name is required." })
            validFlag = false;
        } else {
            this.setState({ fullNameError: "" })
        }

        if (this.state.streetAddress == "") {
            this.setState({ streetAddressError: "Street address is required." })
            validFlag = false;
        } else {
            this.setState({ streetAddressError: "" })
        }

        if (this.state.cityTown == "") {
            this.setState({ cityTownError: "City/Town is required." })
            validFlag = false;
        } else {
            this.setState({ cityTownError: "" })
        }

        if (this.state.stateText == "") {
            this.setState({ stateTextError: "State is required." })
            validFlag = false;
        } else {
            this.setState({ stateTextError: "" })
        }

        if (this.state.zipCode == "") {
            this.setState({ zipCodeError: "Zip code is required." })
            validFlag = false;
        } else {
            this.setState({ zipCodeError: "" })
        }

        if (this.state.email == "") {
            this.setState({ emailError: "Email is required." })
            validFlag = false;
        } else {
            this.setState({ emailError: "" })
        }

        if (this.state.phoneNumber == "") {
            this.setState({ phoneNumberError: "Phone number is required." })
            validFlag = false;
        } else {
            this.setState({ phoneNumberError: "" })
        }

        return validFlag;
    }

    showErrorMessage(errorMessage) {
        return (
            <View style={innerStyles.errorTextMainView}>
                <Icon size={30} name='md-information-circle-outline' type='ionicon' color='#FF0000' />
                <Text style={innerStyles.errorTextText}>{errorMessage}</Text>
            </View>
        )
    }

    

    render() {
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
                                <TextInput style={styles.input} placeholder="Full name" value={this.state.fullName} onChangeText={(text) => { this.setState({ fullName: text }) }} />
                            </View>
                            {this.state.fullNameError != "" ? this.showErrorMessage(this.state.fullNameError) : <View></View>}


                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Street address" value={this.state.streetAddress}  onChangeText={(text) => { this.setState({ streetAddress: text }) }} />
                            </View>
                            {this.state.streetAddressError != "" ? this.showErrorMessage(this.state.streetAddressError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="City / Town" value={this.state.cityTown}  onChangeText={(text) => { this.setState({ cityTown: text }) }} />
                            </View>
                            {this.state.cityTownError != "" ? this.showErrorMessage(this.state.cityTownError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="State" value={this.state.stateText}  onChangeText={(text) => { this.setState({ stateText: text }) }} />
                                <TextInput style={[styles.input, innerStyles.marginStart]} keyboardType={'number-pad'} placeholder="Zip code" />
                            </View>
                            {this.state.stateTextError != "" ? this.showErrorMessage(this.state.stateTextError) : <View></View>}
                            {this.state.zipCodeError != "" ? this.showErrorMessage(this.state.zipCodeError) : <View></View>}
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Phone number" keyboardType={'number-pad'} value={this.state.phoneNumber}  onChangeText={(text) => { this.setState({ phoneNumber: text }) }} />
                            </View>
                            {this.state.phoneNumberError != "" ? this.showErrorMessage(this.state.phoneNumberError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Email address" value={this.state.email}  onChangeText={(text) => { this.setState({ email: text }) }} />
                            </View>
                            {this.state.emailError != "" ? this.showErrorMessage(this.state.emailError) : <View></View>}

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
                            <TouchableOpacity activeOpacity={0.5} style={[innerStyles.buttonPaymentMethod]} onPress={()=>this.validateAndRedirect()}>
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
    errorTextMainView: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 15 },
    errorTextText: { paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%' },

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
    alignCenter: {
        alignItems: 'center',
    }
})

export default Delivery;