import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Dimensions, } from 'react-native';
import {Image as FastImage} from 'react-native';

export default class OrderProductListItem extends PureComponent {
  render() {
    return (
      <View style={styles.padBottom20}>
        <View style={styles.topLevelView}>
          <View style={styles.mainfdRow}>
            <View style={styles.thumbnailView}>
              <FastImage
                style={[styles.thumbnailImage]}
                resizeMode="contain"
                source={{ uri: this.props.data.imageUrl }}
              />
            </View>

            <View style={[styles.priceTextView]}>
              <View style={[styles.fdRow]}>
                <Text style={[styles.itemNameText]}>
                  {this.props.data.itemName}
                </Text>
                <Text style={[styles.itemNameText]}>
                  ${this.props.data.totalPrice}
                </Text>
              </View>
              <View style={[styles.fdRow]}>
                <Text style={[styles.itemUnitPriceText]}>Unit price</Text>
                <Text style={[styles.lightText, styles.mart4]}>
                  ${this.props.data.unitPrice}
                </Text>
              </View>
              <Text style={styles.lightText}>SIZE: {this.props.data.size}</Text>
              <Text style={styles.lightText}>
                Color: {this.props.data.color}
              </Text>
              <Text style={[styles.lightText, styles.marb20]}>
                Quantity: {this.props.data.quantity}
              </Text>
            </View>
          </View>
          <View></View>
        </View>
      </View>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: '#2d2d2f',
    maxWidth: '60%',
  },

  lightText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
  },
  padBottom20: { paddingBottom: 20 },
  leftAligned: {
    textAlign: 'left',
  },
  rightAligned: {
    textAlign: 'right',
  },
  itemUnitPriceText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#2967ff',
    marginVertical: 4,
  },
  thumbnailImage: {
    height: 100,
    width: 100,
  },
  thumbnailView: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    justifyContent: 'center',
  },
  topLevelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    width: "100%",

  },
  fdRow: { flexDirection: 'row', justifyContent: 'space-between',  width: Width * 0.65 },
  mainfdRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceTextView: { flexDirection: 'column', paddingHorizontal: 10 },
  marb20: { marginBottom: 20 },
  mart4: { marginTop: 4 },
});
