import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import FastImage from 'react-native-fast-image'
import Header from './Header'
import styles from '../components/Styles/Style'
import Footer from './Footer'

export default class ZeroDataScreen extends Component {
    render() {
        return (
            <View style={styles.parentContainer}>
                <Header />
                <View style={[styles.subParentContainer, innerStyles.centeredView]}>
                    <FastImage
                        style={innerStyles.emptyImage}
                        source={require("../static/empty_product.png")}
                    />
                    <Text style={innerStyles.customText}>Oops.. No Product Found. We will provide this soon.</Text>
                    <View style={innerStyles.buttonContainer}>
                        <TouchableOpacity style={innerStyles.buttonGoBack} onPress={() => { this.props.navigation.goBack()}} >
                            <Text style={innerStyles.buttonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Footer />
            </View>
        )
    }
}

const innerStyles = StyleSheet.create({

    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#fff000'
    },
    emptyImage: {
        height: 200,
        width: 200
    },
    customText: {
        fontFamily: 'Avenir-Book',
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: 1,
        textAlign: 'center',
        color: '#00c5db',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 25
    },
    buttonGoBack: {
        backgroundColor: "#00c5db",
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


})
