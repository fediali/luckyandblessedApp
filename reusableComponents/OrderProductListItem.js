import React, { PureComponent } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

export default class OrderProductListItem extends PureComponent {
    render() {
        return (
            <View
              style={styles.topLevelView}>
              <View style={styles.fdRow}>
                <FastImage
                  style={[styles.thumbnailImage]}
                  resizeMode="contain"
                  source={require('../static/item_cart1.png')}
                />
                <View style={styles.priceTextView}>
                  <Text style={styles.itemNameText}>{this.props.data.itemName}</Text>
                  <Text
                    style={styles.itemUnitPriceText}>
                    Unit price
                  </Text>
                  <Text style={styles.lightText}>SIZE: {this.props.data.size}</Text>
                  <Text style={styles.lightText}>Color: {this.props.data.color}</Text>
                  <Text style={[styles.lightText, styles.marb20]}>
                    Quantity: {this.props.data.quantity}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.itemNameText}>{this.props.data.totalPrice}</Text>
                <Text style={[styles.lightText, styles.mart4]}>
                  {this.props.data.unitPrice}
                </Text>
              </View>
            </View>
        )}
}

const styles = StyleSheet.create({
    itemNameText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        fontStyle: 'normal',
        lineHeight: 20,
        letterSpacing: 0,
        color: '#2d2d2f',
      },
      itemUnitPriceText: {
        fontFamily: 'Avenir-Book',
        fontSize: 14,
        fontStyle: 'normal',
        lineHeight: 18,
        letterSpacing: 0,
        color: '#2967ff',
        marginVertical: 4
      },
      thumbnailImage: {
        height: 100,
        width: 100,
        borderRadius: 6,
      },
      topLevelView: {flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20},
      fdRow: {flexDirection: 'row'},
      priceTextView: {flexDirection: 'column', marginLeft: 20},
      marb20: {marginBottom: 20},
      mart4: {marginTop: 4},


})
