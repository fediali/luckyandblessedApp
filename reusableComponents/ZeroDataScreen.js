import React, { PureComponent } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import FastImage from 'react-native-fast-image'
import styles from '../components/Styles/Style'

export default class ZeroDataScreen extends PureComponent {
    render() {
        return (
            <View style={[styles.parentContainer, innerStyles.marTop]}>
                <View style={[styles.subParentContainer, innerStyles.centeredView]}>
                    <FastImage
                        style={innerStyles.emptyImage}
                        source={require("../static/empty_product.png")}
                    />
                    
                    <Text style={innerStyles.customText}>Oops.. No Product Found.</Text>
                    
                </View>
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
        color: '#000',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 25
    }


})
