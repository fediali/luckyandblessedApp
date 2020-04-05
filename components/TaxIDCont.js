import React, { Component } from 'react';
import {
    TextInput,
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';

import styles from './Styles/Style'
import LogoSmall from './Styles/LogoSmall'
import Header from './Header'
import {
    SafeAreaView
} from 'react-native-safe-area-context';
import Style from './Styles/Style';
import { colors } from 'react-native-elements';

class TaxIDCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newValue1: '',
            newValue2: '',
            height1: 140,
            height2: 140
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
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: "#fff",
                    flexGrow: 1,
                    justifyContent: 'space-between',
                }}
            >
                <SafeAreaView style={styles.parentContainer}>
                    <Header centerText={""} />
                    <View style={styles.subParentContainer}>
                        <LogoSmall/>
                        <Text style={styles.customTextBold}>Use & Sale Tax Form</Text>
                        <Text style={[innerStyles.customTextBoldSmall]}>Description of the type of business activity generally engaged in or type of items normally sold by the purchaser:</Text>

                    <View style={[innerStyles.customInputView, { paddingHorizontal: 30 }]}>
                        <TextInput
                            placeholder="type here"
                            onChangeText={(value1) => this.setState({ value1 })}
                            style={[innerStyles.customInput, newStyle1]}
                            editable={true}
                            multiline={true}
                            value={value1}
                            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                        >

                        </TextInput>
                    </View>
                    <Text style={[innerStyles.customTextBoldSmall, { marginTop: 15 }]}>This certificate should be furnished to the supplier. Do not send the completed certificate to the Comptroller of Public Accounts.</Text>
                    <View style={[innerStyles.customInputView, { paddingHorizontal: 30 }]}>
                        <TextInput
                            placeholder="Sign Here"
                            onChangeText={(value2) => this.setState({ value2 })}
                            style={[innerStyles.customInput, newStyle2]}
                            editable={true}
                            multiline={true}
                            value={value2}
                            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                        >

                        </TextInput>
                    </View>
                    <Text style={[innerStyles.customTextBoldSmall, { width: '100%',textAlign: 'left' }]}>Date: 03 - 04 - 2020</Text>
                    <View style={styles.buttonContainer, { paddingHorizontal: 30, marginTop: 20, width: '100%' }}>
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

                </SafeAreaView>

            </ScrollView>
        )
    }
}

const innerStyles = StyleSheet.create({
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
        width:'100%',
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
})

export default TaxIDCont;