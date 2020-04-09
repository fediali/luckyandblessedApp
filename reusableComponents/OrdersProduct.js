import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';

export default class ordersProduct extends Component {
  renderSeparator = (item) => {
    return <View style={{paddingBottom: 20}} />;
  };

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    return (
      <View>
        <FlatList
          style={{marginTop: 13}}
          data={this.props.productList}
          keyExtractor={(item, index) => item.itemNum}
          renderItem={({item}) => (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={[styles.thumbnailImage]}
                  resizeMode="contain"
                  source={require('../static/item_cart1.png')}
                />
                <View style={{flexDirection: 'column', marginLeft: 20}}>
                  <Text style={styles.itemNameText}>{item.itemName}</Text>
                  <Text
                    style={[
                      styles.itemUnitPriceText,
                      {marginVertical: 4},
                    ]}>
                    Unit price
                  </Text>
                  <Text style={styles.lightText}>SIZE: {item.size}</Text>
                  <Text style={styles.lightText}>Color: {item.color}</Text>
                  <Text style={[styles.lightText, {marginBottom: 20}]}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={[styles.itemNameText]}>{item.totalPrice}</Text>
                <Text style={[styles.lightText, {marginTop: 4}]}>
                  {item.unitPrice}
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={this.renderSeparator}
        />
                <View style={{backgroundColor: '#f6f6f6', paddingTop: 1}}></View>

        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
          <Text style={[styles.orderIdText, {marginVertical: 19}]}>
            Track: {this.props.trackingNumber}
          </Text>
          <View style={{marginTop: 19}}>
            <Icon size={20} name="right" type="antdesign" />
          </View>
        </TouchableOpacity>
        <View style={{backgroundColor: '#f6f6f6', paddingBottom: 1}}></View>

        <View style={styles.divider}></View>
      </View>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  thumbnailImage: {
    height: 100,
    width: 100,
    borderRadius: 6
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
  divider: {
    height: Height * 0.01,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  orderIdText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
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
  },
});
