import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  InteractionManager,
} from 'react-native';

import {Icon} from 'react-native-elements';
import styles from './Styles/Style';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {TextInput} from 'react-native-gesture-handler';
import Shimmer from 'react-native-shimmer';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import ModalDropdown from 'react-native-modal-dropdown';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import OrderFooter from '../reusableComponents/OrderFooter';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;
const usStates = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];
let gUser;
var radio_props = [
  {label: 'Yes', value: true},
  {label: 'No', value: false},
];
class Delivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      isReady: false,
      newUser: true,
      sameShipping: true,
      fullName: '',
      fullNameError: '',
      streetAddress: '',
      streetAddressError: '',
      cityTown: '',
      cityTownError: '',
      stateText: '',
      stateTextError: '',
      zipCode: '',
      zipCodeError: '',
      email: '',
      emailError: '',
      phoneNumber: '',
      phoneNumberError: '',
      selectedProfile: 'Main',
      s_fullName: '',
      s_fullNameError: '',
      s_streetAddress: '',
      s_streetAddressError: '',
      s_cityTown: '',
      s_cityTownError: '',
      s_stateText: '',
      s_stateTextError: '',
      s_zipCode: '',
      s_zipCodeError: '',
      s_email: '',
      s_emailError: '',
      s_phoneNumber: '',
      s_phoneNumberError: '',
    };
  }

  componentDidMount() {
   
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: false});
      // Retriving the user_id
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        gUser = JSON.parse(user);
        this.getData(gUser);
      });
    });
  }

  getData = (user, profile_id = null) => {
    var promises = [];
    if (profile_id) {
      promises.push(
        GetData(
          baseUrl +
            `api/userprofilesnew/${user.user_id}&profile_id=${profile_id}`,
        ),
      );
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              let main_profile = responses[0][0];
              let sameShipping = false;
              let newUser = true;
              if (
                main_profile.b_address ||
                main_profile.b_address_2 ||
                main_profile.s_address ||
                main_profile.s_address_2
              ) {
                newUser = false;
              }
              if (
                main_profile.b_address == main_profile.s_address &&
                main_profile.b_address_2 == main_profile.s_address_2
              )
                sameShipping = true;
              this.setState({
                isReady: true,
                newUser: false,
                sameShipping: sameShipping,
                fullName:
                  main_profile.b_firstname + ' ' + main_profile.b_lastname,
                streetAddress:
                  main_profile.b_address + ' ' + main_profile.s_address_2,
                cityTown: main_profile.b_city,
                stateText: main_profile.b_state,
                zipCode: main_profile.b_zipcode,
                email: 'demo@gmail.com',
                phoneNumber: main_profile.b_phone,
                s_fullName:
                  main_profile.s_firstname + ' ' + main_profile.s_lastname,
                s_streetAddress:
                  main_profile.s_address + ' ' + main_profile.s_address_2,
                s_cityTown: main_profile.s_city,
                s_stateText: main_profile.s_state,
                s_zipCode: main_profile.s_zipcode,
                s_email: 'demo@gmail.com', //TODO: Check for email
                s_phoneNumber: main_profile.s_phone,
              });
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          alert(ex);
        });
    }

    //TODO: change user id to
    else {
      promises.push(GetData(baseUrl + `api/userprofilesnew/${user.user_id}`));
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              let main_profile = responses[0].main_profile[0];
              let sameShipping = false;
              let newUser = true;
              if (
                main_profile.b_address ||
                main_profile.b_address_2 ||
                main_profile.s_address ||
                main_profile.s_address_2
              ) {
                newUser = false;
              }
              if (
                main_profile.b_address == main_profile.s_address &&
                main_profile.b_address_2 == main_profile.s_address_2
              )
                sameShipping = true;
              this.setState({
                profiles: responses[0].profiles,
                isReady: true,
                newUser: newUser,
                sameShipping: sameShipping,
                fullName:
                  main_profile.b_firstname + ' ' + main_profile.b_lastname,
                streetAddress:
                  main_profile.b_address + ' ' + main_profile.b_address_2,
                cityTown: main_profile.b_city,
                stateText: main_profile.b_state,
                zipCode: main_profile.b_zipcode,
                email: 'demo@gmail.com', //TODO: Check for email
                phoneNumber: main_profile.b_phone,
                s_fullName:
                  main_profile.s_firstname + ' ' + main_profile.s_lastname,
                s_streetAddress:
                  main_profile.s_address + ' ' + main_profile.s_address_2,
                s_cityTown: main_profile.s_city,
                s_stateText: main_profile.s_state,
                s_zipCode: main_profile.s_zipcode,
                s_email: 'demo@gmail.com', //TODO: Check for email
                s_phoneNumber: main_profile.s_phone,
              });
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          alert(ex);
        });
    }
  };

  validateAndRedirect = () => {
    this.setState({isReady: false})
    if (this.isValid()) {
      //TODO: Call post userdetails API here. All input data is stored in state
      this.props.navigation.navigate('Payment', {deliveryDetails: this.state});
      setTimeout(() => { this.setState({ isReady: true }) }, 1000)
    }
  };

  onRadioPress = (value) => {
    this.setState({sameShipping: value});
  };

  isValid() {
    let validFlag = true;

    if (this.state.fullName == '') {
      this.setState({fullNameError: 'Full Name is required.'});
      validFlag = false;
    } else {
      this.setState({fullNameError: ''});
    }

    if (this.state.streetAddress == '') {
      this.setState({streetAddressError: 'Street address is required.'});
      validFlag = false;
    } else {
      this.setState({streetAddressError: ''});
    }

    if (this.state.cityTown == '') {
      this.setState({cityTownError: 'City/Town is required.'});
      validFlag = false;
    } else {
      this.setState({cityTownError: ''});
    }

    if (this.state.stateText == '') {
      this.setState({stateTextError: 'State is required.'});
      validFlag = false;
    } else {
      this.setState({stateTextError: ''});
    }

    if (this.state.zipCode == '') {
      this.setState({zipCodeError: 'Zip code is required.'});
      validFlag = false;
    } else {
      this.setState({zipCodeError: ''});
    }

    if (this.state.email == '') {
      this.setState({emailError: 'Email is required.'});
      validFlag = false;
    } else {
      this.setState({emailError: ''});
    }

    if (this.state.phoneNumber == '') {
      this.setState({phoneNumberError: 'Phone number is required.'});
      validFlag = false;
    } else {
      this.setState({phoneNumberError: ''});
    }

    return validFlag;
  }

  showErrorMessage(errorMessage) {
    return (
      <View style={innerStyles.errorTextMainView}>
        <Icon
          size={30}
          name="md-information-circle-outline"
          type="ionicon"
          color="#FF0000"
        />
        <Text style={innerStyles.errorTextText}>{errorMessage}</Text>
      </View>
    );
  }

  onStateModalSelect = (index) => {
    this.setState({stateText: usStates[index]});
  };
  onShipStateModalSelect = (index) => {
    this.setState({s_stateText: usStates[index]});
  };

  selectProfile = (profile_id) => () => {
    this.setState({isReady: false});
    this.getData(gUser, profile_id);
  };

  render() {
    if (!this.state.isReady) {
      return (
        <View style={innerStyles.loader}>
          <Shimmer>
            <Image
              style={innerStyles.loaderImage}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }

    return (
      <SafeAreaView style={innerStyles.maincontainer}>
        <Header navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={innerStyles.scrollView}>
          <View styles={innerStyles.parentContainer}>
            <View style={innerStyles.paddingHorizontal}>
              <Text style={innerStyles.mainTextBold}>Billing and Shipping</Text>
              <Text style={[innerStyles.profileHeading]}>Select Profile:</Text>

              {!this.state.newUser && (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {this.state.profiles.map((item, index) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={this.selectProfile(item.profile_id)}
                          activeOpacity={0.5}
                          style={innerStyles.squareBoxButtons}>
                          <View style={innerStyles.checkIcon}>
                            <Icon
                              size={44}
                              name="checkcircle"
                              type="antdesign"
                              color="#5dd136"
                            />
                            <Text style={[innerStyles.lightText]}>
                              {item.profile_name.toUpperCase()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={innerStyles.padRight15}></View>
                      </View>
                    );
                  })}

                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      innerStyles.squareBoxButtons,
                      innerStyles.marginStart,
                    ]}>
                    <View style={innerStyles.checkIcon}>
                      <Icon
                        size={44}
                        name="ios-add-circle"
                        type="ionicon"
                        color="#f6f6f6"
                      />
                    </View>
                    <Text
                      style={[
                        innerStyles.lightText,
                        innerStyles.textAlignCenter,
                      ]}>
                      Create a new profile
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}

              <Text style={innerStyles.shippingAddress}>Billing Address</Text>
              <View style={innerStyles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  value={this.state.fullName}
                  onChangeText={(text) => {
                    this.setState({fullName: text});
                  }}
                />
              </View>
              {this.state.fullNameError != '' ? (
                this.showErrorMessage(this.state.fullNameError)
              ) : (
                <View></View>
              )}

              <View style={innerStyles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Street address"
                  value={this.state.streetAddress}
                  onChangeText={(text) => {
                    this.setState({streetAddress: text});
                  }}
                />
              </View>
              {this.state.streetAddressError != '' ? (
                this.showErrorMessage(this.state.streetAddressError)
              ) : (
                <View></View>
              )}

              <View style={innerStyles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="City / Town"
                  value={this.state.cityTown}
                  onChangeText={(text) => {
                    this.setState({cityTown: text});
                  }}
                />
              </View>
              {this.state.cityTownError != '' ? (
                this.showErrorMessage(this.state.cityTownError)
              ) : (
                <View></View>
              )}

              <View style={innerStyles.inputView}>
                <View style={innerStyles.modalView}>
                  <ModalDropdown
                    options={usStates}
                    defaultValue={
                      this.state.stateText ? this.state.stateText : 'State'
                    }
                    style={styles.input}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index) => {
                      this.onStateModalSelect(index);
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>
                <TextInput
                  style={[styles.input, innerStyles.marginStart]}
                  keyboardType={'number-pad'}
                  placeholder="Zip code"
                  value={this.state.zipCode}
                  onChangeText={(text) => {
                    this.setState({zipCode: text});
                  }}
                />
              </View>
              {this.state.stateTextError != '' ? (
                this.showErrorMessage(this.state.stateTextError)
              ) : (
                <View></View>
              )}
              {this.state.zipCodeError != '' ? (
                this.showErrorMessage(this.state.zipCodeError)
              ) : (
                <View></View>
              )}
              <View style={innerStyles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  keyboardType={'number-pad'}
                  value={this.state.phoneNumber}
                  onChangeText={(text) => {
                    this.setState({phoneNumber: text});
                  }}
                />
              </View>
              {this.state.phoneNumberError != '' ? (
                this.showErrorMessage(this.state.phoneNumberError)
              ) : (
                <View></View>
              )}

              <View style={innerStyles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={this.state.email}
                  onChangeText={(text) => {
                    this.setState({email: text});
                  }}
                />
              </View>
              {this.state.emailError != '' ? (
                this.showErrorMessage(this.state.emailError)
              ) : (
                <View></View>
              )}

              <Text style={innerStyles.sameShipping}>
                Billing and shipping addresses same
              </Text>
              {this.state.sameShipping ? (
                <RadioForm
                  radio_props={radio_props}
                  initial={0}
                  onPress={this.onRadioPress}
                  formHorizontal={true}
                  style={innerStyles.radioButton}
                  labelStyle={innerStyles.labelStyle}
                />
              ) : (
                <RadioForm
                  radio_props={radio_props}
                  initial={1}
                  onPress={this.onRadioPress}
                  formHorizontal={true}
                  style={innerStyles.radioButton}
                  labelStyle={innerStyles.labelStyle}
                />
              )}

              {!this.state.sameShipping && (
                <View>
                  <Text style={innerStyles.shippingAddress}>
                    Shipping Address
                  </Text>
                  <View style={innerStyles.inputView}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full name"
                      value={this.state.s_fullName}
                      onChangeText={(text) => {
                        this.setState({s_fullName: text});
                      }}
                    />
                  </View>
                  {this.state.s_fullNameError != '' ? (
                    this.showErrorMessage(this.state.s_fullNameError)
                  ) : (
                    <View></View>
                  )}

                  <View style={innerStyles.inputView}>
                    <TextInput
                      style={styles.input}
                      placeholder="Street address"
                      value={this.state.s_streetAddress}
                      onChangeText={(text) => {
                        this.setState({s_streetAddress: text});
                      }}
                    />
                  </View>
                  {this.state.s_streetAddressError != '' ? (
                    this.showErrorMessage(this.state.s_streetAddressError)
                  ) : (
                    <View></View>
                  )}

                  <View style={innerStyles.inputView}>
                    <TextInput
                      style={styles.input}
                      placeholder="City / Town"
                      value={this.state.s_cityTown}
                      onChangeText={(text) => {
                        this.setState({s_cityTown: text});
                      }}
                    />
                  </View>
                  {this.state.s_cityTownError != '' ? (
                    this.showErrorMessage(this.state.s_cityTownError)
                  ) : (
                    <View></View>
                  )}

                  <View style={innerStyles.inputView}>
                    <View style={innerStyles.modalView}>
                      <ModalDropdown
                        options={usStates}
                        defaultValue={
                          this.state.s_stateText
                            ? this.state.s_stateText
                            : 'State'
                        }
                        style={styles.input}
                        dropdownStyle={innerStyles.modalDropdownStyle}
                        textStyle={innerStyles.modalTextStyle}
                        onSelect={(index) => {
                          this.onShipStateModalSelect(index);
                        }}
                        renderRow={(option, index, isSelected) => {
                          return (
                            <Text style={[innerStyles.numText]}>{option}</Text>
                          );
                        }}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, innerStyles.marginStart]}
                      keyboardType={'number-pad'}
                      placeholder="Zip code"
                      value={this.state.s_zipCode}
                      onChangeText={(text) => {
                        this.setState({s_zipCode: text});
                      }}
                    />
                  </View>
                  {this.state.s_stateTextError != '' ? (
                    this.showErrorMessage(this.state.s_stateTextError)
                  ) : (
                    <View></View>
                  )}
                  {this.state.s_zipCodeError != '' ? (
                    this.showErrorMessage(this.state.s_zipCodeError)
                  ) : (
                    <View></View>
                  )}
                  <View style={innerStyles.inputView}>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone number"
                      keyboardType={'number-pad'}
                      value={this.state.s_phoneNumber}
                      onChangeText={(text) => {
                        this.setState({s_phoneNumber: text});
                      }}
                    />
                  </View>
                  {this.state.s_phoneNumberError != '' ? (
                    this.showErrorMessage(this.state.s_phoneNumberError)
                  ) : (
                    <View></View>
                  )}

                  <View style={innerStyles.inputView}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      value={this.state.s_email}
                      onChangeText={(text) => {
                        this.setState({s_email: text});
                      }}
                    />
                  </View>
                  {this.state.s_emailError != '' ? (
                    this.showErrorMessage(this.state.s_emailError)
                  ) : (
                    <View></View>
                  )}
                </View>
              )}
            </View>

            <OrderFooter/>
            <View style={[styles.buttonContainer, innerStyles.orderButtonView]}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[innerStyles.buttonPaymentMethod]}
                onPress={() => {this.validateAndRedirect()}}>
                <Text style={[styles.buttonText, innerStyles.orderButtonText]}>
                  Continue
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

const innerStyles = StyleSheet.create({
  errorTextMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  errorTextText: {paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%'},
  labelStyle: {
    marginRight: 10,
    fontFamily: 'Avenir-Medium',
    color: '#2d2d2f',
  },
  paymentText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
  checkIcon: {
    marginTop: 20,
  },
  inputView: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  orderButtonView: {
    paddingHorizontal: 30, width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20
},
  padRight15: {marginRight: 15},
  buttonStyles: {
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20,
  },
  profileHeading: {
    marginTop: 14,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#454547',
    marginBottom: 8,
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
  modalView: {
    flexDirection: 'row',
    width: '42.7%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalStyle: {
    flex: 1,
    padding: 5,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  modalDropdownStyle: {
    width: '30%',
    height: '50%',
  },
  modalTextStyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    paddingRight: 10,
  },
  modalInnerView: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
  },
  radioButton: {
    alignSelf: 'center',
  },
  priceText: {flex: 1, lineHeight: 30, textAlign: 'right'},
  marginStart: {marginStart: 15},
  alignRight: {flex: 1, textAlign: 'right'},
  textBold: {fontSize: 18, lineHeight: 30},
  orderViewNested: {flexDirection: 'row', paddingHorizontal: 20},
  plusIconStyle: {
    width: width * 0.08,
    height: height * 0.08,
  },
  paddingHorizontal: {paddingHorizontal: 20},
  iconDoneStyle: {
    width: width * 0.12,
    height: height * 0.12,
    justifyContent: 'center',
  },
  marginStart: {marginStart: 20},
  buttonContainerAdd: {marginTop: 20, width: '100%'},
  maincontainer: {flex: 1, backgroundColor: '#fff'},
  scrollView: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  mainTextBold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#454547',
    marginTop: 10,
    paddingBottom: 26,
  },
  lightText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
    lineHeight: 30,
  },
  profileName: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
    color: '#010101',
    marginTop: 15,
  },
  buttonTextContainer: {
    width: '100%',
    paddingVertical: 30,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#007de3',
    textAlign: 'center',
    fontSize: 18,
  },
  horizontalView: {
    flexDirection: 'row',
    paddingVertical: 10,
    flex: 1,
  },
  squareBoxButtons: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e6e6e7',
    alignItems: 'center',
    flex: 0.5,
    width: width * 0.4,
  },
  numText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#454547',
    textAlign: 'left',
    marginStart: 20,
    marginVertical: 10,
  },
  shippingAddress: {
    marginTop: 25,
    marginBottom: 12,
    fontFamily: 'Avenir-Medium',
    fontSize: 21,
    lineHeight: 24,
    color: '#2d2d2f',
  },
  sameShipping: {
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: 'Avenir-Medium',
    fontSize: 21,
    lineHeight: 24,
    color: '#2d2d2f',
  },
  showOrderView: {
    paddingTop: 15,
    flexDirection: 'column',
    flex: 1,
    marginTop: 15,
    width: '100%',
    backgroundColor: '#f6f6f6',
  },
  buttonPaymentMethod: {
    width: '100%',
    backgroundColor: '#2967ff',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  loaderImage: {height: 200, width: 200},
  textAlignLeft: {textAlign: 'left'},
  textAlignCenter: {textAlign: 'center'},
  alignCenter: {
    alignItems: 'center',
  },
});

export default Delivery;
