import React, { PureComponent } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    View
} from 'react-native'
import FastImage from 'react-native-fast-image'

export default class ProductPageSimilarListItem extends PureComponent {
    render() {
        return (
            <TouchableOpacity  activeOpacity={0.8}
                style={innerStyles.touchStyle}>
                <View style={innerStyles.touchView}>
                  <FastImage
                    style={[innerStyles.thumbnailImage]}
                    resizeMode="contain"
                    source={require('../static/item_cart1.png')}
                  />
                  <View style={innerStyles.touchInnerView}>
                    <Text style={innerStyles.itemNameText}>{this.props.item.itemName}</Text>
                    <Text style={[innerStyles.categoriesText]}>{this.props.item.category}</Text>
                    <Text style={[innerStyles.priceText]}>{this.props.item.totalPrice}</Text>
                  </View>
                </View>
              </TouchableOpacity>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    touchStyle:{
        flexDirection: 'row', justifyContent: 'space-between' 
    },
    touchView:{
        flexDirection: 'row' 
    },
    touchInnerView:{
        flexDirection: 'column', marginLeft: 20 
    },
    thumbnailImage: {
      height: 110,
      width: 110,
      borderRadius: 6,
    },
    itemNameText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      lineHeight: 20,
      color: '#2d2d2f',
    },
    categoriesText: {
      color: '#2967ff',
      fontFamily: 'Avenir-Book',
      fontSize: 14,
      lineHeight: 18,
      marginTop: 7,
    },
    priceText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      lineHeight: 20,
      color: '#2d2d2f',
      marginTop: 6,
    },
})


