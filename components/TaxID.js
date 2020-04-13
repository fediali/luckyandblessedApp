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
    Button
} from 'react-native';

import styles from './Styles/Style'
import Header from "../reusableComponents/Header"
import SignatureCapture from 'react-native-signature-capture';

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
            height2: 40
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
        console.log("dragged");
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


                            <Text style={[styles.customTextBold, { marginTop: 20 }]}>Use & Sale Tax Form</Text>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Name of purchaser, firm or agence" />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Phone" />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Address, City, State, ZIP code" />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Texas sales & Use Tax Permit Num" />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Out-of-state or Fedral Taxpay Num" />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput style={styles.input} placeholder="Mexico registration form" />
                            </View>

                            <Text style={[innerStyles.customText1]}>
                                I, the purchaser named above, claim the right to make a non-taxable purchase (for resale of the taxable items described below or on the attached order or invoice) from:
                        </Text>
                            <Text style={[innerStyles.customText1, { marginTop: 15 }]}><Text style={[styles.customTextBold, { fontSize: 20 }]}>L&B</Text> - 12801 N STEMMONS FWY STE 710 FARMERS BRANCH, TX 75234</Text>
                            <View style={innerStyles.divider}></View>
                            <Text style={[innerStyles.customTextBoldSmall, { marginTop: 15 }]}>Description of the type of business activity generally engaged in or type of items normally sold by the purchaser:</Text>

                            <View style={[innerStyles.customInputView, { paddingHorizontal: 30 }]}>
                                <TextInput
                                    placeholder="type here"
                                    onChangeText={(value1) => this.setState({ value1 })}
                                    style={[innerStyles.customInput]}
                                    editable={true}
                                    multiline={true}
                                    value={value1}
                                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                                >

                                </TextInput>
                            </View>
                            <Text style={[innerStyles.customTextBoldSmall, { marginTop: 15 }]}>This certificate should be furnished to the supplier. Do not send the completed certificate to the Comptroller of Public Accounts.</Text>
                            <View style={[innerStyles.customInputView, { height:240,paddingHorizontal: 30 }]}>
                                <Text style={innerStyles.customTextBoldSmall}>Sign Below:</Text>
                                <SignatureCapture
                                    style={[{ borderRadius: 6, borderColor: '#000', flex: 1 }]}
                                    ref="sign"
                                    showBorder={true}
                                    backgroundColor={'#f6f6f6'}
                                    contentSize="10"
                                    onSaveEvent={this._onSaveEvent}
                                    onDragEvent={this._onDragEvent}
                                    saveImageFileInExtStorage={false}
                                    showNativeButtons={false}
                                    showTitleLabel={true}
                                    viewMode={"portrait"}
                                    maxStrokeWidth={8}
                                    minStrokeWidth={7} />
                                <TouchableOpacity style={{ width: '60%', height: '25%', backgroundColor: '#22242a', alignSelf:'flex-end',justifyContent:'center', borderRadius:6 , marginTop:10}}
                                    onPress={this.resetSign.bind(this)}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: '#ffffff',
                                                fontSize: 20
                                            },
                                        ]}>
                                        
                                        Reset Sign
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[innerStyles.customTextBoldSmall, { width: '100%', textAlign: 'left' }]}>Date: 03 - 04 - 2020</Text>
                            <View style={[styles.buttonContainer, { paddingHorizontal: 30, marginTop: 20, width: '100%' }]}>
                                <TouchableOpacity style={[innerStyles.buttonSubmit]}>
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
        textAlign: "center",
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
    }
})

export default TaxID;