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
  ActivityIndicator,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Shimmer from 'react-native-shimmer';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-simple-toast';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import OrderFooter from '../reusableComponents/OrderFooter';
import GetData from '../reusableComponents/API/GetData';
import PostData from '../reusableComponents/API/PostData';
import { WebView } from 'react-native-webview';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;
const CODPAYMENTID = 17;
const CREDITCARTPAYMENTID = 38;
const PAYPALPAYMENTID = 20;
const UPSSHIPPING = 15;
const MERCHANTAUTH_NAME = Globals.MERCHANTAUTH_NAME;
const MERCHANTAUTH_TRANSACTIONID = Globals.MERCHANTAUTH_TRANSACTIONID;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

let deliveryDetails = null;
let gUser = null;

class Payment extends Component {
  constructor(props) {
    super(props);
    //PaymentMode => 1 = CreditCard, 2 = paypal, 3 = COD
    this.state = {
      isReady: false,
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cardCode: '',
      profile_id: this.props.route.params.profile_id,
      paymentMode: 1,
      paypalLink: null,
      paypalId: null,
      showCircleLoader: false,
      //Error related states
      cardNumberError: '',
      expMonthError: '',
      expYearError: '',
      cardCodeError: '',
    };
  }

  isValid() {
    let validFlag = true;

    if (this.state.cardNumber == '') {
      this.setState({ cardNumberError: 'Card number is required.' });
      validFlag = false;
    } else {
      this.setState({ cardNumberError: '' });
    }

    if (this.state.expMonth == '') {
      this.setState({ expMonthError: 'Expiry month is required.' });
      validFlag = false;
    } else {
      this.setState({ expMonthError: '' });
    }

    if (this.state.expYear == '') {
      this.setState({ expYearError: 'Expiry year is required.' });
      validFlag = false;
    } else {
      this.setState({ expYearError: '' });
    }

    if (this.state.cardCode == '') {
      this.setState({ cardCodeError: 'CVV code is required.' });
      validFlag = false;
    } else {
      this.setState({ cardCodeError: '' });
    }

    return validFlag;
  }
  showErrorMessage(errorMessage) {
    return (
      <View style={styles.errorTextMainView}>
        <Icon
          size={30}
          name="md-information-circle-outline"
          type="ionicon"
          color="#FF0000"
        />
        <Text style={styles.errorTextText}>{errorMessage}</Text>
      </View>
    );
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        user = JSON.parse(user);
        this.setState({ email: user.email });

        GetData(
          baseUrl +
          `api/userprofilesnew/${user.user_id}&profile_id=${this.state.profile_id}`,
        ) //TODO: Get user details
          .then((res) => res.json())
          .then((response) => {
            deliveryDetails = response[0];
            this.setState({
              isReady: true,
              dDetails: deliveryDetails,
              shippingDetails:
                deliveryDetails.s_firstname +
                ' ' +
                deliveryDetails.s_lastname +
                ', ' +
                deliveryDetails.s_address +
                ' ' +
                deliveryDetails.s_address_2 +
                ', ' +
                deliveryDetails.s_city +
                ', ' +
                deliveryDetails.s_state +
                ' ' +
                deliveryDetails.s_zipcode +
                ', ' +
                deliveryDetails.s_country,
              billingDetails:
                deliveryDetails.b_firstname +
                ' ' +
                deliveryDetails.b_lastname +
                ', ' +
                deliveryDetails.b_address +
                ' ' +
                deliveryDetails.b_address_2 +
                ', ' +
                deliveryDetails.b_city +
                ', ' +
                deliveryDetails.b_state +
                ' ' +
                deliveryDetails.b_zipcode +
                ', ' +
                deliveryDetails.b_country,
              sameShipping: deliveryDetails.is_same_shipping,
            });
          });
      });
    });
  }

  performTransaction = () => {
    RetrieveDataAsync(STORAGE_USER).then((user) => {
      gUser = JSON.parse(user);

      //Handle Credit Cart payment
      if (this.state.paymentMode == 1) {
        if (this.isValid()) {
          // this.postAuthorizeNetTransaction(gUser);
          this.postNmiTransaction(gUser)
        }
      }
      //PayPal
      else if (this.state.paymentMode == 2) this.handlePayPalTransaction(gUser);
      else if (this.state.paymentMode == 3) {
        let transData = {
          type: 'AUTH_ONLY',
          location: 'MobileApp',
        };
        this.placeOrder(gUser, CODPAYMENTID, this.modifyProductJson(), transData); //Directly place order.
      }
    });
  };

  postNmiTransaction = (gUser) => {
    this.setState({showCircleLoader: true})
    let nmiUrl = `https://secure.networkmerchants.com/api/transact.php?username=${Globals.NMILogin}&password=${Globals.NMIPass}&type=auth&zipcode=75234&ccnumber=${this.state.cardNumber}&ccexp=${this.state.expMonth}${this.state.expYear}&cvv=${this.state.cardCode}&amount=${this.props.route.params.finalCost}`

    PostData(nmiUrl)
      .then((res) => res.text())
      .then((response) => {
        var resText = response.split("&")
        var status = resText[1].substring(resText[1].indexOf("=") + 1)
        var transId = resText[3].substring(resText[1].indexOf("=") + 1)

        console.log(response.charAt(9))
        if (response.charAt(9) == 1) {
          Toast.show("Authorization successful. Please wait")
          let transData = {
            type: 'AUTH_ONLY',
            transaction_id: transId,
            location: 'MobileApp',
          };
          // changing orderitems array format to supported ones
          let mproduct = this.modifyProductJson();
          this.placeOrder(gUser, CREDITCARTPAYMENTID, mproduct, transData);
        }
        else {
          Toast.show(status)
        }
      })

  }

  getPaypalAuth = () => {
    var details = {
      grant_type: 'client_credentials',
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    let req = new Request('https://api.paypal.com/v1/oauth2/token', {
      headers: {
        Authorization: Globals.PAYPAL_AUTH_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      method: 'POST',
      body: formBody,
    });

    return fetch(req);
  };

  handlePayPalTransaction = (user) => {
    this.setState({ showCircleLoader: true });
    let paymentItems = [];
    //mapping lineItems(from params) onto below payment items object
    let item = this.props.route.params.paymentLineItems;
    for (let i = 0; i < item.length; i++) {
      let singleItem = {
        name: item[i].name,
        unit_amount: {
          currency_code: 'USD',
          value: item[i].unitPrice,
        },
        quantity: item[i].quantity,
        category: 'PHYSICAL_GOODS',
      };
      paymentItems.push(singleItem);
    }

    let data = {
      intent: 'AUTHORIZE',
      payer: {
        name: {
          given_name: user.name,
        },
        email_address: user.email,
        address: {
          address_line_1: this.props.route.params.b_userAddress_1,
          address_line_2: this.props.route.params.b_userAddress_2,
          postal_code: this.props.route.params.b_zipCode,
          country_code: this.props.route.params.b_country,
        },
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.props.route.params.finalCost,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.props.route.params.totalCost,
              },
              discount: {
                currency_code: 'USD',
                value: this.props.route.params.discount,
              },
            },
          },
          payee: {
            email_address: user.email,
          },
          items: paymentItems,
        },
      ],
      application_context: {
        brand_name: 'Lucky and Blessed',
        user_action: 'PAY_NOW',
        return_url: 'http://dev.landbw.co/mobile_app/paypal_succes.html',
        cancel_url: 'http://dev.landbw.co/mobile_app/paypal_cancel.html',
      },
    };


    this.getPaypalAuth()
      .then((res) => res.json())
      .then((response) => {
        console.log("token", response)
        PostData(
          'https://api.paypal.com/v2/checkout/orders',
          data,
          response.access_token,
        ) //To create Order
          .then((res) => res.json())
          .then((response) => {
            console.log(response)
            this.setState({ paypalId:response.id, paypalLink: response.links[1].href });
          })
          .catch((e) => {
            Toast.show(e.toString());
            console.log('Exception 1', e);
          });
      })
      .catch((e) => {
        Toast.show(e.toString());
        console.log('Exception', e);
      });
  };

  placeOrder = (user, payment_id, mproduct, transResponse = []) => {
    let orderData = {
      user_id: user.user_id,
      shipping_id: UPSSHIPPING, //UPS Shipping
      payment_id,
      payment_info: transResponse,
      products: mproduct,
      status: "O"
    };
    PostData(baseUrl + 'api/stores/1/orders', orderData)
      .then((res) => res.json())
      .then((response) => {
        if (response.order_id) {
          this.hideSpinner()
          this.props.navigation.navigate('ConfirmationSuccess', {
            orderId: response.order_id,
          });
        } else {
          // console.log(orderData)
          console.log(response)
          this.hideSpinner()

          Toast.show('Something went wrong');
        }
      });
  };

  modifyProductJson = () => {
    let mproduct = {};

    for (let i = 0; i < this.props.route.params.orderItems.length; i++) {
      let e = this.props.route.params.orderItems[i];
      let mkey = Object.keys(e)[0];
      mproduct[mkey] = e[mkey];
    }

    return mproduct;
  };

  postAuthorizeNetTransaction = (user) => {
    let paymentItems = this.props.route.params.paymentLineItems;
    //Max length allowed for product name is 31 characters
    paymentItems.map((item) => {
      if (item.name.length > 31) {
        item.name = item.name.substring(0, 31);
      }
    });
    let data = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: MERCHANTAUTH_NAME,
          transactionKey: MERCHANTAUTH_TRANSACTIONID,
        },

        transactionRequest: {
          transactionType: 'authOnlyTransaction',
          amount: this.props.route.params.finalCost,
          currencyCode: 'USD',
          payment: {
            creditCard: {
              cardNumber: this.state.cardNumber,
              expirationDate: this.state.expYear + '-' + this.state.expMonth,
              cardCode: this.state.cardCode,
            },
          },
          lineItems: {
            lineItem: paymentItems,
          },

          customer: {
            id: user.user_id,
            email: user.email,
          },
          billTo: {
            firstName: deliveryDetails.b_firstname,
            lastName: deliveryDetails.b_lastname,
            address: deliveryDetails.b_address,
            city: deliveryDetails.b_city,
            state: deliveryDetails.b_state,
            zip: deliveryDetails.b_zipcode,
            country: deliveryDetails.b_country,
          },
          shipTo: {
            firstName: deliveryDetails.s_firstname,
            lastName: deliveryDetails.s_lastname,
            address: deliveryDetails.s_address,
            city: deliveryDetails.s_city,
            state: deliveryDetails.s_state,
            zip: deliveryDetails.s_zipCode,
            country: deliveryDetails.s_country,
          },
          transactionSettings: {
            setting: {
              settingName: 'emailCustomer',
              settingValue: false, //TODO: Confirm
            },
          },
          userFields: {
            userField: [
              {
                name: 'OrderFrom',
                value: 'MobileApp',
              },
            ],
          },
        },
      },
    };

    // changing orderitems array format to supported ones
    let mproduct = this.modifyProductJson();

    PostData('https://api.authorize.net/xml/v1/request.api', data)
      .then((res) => res.text())
      .then((responses) => {
        let transResponse = JSON.parse(responses.trim());
        console.log(JSON.stringify(transResponse))
        if (transResponse.transactionResponse.responseCode == 1) {
          let transData = {
            type: 'AUTH_ONLY',
            transaction_id: transResponse.transactionResponse.transId,
            location: 'MobileApp',
          };
          this.placeOrder(user, CREDITCARTPAYMENTID, mproduct, transData);
        } else {
          Toast.show(
            transResponse.transactionResponse.errors[0].errorText.toString(),
          );
        }
      })
      .catch((ex) => {
        console.log('Promise exception', ex);
        Toast.show(ex.toString());
      });
  };

  navigateToDeliveryScreen = () => {
    this.props.navigation.navigate('Delivery', {
      //sending props to delivery screen to reuse values
      totalCost: this.props.route.params.totalCost,
      finalCost: this.props.route.params.finalCost,
      discount: this.props.route.params.discount,
      paymentLineItems: this.props.route.params.paymentLineItems,
      orderItems: this.props.route.params.orderItems,
    });
  };

  changePaymentMode = (paymentMode) => () => {
    this.setState({ paymentMode });
  };
  handleWebViewResponse = (data) => {
    if (data.title == 'Success') {
      let transData = {
        type: 'AUTH_ONLY',
        transaction_id: this.state.paypalId,
        location: 'MobileApp',
      };
      this.setState({ paypalLink: null }, () => {
        this.placeOrder(gUser, PAYPALPAYMENTID, this.modifyProductJson(), transData);
      });
    } else if (data.title == 'Cancel') {
      {
        this.setState({ paypalLink: null });
        Toast.show('Your payment was not Sucessful');
      }
    }
  };
  hideSpinner = () => {
    this.setState({
      showCircleLoader: false,
    });
  };
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

        {this.state.paypalLink != null ? (
          <View style={{ flex: 1, backgroundColor: '#00f' }}>
            <WebView
              style={{ flex: 1 }}
              source={{ uri: this.state.paypalLink }}
              onNavigationStateChange={(data) =>
                this.handleWebViewResponse(data)
              }
              onLoadStart={this.hideSpinner}
            />
            {this.state.showCircleLoader && (
              <ActivityIndicator
                style={{ position: 'absolute', top: height / 3, left: width / 2 }}
                size="large"
              />
            )}
          </View>
        ) : (
            <>
              {this.state.showCircleLoader && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: height / 3 - 30,
                    left: width / 2,
                  }}
                  size="large"
                />
              )}
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
                        <Text style={styles.secureCheckoutText}>
                          Secure Checkout
                      </Text>
                      </View>
                    </View>

                    <View>
                      {this.state.sameShipping == 'Y' ? (
                        <View>
                          <View style={styles.shippingAddressView}>
                            <Text style={styles.heading}>Shipping address:</Text>
                            <TouchableOpacity
                              onPress={this.navigateToDeliveryScreen}>
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
                                <Text style={styles.heading}>
                                  Shipping address:
                            </Text>
                                <TouchableOpacity
                                  onPress={this.navigateToDeliveryScreen}>
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
                        <Text style={styles.heading}>Shipping charges</Text>
                      </View>
                      <Text style={styles.smallGreyText}>
                        UPS Shipping - shipping will be added later
                    </Text>
                      <View style={styles.cardSelectorView}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={this.changePaymentMode(1)}>
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
                            <Text style={styles.paymentSelectorText}>
                              Credit Card
                          </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={this.changePaymentMode(2)}>
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
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={this.changePaymentMode(3)}>
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
                            placeholderTextColor={TEXTINPUT_COLOR}
                            textContentType="name"
                            style={[styles.textInput, styles.cardHolderTextInput]}
                            placeholder="Card holder name"
                          />
                          <TextInput
                            placeholderTextColor={TEXTINPUT_COLOR}
                            textContentType="creditCardNumber"
                            style={[styles.textInput, styles.cardNumTextInput]}
                            keyboardType={'phone-pad'}
                            placeholder="Card number"
                            onChangeText={(text) => {
                              this.setState({ cardNumber: text });
                            }}
                          />
                          {this.state.cardNumberError != '' ? (
                            this.showErrorMessage(this.state.cardNumberError)
                          ) : (
                              <View></View>
                            )}

                          <View style={styles.cardInfoView}>
                            <TextInput
                              placeholderTextColor={TEXTINPUT_COLOR}
                              style={[styles.textInput, styles.dateTextInput]}
                              placeholder="mm"
                              keyboardType={'phone-pad'}
                              onChangeText={(text) => {
                                this.setState({ expMonth: text });
                              }}
                            />
                            <TextInput
                              placeholderTextColor={TEXTINPUT_COLOR}
                              style={[styles.textInput, styles.dateTextInput]}
                              placeholder="yy"
                              keyboardType={'number-pad'}
                              onChangeText={(text) => {
                                this.setState({ expYear: text });
                              }}
                            />
                            <TextInput
                              placeholderTextColor={TEXTINPUT_COLOR}
                              style={[styles.textInput, styles.cvvTextInput]}
                              placeholder="CVV"
                              keyboardType={'number-pad'}
                              onChangeText={(text) => {
                                this.setState({ cardCode: text });
                              }}
                            />
                          </View>
                          {this.state.expMonthError != '' ? (
                            this.showErrorMessage(this.state.expMonthError)
                          ) : (
                              <View></View>
                            )}
                          {this.state.expYearError != '' ? (
                            this.showErrorMessage(this.state.expYearError)
                          ) : (
                              <View></View>
                            )}
                          {this.state.cardCodeError != '' ? (
                            this.showErrorMessage(this.state.cardCodeError)
                          ) : (
                              <View></View>
                            )}

                          {/* <View style={styles.divider}></View> */}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.commentView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      style={[styles.textInput, styles.commentTextInput]}
                      multiline={true}
                      numberOfLines={4}
                      placeholder="You can leave us a comment here"
                    />
                  </View>
                  <OrderFooter
                    totalCost={this.props.route.params.totalCost}
                    finalCost={this.props.route.params.finalCost}
                    discount={this.props.route.params.discount}
                  />
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
            </>
          )}
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
    textTransform:'uppercase',
  },
  textButton: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#1bbfc7',
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
    alignItems: 'center',
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
    width: '100%',
    justifyContent:'center',
    alignItems:'center',
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
    width: '60%',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    lineHeight: 36,
    color: '#2d2d2f',
    textTransform:'uppercase',
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
    marginStart: 5,
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
    color:'grey',
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
    backgroundColor: '#1bbfc7',
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
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
    marginLeft: 5,
  },
  errorTextMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  errorTextText: { paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%' },
});

export default Payment;
