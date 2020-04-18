import React, {
    Component
} from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Button,
} from 'react-native';

import styles from './Styles/Style'
import Header from "../reusableComponents/Header"
import SignatureCapture from 'react-native-signature-capture';
import { Icon } from 'react-native-elements'

import {
    SafeAreaView
} from 'react-native-safe-area-context'

import LogoSmall from './Styles/LogoSmall';

class TaxID extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newValue1: '',
            newValue2: '',
            height1: 40,
            height2: 40,
            nameOfPurchase: "",
            nameOfPurchaseError: "",
            phone: "",
            phoneError: "",
            address: "",
            addressError: "",
            texasSales: "",
            texasSalesError: "",
            outOfState: "",
            outOfStateError: "",
            mexicoRegistration: "",
            mexicoRegistrationError: "",
            description: "",
            descriptionError: "",
            sign: false,
            signError: "",
        }
    }

    updateSize = (height) => {
        this.setState({
            height
        });
    }


    updateSize = (height) => {
        this.setState({
            height
        });
    }

    //this will save the signature as an image in internal storage of user
    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
        this.setState({sign: true})
        console.log("dragged");
    }

    submitClick = () => {
        if(this.isValid()){
            //call your API here
        }
    }

    isValid() {
        let validFlag = true
        if (this.state.nameOfPurchase == "") {
            this.setState({ nameOfPurchaseError: "Name of purchase,firm or agence is required." })
            validFlag = false;
        } else {
            this.setState({ nameOfPurchaseError: "" })
        }

        if (this.state.phone == "") {
            this.setState({ phoneError: "Phone is required." })
            validFlag = false;
        } else {
            this.setState({ phoneError: "" })
        }

        if (this.state.address == "") {
            this.setState({ addressError: "Address, City, State, Zip code is required." })
            validFlag = false;
        } else {
            this.setState({ addressError: "" })
        }

        if (this.state.texasSales == "") {
            this.setState({ texasSalesError: "Texas sales & Use Tax Permit number is required." })
            validFlag = false;
        } else {
            this.setState({ texasSalesError: "" })
        }

        if (this.state.outOfState == "") {
            this.setState({ outOfStateError: "Out-of-state or Federal Texpay number is required." })
            validFlag = false;
        } else {
            this.setState({ outOfStateError: "" })
        }

        if (this.state.mexicoRegistration == "") {
            this.setState({ mexicoRegistrationError: "Mexico registration form is required." })
            validFlag = false;
        } else {
            this.setState({ mexicoRegistrationError: "" })
        }

        if (this.state.description == "") {
            this.setState({ descriptionError: "Description of buisness is required." })
            validFlag = false;
        } else {
            this.setState({ descriptionError: "" })
        }

        if (this.state.sign == false) {
            this.setState({ signError: "Your signature is required." })
            validFlag = false;
        } else {
            this.setState({ signError: "" })
        }
        return validFlag
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
        const { value1, _, height1, __ } = this.state;
        const { ___, value2, ____, height2 } = this.state;

        let newStyle1 = {
            height1
        }
        let newStyle2 = {
            height2
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} centerText={""} rightIcon="info" />

                <ScrollView
                    contentContainerStyle={{
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                    }}>
                    <View style={[styles.parentContainer, { marginBottom: 38 }]}>

                        <View style={styles.subParentContainer}>
                            <LogoSmall />

{/* keyboardType={Device.isAndroid ? "numeric" : "number-pad"}
 */}
                            <Text style={[styles.customTextBold, { marginTop: 20 }]}>Use & Sale Tax Form</Text>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name of purchaser, firm or agence"
                                    onChangeText={(text) => { this.setState({ nameOfPurchase: text }) }}
                                />
                            </View>
                            {this.state.nameOfPurchaseError != "" ? this.showErrorMessage(this.state.nameOfPurchaseError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    keyboardType={"number-pad"}
                                    onChangeText={(text) => { this.setState({ phone: text }) }}
                                />
                            </View>
                            {this.state.phoneError != "" ? this.showErrorMessage(this.state.phoneError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address, City, State, ZIP code"
                                    onChangeText={(text) => { this.setState({ address: text }) }}
                                />
                            </View>
                            {this.state.addressError != "" ? this.showErrorMessage(this.state.addressError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Texas sales & Use Tax Permit Num"
                                    keyboardType={"number-pad"}
                                    onChangeText={(text) => { this.setState({ texasSales: text }) }}
                                />
                            </View>
                            {this.state.texasSalesError != "" ? this.showErrorMessage(this.state.texasSalesError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Out-of-state or Fedral Taxpay Num"
                                    keyboardType={"number-pad"}
                                    onChangeText={(text) => { this.setState({ outOfState: text }) }}
                                />
                            </View>
                            {this.state.outOfStateError != "" ? this.showErrorMessage(this.state.outOfStateError) : <View></View>}

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mexico registration form"
                                    onChangeText={(text) => { this.setState({ mexicoRegistration: text }) }}
                                />
                            </View>
                            {this.state.mexicoRegistrationError != "" ? this.showErrorMessage(this.state.mexicoRegistrationError) : <View></View>}

                            <Text style={[innerStyles.customText1]}>
                                I, the purchaser named above, claim the right to make a non-taxable purchase (for resale of the taxable items described below or on the attached order or invoice) from:
                            </Text>
                            <Text style={[innerStyles.customText1, { marginTop: 15 }]}><Text style={[styles.customTextBold, { fontSize: 20 }]}>L&B</Text> - 12801 N STEMMONS FWY STE 710 FARMERS BRANCH, TX 75234</Text>
                            <View style={innerStyles.divider}></View>
                            <Text style={[innerStyles.customTextBoldSmall, { marginTop: 15 }]}>Description of the type of business activity generally engaged in or type of items normally sold by the purchaser:</Text>

                            <View style={[innerStyles.customInputView, { paddingHorizontal: 30 }]}>
                                <TextInput
                                    placeholder="Type here"
                                    onChangeText={(value1) => this.setState({ value1,description: value1 })}
                                    style={[innerStyles.customInput]}
                                    editable={true}
                                    multiline={true}
                                    value={value1}
                                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                                >

                                </TextInput>
                            </View>
                            {this.state.descriptionError != "" ? this.showErrorMessage(this.state.descriptionError) : <View></View>}

                            <Text style={[innerStyles.customTextBoldSmall, { marginTop: 15 }]}>This certificate should be furnished to the supplier. Do not send the completed certificate to the Comptroller of Public Accounts.</Text>
                            <View style={[innerStyles.customInputView, { height: 240, paddingHorizontal: 30, }]}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                    <Text style={{
                                        fontFamily: "Avenir-Heavy",
                                        fontSize: 16,
                                        fontStyle: "normal",
                                        lineHeight: 22,
                                        letterSpacing: 0,
                                        color: "#2d2d2f",
                                        marginTop: 5
                                    }}>
                                        Sign Below:</Text>
                                    <TouchableOpacity onPress={this.resetSign.bind(this)}>
                                        <Text style={innerStyles.resetSignature}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                                <SignatureCapture
                                    style={[{ borderRadius: 6, borderColor: '#000', flex: 1 }]}
                                    ref="sign"
                                    showBorder={true}
                                    backgroundColor={'#f6f6f6'}
                                    contentSize="10"
                                    onSaveEvent={this._onSaveEvent}
                                    onDragEvent={this._onDragEvent.bind(this)}
                                    saveImageFileInExtStorage={false}
                                    showNativeButtons={false}
                                    showTitleLabel={true}
                                    viewMode={"portrait"}
                                    maxStrokeWidth={8}
                                    minStrokeWidth={7} />
                            </View>
                            {this.state.signError != "" ? this.showErrorMessage(this.state.signError) : <View></View>}

                            <Text style={[innerStyles.customTextBoldSmall, { width: '100%', textAlign: 'left' }]}>Date: 03 - 04 - 2020</Text>
                            <View style={[styles.buttonContainer, { paddingHorizontal: 30, marginTop: 20, width: '100%' }]}>
                                <TouchableOpacity style={[innerStyles.buttonSubmit]} onPress={() => this.submitClick()}>
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: '#ffffff',
                                                fontSize: 20
                                            },
                                        ]}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;

const innerStyles = StyleSheet.create({
    customText1: {
        fontFamily: "Avenir",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#2d2d2f",
        paddingHorizontal: 30
    },
    customTextBoldSmall: {
        fontFamily: "Avenir-Heavy",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        color: "#2d2d2f",
        paddingHorizontal: 30,
        marginTop: 5
    },
    customInputView: {
        height: 130,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    customInput: {
        borderRadius: 6,
        backgroundColor: '#f6f6f6',
        flex: 1,
        paddingHorizontal: 15,
        fontFamily: 'Avenir-Book',
        fontSize: 18,
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 24,
        letterSpacing: 0,
        color: '#2d2d2f',
        flexWrap: 'wrap'
    },
    buttonSubmit: {
        width: '100%',
        backgroundColor: '#2967ff',
        borderRadius: 6,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 15,
    },
    divider: {
        marginTop: 15,
        height: Height * 0.009,
        width: Width,
        backgroundColor: '#f6f6f6',
    },
    resetSignature: {
        fontFamily: "Avenir-Book",
        fontSize: 12,
        lineHeight: 24,
        color: "#2967FF",
    }
})

export default TaxID;