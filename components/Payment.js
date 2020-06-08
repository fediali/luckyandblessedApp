import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  InteractionManager,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Shimmer from 'react-native-shimmer';
import { Image as FastImage } from 'react-native';

import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;

class Payment extends Component {
  constructor(props) {
    super(props);
    let deliveryDetails = this.props.route.params.deliveryDetails;
    this.state = {
      isReady: false,
      cardNumber: '5424000000000015',
      expMonth: '12',
      expYear: '2020',
      cardCode: '999',
      email: '',
      dDetails: deliveryDetails,
      shippingDetails:
        deliveryDetails.s_fullname +
        ' ' +
        deliveryDetails.s_streetAddress +
        ' ' +
        deliveryDetails.s_cityTown +
        ' ' +
        deliveryDetails.s_stateText +
        ' ' +
        deliveryDetails.s_zipCode +
        ' ' +
        deliveryDetails.s_phoneNumber,
      billingDetails:
        deliveryDetails.fullname +
        ' ' +
        deliveryDetails.streetAddress +
        ' ' +
        deliveryDetails.cityTown +
        ' ' +
        deliveryDetails.stateText +
        ' ' +
        deliveryDetails.zipCode +
        ' ' +
        deliveryDetails.phoneNumber,
      sameShipping: deliveryDetails.sameShipping,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isReady: true });
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        this.setState({ email: user.email })
      });
    });
  }

  performTransaction = () => {
    RetrieveDataAsync(STORAGE_USER).then((user) => {
      gUser = JSON.parse(user);
      this.postTransaction(gUser);
    });
  }

  postTransaction = (user) => {
    let data = {
      "createTransactionRequest": {
        "merchantAuthentication": {
          "name": "9Lw9PY5KCZkz",
          "transactionKey": "9hG2Em8ZD6y64aCJ"
        },

        "transactionRequest": {
          "transactionType": "authOnlyTransaction",
          "amount": this.props.route.params.finalCost,
          "currencyCode": "USD",
          "payment": {
            "creditCard": {
              "cardNumber": this.state.cardNumber,
              "expirationDate": this.state.expYear + "-" + this.state.expMonth,
              "cardCode": this.state.cardCode
            }
          },
          "lineItems":{
             "lineItem": this.props.route.params.paymentLineItems
            },
  
          "customer": {
            "id": user.user_id,
            "email": user.email
          },
          "billTo": {
            "firstName": this.props.route.params.deliveryDetails.b_firstName,
            "lastName": this.props.route.params.deliveryDetails.b_lastName,
            "company": "n/a",
            "address": this.props.route.params.deliveryDetails.b_address,
            "city": this.props.route.params.deliveryDetails.cityTown,
            "state": this.props.route.params.deliveryDetails.stateText,
            "zip": this.props.route.params.deliveryDetails.zipCode,
            "country": this.props.route.params.deliveryDetails.b_country
          },
          "shipTo": {
            "firstName": this.props.route.params.deliveryDetails.s_firstName,
            "lastName": this.props.route.params.deliveryDetails.s_lastName,
            "company": "n/a",
            "address": this.props.route.params.deliveryDetails.s_address,
            "city": this.props.route.params.deliveryDetails.s_cityTown,
            "state": this.props.route.params.deliveryDetails.stateText,
            "zip": this.props.route.params.deliveryDetails.zipCode,
            "country": this.props.route.params.deliveryDetails.b_country
          },
          "transactionSettings": {
            "setting": {
              "settingName": "emailCustomer",
              "settingValue": true
            }
          },
          "userFields": {
            "userField": [
              {
                "name": "OrderFrom",
                "value": "MobileApp"
              }
            ]
          }
        }
      }
    };

    console.log("DAtAAAAAAAAAAA::: ",JSON.stringify(data))

    let cartOrderItems = [...this.props.route.params.orderItems]
    console.log(this.props.route.params.orderItems)

    // changing orderitems array format to supported ones
    let mproduct={}
    for(let i=0;i<this.props.route.params.orderItems.length;i++){
      let e=this.props.route.params.orderItems[i]
      // console.log("PP",e)
      let mkey=Object.keys(e)[0]
      mproduct[mkey]=e[mkey]
    }
    console.log("PPP",mproduct)

    PostData("https://apitest.authorize.net/xml/v1/request.api", data) //FIXME: How to handle empty values?
      .then((res) => res.text())
      .then((responses) => {
        console.log("RRRRRRRRRRRRR::: ", JSON.parse(JSON.stringify(responses)));
        let transResponse = JSON.parse(JSON.stringify(responses));
        console.log("Keysss", responses.headers)
        console.log("Valuee", transResponse)

        // if (transResponse.transactionResponse.responseCode == 1){
        //   let orderData =  {
        //     user_id:  user.user_id,
        //     shipping_id: "15", //UPS Shipping
        //     payment_id: "34", //Authorize.Net - DEV
        //     payment_info: responses,
        //     products: {mproduct}
        //   }
        //   PostData("http://dev.landbw.co/api/stores/1/orders", orderData)
        //   .then(res => res.json())
        //   .then(response => {
        //     console.log("Order response", response)
        //     if (response.order_id){
        //       this.props.navigation.navigate('ConfirmationSuccess', {orderId: response.orderId})
        //     }
        //   })
        // }
      })
      .catch((ex) => {
        console.log('Promise exception', ex);
        alert(ex);
      });



  }

  render() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (!this.state.isReady) {
      return (
        <View style={styles.shimmerMainView}>
          <Shimmer>
            <FastImage
              style={styles.shimmerImage}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View style={{ marginBottom: 50 }}>
            <View style={styles.subContainer}>
              <View style={styles.paymentAndSecureView}>
                <View>
                  <Text style={styles.paymentText}>Payment</Text>
                  <Text style={styles.secureCheckoutText}>Secure Checkout</Text>
                </View>
              </View>

              <View>

                {this.state.sameShipping ? (
                  <View>
                    <View style={styles.shippingAddressView}>
                      <Text style={styles.heading}>Shipping address:</Text>
                      <Text style={styles.textButton}>Edit</Text>
                    </View>
                    <Text style={styles.monikaWillemsText}>
                      {this.state.shippingDetails}
                    </Text>
                  </View>
                ) : (
                    <View>
                      <View style={styles.shippingAddressView}>
                        <Text style={styles.heading}>Billing address:</Text>
                        <Text style={styles.textButton}>Edit</Text>
                      </View>
                      <Text style={styles.monikaWillemsText}>
                        {this.state.billingDetails}
                      </Text>
                    </View>
                  )}
                <Text style={[styles.heading, styles.deliveryDetailText]}>
                  Billing address:
                </Text>
                <Text>UPS Shipping - shipping will be added later</Text>

                <View style={styles.promoAndCreditCardView}>
                  <Text style={styles.heading}>
                    Shipping charges
                  </Text>
                </View>
                <Text style={styles.smallGreyText}>
                  UPS Shipping - shipping will be added later
                </Text>
                <View style={styles.cardSelectorView}>
                  <TouchableOpacity activeOpacity={0.5}>
                    <View style={styles.cardSelectorTouchView}>
                      <FastImage
                        style={styles.imageDone}
                        source={require('../static/icon_done.png')}
                      />
                      <Text style={styles.paymentSelectorText}>Credit Card</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5}>
                    <View style={styles.cardSelectorTouchView}>
                      <FastImage
                        style={styles.imageDone}
                        source={require('../static/icon_done.png')}
                      />
                      <FastImage
                        style={styles.imagePaypalLogo}
                        source={require('../static/paypalLogo.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5}>
                    <View style={styles.cardSelectorTouchView}>
                      <FastImage
                        style={styles.imageDone}
                        source={require('../static/icon_done.png')}
                      />
                      <Text style={styles.paymentSelectorText}>COD</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.promoAndCreditCardView}>
                  <Text style={styles.heading}>Credit card</Text>
                  <Text style={styles.textButton}>Clear All</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.cardHolderTextInput]}
                  placeholder="Card holder name"
                />
                <TextInput
                  style={[styles.textInput, styles.cardNumTextInput]}
                  placeholder="Card number"
                  onChangeText={(text) => { this.setState({ cardNumber: text }) }}
                />
                <View style={styles.cardInfoView}>
                  <TextInput
                    style={[styles.textInput, styles.dateTextInput]}
                    placeholder="mm"
                    onChangeText={(text) => { this.setState({ expMonth: text }) }}

                  />
                  <TextInput
                    style={[styles.textInput, styles.dateTextInput]}
                    placeholder="yyyy"
                    onChangeText={(text) => { this.setState({ expYear: text }) }}

                  />
                  <TextInput
                    style={[styles.textInput, styles.cvvTextInput]}
                    placeholder="CVV"
                    onChangeText={(text) => { this.setState({ cardCode: text }) }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.commentView}>
              <TextInput
                style={[styles.textInput, styles.commentTextInput]}
                multiline={true}
                numberOfLines={4}
                placeholder="You can leave us a comment here"
              />
            </View>
            <View style={styles.orderView}>
              <View style={styles.orderRowView}>
                <Text style={styles.heading}>Order Amount</Text>
                <Text style={styles.heading}>$103.88</Text>
              </View>
              <View style={styles.orderRowView}>
                <Text style={styles.smallGreyText}>
                  Gift card/Promo applied:
                </Text>
                <Text style={styles.smallGreyText}>-$55.02</Text>
              </View>
              <TouchableOpacity
                style={styles.orderTouch}
                onPress={()=>{this.performTransaction()}}
              >
                <Text style={styles.orderTouchText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Footer navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  textButton: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2967ff',
  },
  textInput: {
    backgroundColor: '#f6f6f6',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  divider: {
    height: 0.009 * height,
    width: width,
    backgroundColor: '#f6f6f6',
  },
  smallGreyText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
  },
  shimmerMainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerImage: {
    height: 200,
    width: 200,
  },
  paymentAndSecureView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paymentText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    lineHeight: 36,
    color: '#2d2d2f',
  },
  secureCheckoutText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
  },
  cardSelectorView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  cardSelectorTouchView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageDone: {
    height: 18,
    width: 18,
    marginRight: 5,
  },
  imageVisaLogo: {
    height: 24,
    width: 149,
  },
  imagePaypalLogo: {
    height: 21,
    width: 89,
  },
  deliveryDetailText: {
    marginTop: 29,
    marginBottom: 18,
  },
  shippingAddressView: {
    marginTop: 29,
    marginBottom: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monikaWillemsText: {
    width: width * 0.6,
  },
  promoAndCreditCardView: {
    marginTop: 36,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolderTextInput: {
    borderRadius: 6,
  },
  cardNumTextInput: {
    marginTop: 20,
    borderRadius: 6,
  },
  cardInfoView: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 25,
  },
  dateTextInput: {
    marginRight: 13,
    flex: 1,
    borderRadius: 6,
  },
  cvvTextInput: {
    flex: 1,
    borderRadius: 6,
  },
  commentView: {
    paddingHorizontal: 20,
  },
  commentTextInput: {
    marginTop: 13,
    marginBottom: 15,
    borderRadius: 6,
  },
  orderView: {
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  orderRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderTouch: {
    backgroundColor: '#2967ff',
    alignItems: 'center',
    borderRadius: 6,
  },
  orderTouchText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#fff',
    paddingVertical: 11,
  },
  paymentSelectorText: {
    fontFamily: "Avenir-Heavy",
    fontSize: 14,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000000"
  }
});

export default Payment;
