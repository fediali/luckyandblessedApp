import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

export default class ordersProduct extends Component {
  render() {
    return (
      <View>
        <FlatList
          keyExtractor={(item) => item.itemNum.toString()}
          data={this.state.itemList}
          numColumns={1}
          renderItem={({item}) => (
            <View style={[innerStyles.itemView]}>
              <View style={{flexDirection: 'column', padding: 15}}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={[innerStyles.itemImage]}
                    resizeMode="contain"
                    source={require('../static/item_cart1.png')}
                  />
                  <View
                    style={{flex: 1, flexDirection: 'column', marginLeft: 10}}>
                    <View style={{flexDirection: 'row', paddingBottom: 4}}>
                      <Text
                        style={[
                          innerStyles.itemNameText,
                          {textAlign: 'left', flex: 2},
                        ]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          innerStyles.itemNameText,
                          {textAlign: 'right', flex: 1},
                        ]}>
                        ${item.price}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingBottom: 4}}>
                      <Text
                        style={[
                          innerStyles.itemUnitPriceText,
                          {textAlign: 'left', flex: 2},
                        ]}>
                        Unit price
                      </Text>
                      <Text
                        style={[
                          innerStyles.lightText,
                          {textAlign: 'right', flex: 1},
                        ]}>
                        ${item.unitPrice}
                      </Text>
                    </View>
                    <Text style={innerStyles.lightText}>
                      SIZE: {item.sizes}
                    </Text>
                    <Text style={innerStyles.lightText}>
                      Color: {item.color}
                    </Text>
                    <Text style={innerStyles.lightText}>
                      Quantity: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  thumbnailImage: {
    height: 100,
    width: 100,
  },
  mainTextBold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
    marginTop: 10,
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
  itemView: {
    // flex:1
  },
  itemImage: {
    width: Width * 0.2,
    height: Height * 0.15,
  },
  rowStyling: {
    backgroundColor: '#ffffff',
    shadowColor: '#e6e6e7',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
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
  horizontalView: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  bottomSelectors: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  numText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
    textAlign: 'left',
    marginStart: 15,
  },
});
