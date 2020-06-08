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
import { Icon } from 'react-native-elements';
import { Image as FastImage } from 'react-native';
import Toast from 'react-native-simple-toast';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import OrderFooter from '../reusableComponents/OrderFooter';
import GetData from '../reusableComponents/API/GetData';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;
let deliveryDetails = null;
class Payment extends Component {
  constructor(props) {
    super(props);
    //PaymentMode => 1 = CreditCard, 2 = paypal, 3 = COD
    this.state = {
      isReady: false,
      cardNumber: '5424000000000015',
      expMonth: '12',
      expYear: '2020',
      cardCode: '999',     
      profile_id: this.props.route.params.profile_id,
      paymentMode: 1,   
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        user = JSON.parse(user);
        this.setState({ email: user.email })

        GetData(baseUrl + `api/userprofilesnew/${user.user_id}&profile_id=${this.state.profile_id}`) //TODO: Get user details
        .then(res => res.json())
        .then(response => {
          console.log(response[0])
          deliveryDetails = response[0];
          this.setState({ 
            isReady: true,
            dDetails: deliveryDetails,
            shippingDetails:
              deliveryDetails.s_firstname + ' ' + deliveryDetails.s_lastname +
              ', ' +
              deliveryDetails.s_address + ' ' + deliveryDetails.s_address_2 + 
              ', ' +
              deliveryDetails.s_city +
              ', ' +
              deliveryDetails.s_state +
              ' ' +
              deliveryDetails.s_zipcode +  ', ' + deliveryDetails.s_country,
            billingDetails:
              deliveryDetails.b_firstname + ' ' + deliveryDetails.b_lastname +
              ', ' +
              deliveryDetails.b_address + ' ' + deliveryDetails.b_address_2 + 
              ', ' +
              deliveryDetails.b_city +
              ', ' +
              deliveryDetails.b_state +
              ' ' +
              deliveryDetails.b_zipcode +  ', ' + deliveryDetails.b_country,
            sameShipping: deliveryDetails.is_same_shipping,
           });
        })
      });
    });
  }

  performTransaction = () => {
    RetrieveDataAsync(STORAGE_USER).then((user) => {
      let gUser = JSON.parse(user);
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
            "firstName": deliveryDetails.b_firstname,
            "lastName": deliveryDetails.b_lastname,
            "address": deliveryDetails.b_address,
            "city": deliveryDetails.b_city,
            "state": deliveryDetails.b_state,
            "zip": deliveryDetails.b_zipcode,
            "country": deliveryDetails.b_country
          },
          "shipTo": {
            "firstName": deliveryDetails.s_firstname,
            "lastName": deliveryDetails.s_lastname,
            "address": deliveryDetails.s_address,
            "city": deliveryDetails.s_city,
            "state": deliveryDetails.s_state,
            "zip": deliveryDetails.s_zipCode,
            "country": deliveryDetails.s_country
          },
          "transactionSettings": {
            "setting": {
              "settingName": "emailCustomer",
              "settingValue": false //TODO: Confirm
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


    console.log(data)
    // changing orderitems array format to supported ones
    let mproduct={}
    for(let i=0;i<this.props.route.params.orderItems.length;i++){
      let e=this.props.route.params.orderItems[i]
      let mkey=Object.keys(e)[0]
      mproduct[mkey]=e[mkey]
    }

    PostData("https://apitest.authorize.net/xml/v1/request.api", data) 
      .then((res) => res.text())
      .then((responses) => {
        let transResponse = JSON.parse((responses.trim()));
        

        if (transResponse.transactionResponse.responseCode == 1){
          let payment_id = null; //Authorize.Net - DEV
          if (this.state.paymentMode == 1) payment_id = 34
          else  if (this.state.paymentMode == 2) payment_id = 20 //PayPal
          else  if (this.state.paymentMode == 2) payment_id = 17 //C.O.D

          let orderData =  {
            user_id:  user.user_id,
            shipping_id: "15", //UPS Shipping
            payment_id, 
            payment_info: transResponse,
            products: mproduct
          }
          PostData("http://dev.landbw.co/api/stores/1/orders", orderData)
          .then(res => res.json())
          .then(response => {
            if (response.order_id){
              this.props.navigation.navigate('ConfirmationSuccess', {orderId: response.order_id})
            }
            else {
              Toast.show("Something went wrong")
            }
          })
        }
        else {
          Toast.show(transResponse.transactionResponse.errors[0].errorText)

        }
      })
      .catch((ex) => {
        console.log('Promise exception', ex);
        alert(ex);
      });



  }

  navigateToDeliveryScreen = () => {
    this.props.navigation.navigate(
      "Delivery",
      {//sending props to delivery screen to reuse values
          totalCost: this.props.route.params.totalCost,
          finalCost: this.props.route.params.finalCost,
          discount: this.props.route.params.discount,
          paymentLineItems: this.state.paymentLineItems,
          orderItems: this.state.orderItems,
      })
  }

  changePaymentMode = (paymentMode) => () => {
    console.log(paymentMode)
    this.setState({paymentMode})
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

                {this.state.sameShipping == 'Y' ? (
                  <View>
                    <View style={styles.shippingAddressView}>
                      <Text style={styles.heading}>Shipping address:</Text>
                      <TouchableOpacity onPress={this.navigateToDeliveryScreen} >
                        <Text style={styles.textButton}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.monikaWillemsText}>
                      {this.state.shippingDetails}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <View>
                    <View style={styles.shippingAddressView}>
                      <Text style={styles.heading}>Shipping address:</Text>
                      <TouchableOpacity onPress={this.navigateToDeliveryScreen} >
                        <Text style={styles.textButton}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.monikaWillemsText}>
                      {this.state.shippingDetails}
                    </Text>
                  </View>
                    <View>
                      <View style={styles.shippingAddressView}>
                        <Text style={styles.heading}>Billing address:</Text>
                      </View>
                      <Text style={styles.monikaWillemsText}>
                        {this.state.billingDetails}
                      </Text>
                    </View>
                  </View>
                  
                  )}
               
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
                  <TouchableOpacity activeOpacity={0.5} onPress={this.changePaymentMode(1)}>
                    <View style={styles.cardSelectorTouchView}>
                     {this.state.paymentMode == 1 ? (
                       <Icon
                       size={20}
                       name="checkcircle"
                       type="antdesign"
                       color="#5dd136"
                     />
                      ) : (
                        <Icon
                          size={20}
                          name="checkcircle"
                          type="antdesign"
                          color="#f6f6f6"
                        />
                      )}
                      <Text style={styles.paymentSelectorText}>Credit Card</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={this.changePaymentMode(2)}>
                    <View style={styles.cardSelectorTouchView}>
                    {this.state.paymentMode == 2 ? (
                       <Icon
                       size={20}
                       name="checkcircle"
                       type="antdesign"
                       color="#5dd136"
                     />
                      ) : (
                        <Icon
                          size={20}
                          name="checkcircle"
                          type="antdesign"
                          color="#f6f6f6"
                        />
                      )}
                      <FastImage
                        style={styles.imagePaypalLogo}
                        source={require('../static/paypalLogo.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={this.changePaymentMode(3)}>
                    <View style={styles.cardSelectorTouchView}>
                    {this.state.paymentMode == 3 ? (
                       <Icon
                       size={20}
                       name="checkcircle"
                       type="antdesign"
                       color="#5dd136"
                     />
                      ) : (
                        <Icon
                          size={20}
                          name="checkcircle"
                          type="antdesign"
                          color="#f6f6f6"
                        />
                      )}
                      <Text style={styles.paymentSelectorText}>COD</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.paymentMode == 1 && (
                  <View>
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
                {/* <View style={styles.divider}></View> */}

                  </View>
                )}
                
              </View>
            </View>
            <View style={styles.commentView}>
              <TextInput
                style={[styles.textInput, styles.commentTextInput]}
                multiline={true}
                numberOfLines={4}
                placeholder="You can leave us a comment here"
              />
            </View>
            <OrderFooter totalCost={this.props.route.params.totalCost} finalCost={this.props.route.params.finalCost} discount={this.props.route.params.discount}  />
            <View style={[styles.buttonContainer, styles.orderButtonView]}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.buttonPaymentMethod]}
                onPress={() => {
                  this.performTransaction();
                }}>
                <Text style={[styles.buttonText, styles.orderButtonText]}>
                  Place Order
                </Text>
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
    width,
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
  orderButtonView: {
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20,
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%'
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
  buttonPaymentMethod: {
    width: '100%',
    backgroundColor: '#2967ff',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
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
    marginStart: 5
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
      width: '100%',
      backgroundColor: '#2967ff',
      borderRadius: 6,
      paddingVertical: 15,
      paddingHorizontal: 30,
      marginTop: 15,
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
    fontSize: 16,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000000",
    marginLeft: 5
  }
});

export default Payment;
