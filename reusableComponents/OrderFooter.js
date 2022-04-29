import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../components/Styles/Style';

export default class OrderFooter extends PureComponent {

  render() {
    return (
      <View>
        <View style={innerStyles.showOrderView}>
          <View style={innerStyles.orderRowView}>
            <Text style={[styles.buttonText, innerStyles.orderAmountText]}>
              Order amount:{' '}
            </Text>
            <Text style={[styles.buttonText, innerStyles.orderAmountValueText]}>
              ${this.props.totalCost}
            </Text>
          </View>
          <View style={innerStyles.orderRowView}>
            <Text style={[styles.buttonText, innerStyles.orderAmountText]}>
              {this.props.couponCode?this.props.couponCode: "Gift Card / Promo applied: "}
            </Text>
            <Text
              style={[innerStyles.lightText, innerStyles.orderAmountValueText]}>
              ${this.props.discount}
            </Text>
          </View>
          <View style={innerStyles.orderRowView}>
            <Text style={[styles.buttonText, innerStyles.orderAmountText]}>
              Shipping:{' '}
            </Text>
            <Text style={[innerStyles.shippingText]}>
            {/* HARD CODED TEXT */}
              {"Shipping will be added later"} 
            </Text>
          </View>
          <View style={innerStyles.orderRowView}>
            <Text style={[styles.buttonText, innerStyles.orderAmountText]}>
              Order Total:{' '}
            </Text>
            <Text style={[styles.buttonText, innerStyles.orderAmountValueText]}>
              ${this.props.finalCost}
            </Text>
          </View>
        </View>

      </View>
    );
  }
}

const innerStyles = StyleSheet.create({
  showOrderView: {
    paddingTop: 15,
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  orderRowView: {
    flexDirection: 'row', paddingHorizontal: 20, justifyContent: "space-between"
  },
  orderAmountText: {
    fontSize: 18, lineHeight: 30
  },
  orderAmountValueText: {
    flex: 1, fontSize: 18, lineHeight: 30, textAlign: 'right'
  },
  shippingText: { fontFamily: "Avenir-Medium", fontSize: 16 },
  orderGiftText: {
    lineHeight: 30
  },
  lightText: {
    fontFamily: "Avenir-Book",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
  },
  orderButtonView: {
    paddingHorizontal: 30, width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22
  },
  buttonPaymentMethod: {
    width: '100%',
    backgroundColor: '#1bbfc7',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },

})

