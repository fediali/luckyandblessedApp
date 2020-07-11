import React, { PureComponent } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import FastImage from 'react-native-fast-image'

export default class ProductPageSimilarListItem extends PureComponent {
    navigateToProductPage=()=>{
        this.props.navigation.push("ProductPage", { pid: this.props.pid, cname:this.props.cname }) 
    }

    customSetState(stateVal){
        this.props.customSetState(stateVal)
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={innerStyles.historyTouchable} onPress={this.navigateToProductPage}>
                <FastImage
                    style={innerStyles.gridImage}
                    // resizeMode='contain'
                    resizeMode="cover"
                    source={{uri: (this.props.imageUrl)?this.props.imageUrl:""}}
                />
                <Text style={innerStyles.gridItemNameAndPriceText}>{this.props.name}</Text>
                <Text style={[innerStyles.showAllText, innerStyles.brandText]}>{this.props.type}</Text>
            </TouchableOpacity>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({

    historyTouchable: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginBottom: 50
    },
    gridImage: {
        width: Width * 0.427,
        height: Height * 0.28,
        borderRadius: 6,
    },
    gridItemNameAndPriceText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "left",
        color: '#2d2d2f',
        maxWidth:Width * 0.427
    },
    showAllText: {
        fontFamily: "Avenir-Book",
        fontSize: 18,
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: "right",
        color: '#2967ff'
    },
    brandText: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "left",
        marginTop: 5
    },
})


