import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  InteractionManager,
} from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './Styles/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { TextInput } from 'react-native-gesture-handler';
import Shimmer from 'react-native-shimmer';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import ModalDropdown from 'react-native-modal-dropdown';
import PutData from '../reusableComponents/API/PutData';
import PostData from '../reusableComponents/API/PostData';
import GetData from '../reusableComponents/API/GetData';
import DialogInput from 'react-native-dialog-input';
import Toast from 'react-native-simple-toast';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import OrderFooter from '../reusableComponents/OrderFooter';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;
const usStates = Globals.usStates;
const australiaStates = Globals.australiaStates;
const canadaStates = Globals.canadaStates;
const states = Globals.states;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

let gUser;
var radio_props = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];
class Delivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      isReady: false,
      newUser: true,
      sameShipping: true,
      createNewProfile: false,
      newProfileName: '',
      isDialogVisible: false,
      selectedProfileName: '',
      selectedProfileId: '',
      fullName: '',
      fullNameError: '',
      streetAddress: '',
      streetAddressError: '',
      cityTownError: '',
      stateTextError: '',
      zipCodeError: '',
      email: '',
      emailError: '',
      phoneNumber: '',
      phoneNumberError: '',
      s_fullName: '',
      s_fullNameError: '',
      s_streetAddress: '',
      s_streetAddressError: '',
      s_cityTownError: '',
      s_stateTextError: '',
      s_zipCodeError: '',
      s_email: '',
      s_emailError: '',
      s_phoneNumber: '',
      s_phoneNumberError: '',
      //below are values for payment screen api
      s_firstName: '',
      s_lastName: '',
      b_firstName: '',
      b_lastName: '',
      s_address: '',
      b_address: '',
      zipCode: '',
      s_zipCode: '',
      stateText: '',
      s_stateText: '',
      cityTown: '',
      s_cityTown: '',
      b_country: 'US',//because it's on first index so will be auto selected.. if user change it, then this will also be changed
      s_country: 'US',
      totalCost: this.props.route.params.totalCost,
      finalCost: this.props.route.params.finalCost,
      discount: this.props.route.params.discount,
      paymentLineItems: this.props.route.params.paymentLineItems,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isReady: false });
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
              let sameShipping = main_profile.is_same_shipping;
              let newUser = true;
              if (
                main_profile.b_address ||
                main_profile.b_address_2 ||
                main_profile.s_address ||
                main_profile.s_address_2
              ) {
                newUser = false;
              }

              this.setState({
                isReady: true,
                newUser: false,
                sameShipping: sameShipping,
                selectedProfileName: main_profile.profile_name,
                selectedProfileId: main_profile.profile_id,
                fullName: (main_profile.b_firstname + ' ' + main_profile.b_lastname).trim(),
                b_firstName: main_profile.b_firstname,
                b_lastName: main_profile.b_lastname,
                b_address: main_profile.b_address + ' ' + main_profile.b_address_2,
                s_address: main_profile.s_address + ' ' + main_profile.s_address_2,
                streetAddress: (main_profile.b_address + ' ' + main_profile.s_address_2).trim(),
                cityTown: main_profile.b_city,
                stateText: main_profile.b_state,
                zipCode: main_profile.b_zipcode,
                email: user.email,
                phoneNumber: main_profile.b_phone,
                s_fullName: (main_profile.s_firstname + ' ' + main_profile.s_lastname).trim(),
                s_firstName: main_profile.s_firstname,
                s_lastName: main_profile.s_lastname,
                s_streetAddress: (main_profile.s_address + ' ' + main_profile.s_address_2).trim(),
                s_cityTown: main_profile.s_city,
                s_stateText: main_profile.s_state,
                s_zipCode: main_profile.s_zipcode,
                s_email: user.email,
                s_phoneNumber: main_profile.s_phone,
              });
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
              Toast.show(ex.toString())
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast.show(ex.toString());
        });
    }

    else {
      promises.push(GetData(baseUrl + `api/userprofilesnew/${user.user_id}`));
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              let main_profile = responses[0].main_profile[0];
              let sameShipping = main_profile.is_same_shipping === 'Y' ? true : false;
              let newUser = true;
              if (
                main_profile.b_address ||
                main_profile.b_address_2 ||
                main_profile.s_address ||
                main_profile.s_address_2
              ) {
                newUser = false;
              }

              this.setState({
                profiles: responses[0].profiles,
                isReady: true,
                newUser: newUser,
                sameShipping: sameShipping,
                selectedProfileName: main_profile.profile_name,
                selectedProfileId: main_profile.profile_id,
                b_firstName: main_profile.b_firstname,
                b_lastName: main_profile.b_lastname,
                b_address: main_profile.b_address + ' ' + main_profile.b_address_2,
                s_address: main_profile.s_address + ' ' + main_profile.s_address_2,
                fullName:
                  (main_profile.b_firstname + ' ' + main_profile.b_lastname).trim(),
                streetAddress:
                  (main_profile.b_address + ' ' + main_profile.b_address_2).trim(),
                cityTown: main_profile.b_city,
                stateText: main_profile.b_state,
                zipCode: main_profile.b_zipcode,
                email: user.email,
                phoneNumber: main_profile.b_phone,
                s_fullName:
                  (main_profile.s_firstname + ' ' + main_profile.s_lastname).trim(),
                s_streetAddress:
                  (main_profile.s_address + ' ' + main_profile.s_address_2).trim(),
                s_cityTown: main_profile.s_city,
                s_stateText: main_profile.s_state,
                s_zipCode: main_profile.s_zipcode,
                s_email: user.email,
                s_phoneNumber: main_profile.s_phone,
              });
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
              Toast.show(ex.toString())
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast.show(ex.toString());
        });
    }
  };

  navigateToUserProfile = () => {
    this.props.navigation.navigate("UserProfile")
  }
  validateAndRedirect = () => {
    if (this.isValid()) {
      this.setState({ isReady: false });

      let data = {
        user_id: parseInt(gUser.user_id),
      };

      if (!this.state.createNewProfile) {
        (data.profile_name = this.state.selectedProfileName),
          (data.profile_id = parseInt(this.state.selectedProfileId));
      } else {
        data.profile_name = this.state.selectedProfileName;
      }

      let fname = '', lname = '';
      if (this.state.fullName.split(' ').length > 1) {
        fname = this.state.fullName.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
        lname = this.state.fullName.split(' ').slice(-1).join(' ');

      } else {
        fname = this.state.fullName
      }

      if (this.state.sameShipping) {
        (data.b_firstname = fname),
          (data.b_lastname = lname),
          (data.b_address = this.state.streetAddress.split(",")[0]), //TODO: Everything before first comma in b_address and everything after that is b_address_2
          (data.b_address_2 = this.state.streetAddress.split(',').slice(1).join(',')),
          (data.b_county = ''),
          (data.b_country = this.state.b_country),
          (data.b_city = this.state.cityTown),
          (data.b_state = this.state.stateText),
          (data.b_zipcode = this.state.zipCode),
          (data.b_phone = this.state.phoneNumber),
          (data.is_same_shipping = 'Y');
      } else {
        let s_fname, s_lname = '';
        if (this.state.s_fullName.split(' ').length > 1) {
          s_fname = this.state.s_fullName.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
          s_lname = this.state.s_fullName.split(' ').slice(-1).join(' ');

        } else {
          s_fname = this.state.s_fullName
        }


        (data.b_firstname = fname),
          (data.b_lastname = lname),
          (data.b_address = this.state.streetAddress.split(",")[0]),
          (data.b_address_2 = this.state.streetAddress.split(',').slice(1).join(',')),
          (data.b_county = ''),
          (data.b_country = this.state.b_country),
          (data.b_city = this.state.cityTown),
          (data.b_state = this.state.stateText),
          (data.b_zipcode = this.state.zipCode),
          (data.b_phone = this.state.phoneNumber),
          (data.s_firstname = s_fname),
          (data.s_lastname = s_lname),
          (data.s_address = this.state.s_streetAddress.split(",")[0]),
          (data.s_address_2 = this.state.s_streetAddress.split(',').slice(1).join(',')),
          (data.s_county = ''),
          (data.s_country = this.state.s_country),
          (data.s_city = this.state.s_cityTown),
          (data.s_state = this.state.s_stateText),
          (data.s_zipcode = this.state.s_zipCode),
          (data.s_phone = this.state.s_phoneNumber),
          (data.is_same_shipping = 'N');
      }

      if (this.state.createNewProfile) {
        PostData(baseUrl + `api/userprofilesnew`, data)
          .then((res) => res.json())
          .then((response) => {
            if (!response.message) {
              Toast.show(`${data.profile_name} profile created successfully`);
              if (this.props.route.params.fromUserProfile) this.props.navigation.navigate("UserProfile")
              else {
                this.props.navigation.push('Payment', {
                  deliveryDetails: this.state,
                  totalCost: this.props.route.params.totalCost,
                  finalCost: this.props.route.params.finalCost,
                  discount: this.props.route.params.discount,
                  paymentLineItems: this.props.route.params.paymentLineItems,
                  orderItems: this.props.route.params.orderItems,
                  profile_id: response.profile_id,
                  b_userAddress_1: this.props.route.params.b_userAddress_1,
                  b_userAddress_2: this.props.route.params.b_userAddress_2,
                  b_zipCode: this.props.route.params.b_zipCode,
                  b_country: this.props.route.params.b_country,
                });
              }
              setTimeout(() => {
                this.setState({ isReady: true });
              }, 1000);
            } else {
              Toast.show(response.message);
            }
          })
          .catch((e) => { Toast.show(e.toString()); console.log(err) });
      } else {
        console.log(data)
        PutData(
          baseUrl + `api/userprofilesnew/${this.state.selectedProfileId}`,
          data,
        )
          .then((res) => res.json())
          .then((response) => {

            if (response.profile_id) {
              if (this.props.route.params.fromUserProfile) this.props.navigation.navigate("UserProfile")
              else {
                this.props.navigation.push('Payment', {
                  totalCost: this.props.route.params.totalCost,
                  finalCost: this.props.route.params.finalCost,
                  discount: this.props.route.params.discount,
                  paymentLineItems: this.props.route.params.paymentLineItems,
                  orderItems: this.props.route.params.orderItems,
                  profile_id: response.profile_id
                });
              }
              setTimeout(() => {
                this.setState({ isReady: true });
              }, 1000);
            }
          })
          .catch((e) => { Toast.show(e.toString()); console.log(e) });
      }
    }
  };

  onRadioPress = (value) => {
    this.setState({ sameShipping: value });
  };

  isValid() {
    let validFlag = true;

    //Billing address
    if (this.state.fullName == '') {
      this.setState({ fullNameError: 'Full Name is required.' });
      validFlag = false;
    } else {
      this.setState({ fullNameError: '' });
    }

    if (this.state.streetAddress == '') {
      this.setState({ streetAddressError: 'Street address is required.' });
      validFlag = false;
    } else {
      this.setState({ streetAddressError: '' });
    }

    if (this.state.cityTown == '') {
      this.setState({ cityTownError: 'City/Town is required.' });
      validFlag = false;
    } else {
      this.setState({ cityTownError: '' });
    }

    if (this.state.stateText == '') {
      this.setState({ stateTextError: 'State is required.' });
      validFlag = false;
    } else {
      this.setState({ stateTextError: '' });
    }

    if (this.state.zipCode == '') {
      this.setState({ zipCodeError: 'Zip code is required.' });
      validFlag = false;
    } else {
      this.setState({ zipCodeError: '' });
    }

    if (this.state.email == '') {
      this.setState({ emailError: 'Email is required.' });
      validFlag = false;
    } else {
      this.setState({ emailError: '' });
    }

    if (this.state.phoneNumber == '') {
      this.setState({ phoneNumberError: 'Phone number is required.' });
      validFlag = false;
    } else {
      this.setState({ phoneNumberError: '' });
    }

    //Shipping address
    if (!this.state.sameShipping) {
      if (this.state.s_fullName == '') {
        this.setState({ s_fullNameError: 'Full Name is required.' });
        validFlag = false;
      } else {
        this.setState({ s_fullNameError: '' });
      }

      if (this.state.s_streetAddress == '') {
        this.setState({ s_streetAddressError: 'Street address is required.' });
        validFlag = false;
      } else {
        this.setState({ s_streetAddressError: '' });
      }

      if (this.state.s_cityTown == '') {
        this.setState({ s_cityTownError: 'City/Town is required.' });
        validFlag = false;
      } else {
        this.setState({ s_cityTownError: '' });
      }

      if (this.state.s_stateText == '') {
        this.setState({ s_stateTextError: 'State is required.' });
        validFlag = false;
      } else {
        this.setState({ s_stateTextError: '' });
      }

      if (this.state.s_zipCode == '') {
        this.setState({ s_zipCodeError: 'Zip code is required.' });
        validFlag = false;
      } else {
        this.setState({ s_zipCodeError: '' });
      }

      if (this.state.s_email == '') {
        this.setState({ s_emailError: 'Email is required.' });
        validFlag = false;
      } else {
        this.setState({ s_emailError: '' });
      }

      if (this.state.s_phoneNumber == '') {
        this.setState({ s_phoneNumberError: 'Phone number is required.' });
        validFlag = false;
      } else {
        this.setState({ s_phoneNumberError: '' });
      }
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

  onStateModalSelect = (option) => {
    this.setState({ b_country: option });
  };
  onShipStateModalSelect = (option) => {
    this.setState({ s_country: option });
  };

  onParentStateModalSelect = (option) => {
    if (option == 'US') {
      this.setState({ stateText: usStates[0] });
    } else if (option == 'AU') {
      this.setState({ stateText: australiaStates[0] });
    } else if (option == 'CA') {
      this.setState({ stateText: canadaStates[0] });
    }
    this.setState({ b_country: option });
  };

  onParentShipStateModalSelect = (option) => {
    if (option == 'US') {
      this.setState({ s_stateText: usStates[0] });
    } else if (option == 'AU') {
      this.setState({ s_stateText: australiaStates[0] });
    } else if (option == 'CA') {
      this.setState({ s_stateText: canadaStates[0] });
    }
    this.setState({ s_country: option });
  };

  selectProfile = (profile_id, profile_name) => () => {
    this.setState({
      isReady: false,
      selectedProfileName: profile_name,
      selectedProfileId: profile_id,
      createNewProfile: false,
    });
    this.getData(gUser, profile_id);
  };

  makeNewProfile = (profileName) => {
    let profileAllowed = true;
    this.state.profiles.forEach((profile) => {
      if (profile.profile_name.toUpperCase() == profileName.toUpperCase()) {
        Toast.show('Profile name already exists');
        profileAllowed = false;
      }
    });

    if (profileAllowed) {
      this.setState({
        profiles: [...this.state.profiles, { profile_name: profileName }],
        selectedProfileName: profileName,
        isDialogVisible: false,
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
      });
    }
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

    console.log("STTTTTTTTTTTTTTTTT+> ", this.state.stateText);

    return (
      <SafeAreaView style={innerStyles.maincontainer}>
        <Header navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={innerStyles.scrollView}>
          <View styles={innerStyles.parentContainer}>
            <View style={innerStyles.paddingHorizontal}>
              <Text style={innerStyles.mainTextBold}>Billing and Shipping</Text>

              {!this.state.newUser && (
                <View>
                  <Text style={[innerStyles.profileHeading]}>
                    Select Profile:
                  </Text>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {this.state.profiles.map((item, index) => {
                      return (
                        <View
                          key={item.profile_id}
                          style={innerStyles.padRight15}>
                          <TouchableOpacity
                            onPress={this.selectProfile(
                              item.profile_id,
                              item.profileName,
                            )}
                            activeOpacity={0.5}
                            style={innerStyles.squareBoxButtons}>
                            <View style={innerStyles.checkIcon}>
                              {this.state.selectedProfileName.toUpperCase() ===
                                item.profile_name.toUpperCase() ? (
                                  <Icon
                                    size={44}
                                    name="checkcircle"
                                    type="antdesign"
                                    color="#5dd136"
                                  />
                                ) : (
                                  <Icon
                                    size={44}
                                    name="checkcircle"
                                    type="antdesign"
                                    color="#f6f6f6"
                                  />
                                )}

                              <Text style={[innerStyles.lightText]}>
                                {item.profile_name.toUpperCase()}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          createNewProfile: true,
                          isDialogVisible: true,
                        })
                      }
                      activeOpacity={0.5}
                      style={[innerStyles.squareBoxButtons]}>
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
                </View>
              )}

              <DialogInput
                isDialogVisible={this.state.isDialogVisible}
                title={'New profile'}
                message={'Please enter name of new profile'}
                hintInput={'Profile Name'}
                submitInput={(inputText) => {
                  this.makeNewProfile(inputText);
                }}
                closeDialog={() => {
                  this.setState({
                    createNewProfile: false,
                    isDialogVisible: false,
                  });
                }}></DialogInput>
              {/*************************  BILLING ADDRESS ************************** */}
              <Text style={innerStyles.shippingAddress}>Billing Address</Text>
              <View style={innerStyles.inputView}>
                <TextInput
                  textContentType="name"
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={TEXTINPUT_COLOR}
                  value={this.state.fullName}
                  onChangeText={(text) => {
                    this.setState({ fullName: text });
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
                  placeholderTextColor={TEXTINPUT_COLOR}
                  textContentType="fullStreetAddress"
                  style={styles.input}
                  placeholder="Address"
                  value={this.state.streetAddress}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({ streetAddress: text });
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
                  placeholderTextColor={TEXTINPUT_COLOR}
                  textContentType="addressCity"
                  style={styles.input}
                  placeholder="City / Town"
                  value={this.state.cityTown}
                  onChangeText={(text) => {
                    this.setState({ cityTown: text });
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
                    options={states}
                    defaultValue={
                      this.state.b_country ? this.state.b_country : 'country'
                    }
                    style={styles.input}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index, option) => {
                      this.onParentStateModalSelect(option);
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>
                <View style={innerStyles.modalView}>
                  <ModalDropdown
                    options={
                      (this.state.b_country == 'US') ? usStates
                        : (this.state.b_country == 'AU') ? australiaStates
                          : canadaStates
                    }
                    defaultValue={
                      this.state.stateText ? this.state.stateText : 'State'
                    }
                    style={styles.input}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index, option) => {
                      this.onStateModalSelect(option);
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>

              </View>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="postalCode"
                style={[styles.input]}
                keyboardType={'phone-pad'}
                placeholder="Zip code"
                value={this.state.zipCode}
                onChangeText={(text) => {
                  this.setState({ zipCode: text });
                }}
              />
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
                  placeholderTextColor={TEXTINPUT_COLOR}
                  textContentType="telephoneNumber"
                  style={styles.input}
                  placeholder="Phone number"
                  keyboardType={'phone-pad'}
                  value={this.state.phoneNumber}
                  onChangeText={(text) => {
                    this.setState({ phoneNumber: text });
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
                  placeholderTextColor={TEXTINPUT_COLOR}
                  textContentType="emailAddress"
                  style={styles.input}
                  keyboardType="email-address"
                  placeholder="Email address"
                  value={this.state.email}
                  onChangeText={(text) => {
                    this.setState({ email: text });
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
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="name"
                      style={styles.input}
                      placeholder="Full name"
                      value={this.state.s_fullName}
                      onChangeText={(text) => {
                        this.setState({ s_fullName: text });
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
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="fullStreetAddress"
                      style={styles.input}
                      placeholder="Address"
                      value={this.state.s_streetAddress}
                      onChangeText={(text) => {
                        this.setState({ s_streetAddress: text });
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
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="addressCity"
                      style={styles.input}
                      placeholder="City / Town"
                      value={this.state.s_cityTown}
                      onChangeText={(text) => {
                        this.setState({ s_cityTown: text });
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
                        options={states}
                        defaultValue={
                          this.state.s_country
                            ? this.state.s_country
                            : 'country'
                        }
                        style={styles.input}
                        dropdownStyle={innerStyles.modalDropdownStyle}
                        textStyle={innerStyles.modalTextStyle}
                        onSelect={(index, option) => {
                          this.onParentShipStateModalSelect(option);
                        }}
                        renderRow={(option, index, isSelected) => {
                          return (
                            <Text style={[innerStyles.numText]}>{option}</Text>
                          );
                        }}
                      />
                    </View>
                    <View style={innerStyles.modalView}>
                      <ModalDropdown
                        options={
                          (this.state.s_country == 'US') ? usStates
                            : (this.state.s_country == 'AU') ? australiaStates
                              : canadaStates
                        }
                        defaultValue={
                          this.state.s_stateText ? this.state.s_stateText : 'State'
                        }
                        style={styles.input}
                        dropdownStyle={innerStyles.modalDropdownStyle}
                        textStyle={innerStyles.modalTextStyle}
                        onSelect={(index, option) => {
                          this.onShipStateModalSelect(option);
                        }}
                        renderRow={(option, index, isSelected) => {
                          return (
                            <Text style={[innerStyles.numText]}>{option}</Text>
                          );
                        }}
                      />
                    </View>

                    {/* 
                      <View style={innerStyles.modalView}>
                  <ModalDropdown
                    options={states}
                    defaultValue={
                      this.state.b_country ? this.state.b_country : 'country'
                    }
                    style={styles.input}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index, option) => {
                      this.onParentStateModalSelect(option);
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>
                <View style={innerStyles.modalView}>
                  <ModalDropdown
                    options={
                      (this.state.b_country == 'US')?usStates
                      :(this.state.b_country == 'AU')?australiaStates
                      :canadaStates
                    }
                    defaultValue={
                      this.state.stateText ? this.state.stateText : 'State'
                    }
                    style={styles.input}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index, option) => {
                      this.onStateModalSelect(option);
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>

                    */}
                  </View>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="postalCode"
                    style={[styles.input]}
                    keyboardType={'phone-pad'}
                    placeholder="Zip code"
                    value={this.state.s_zipCode}
                    onChangeText={(text) => {
                      this.setState({ s_zipCode: text });
                    }}
                  />
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
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="telephoneNumber"
                      style={styles.input}
                      placeholder="Phone number"
                      keyboardType={'phone-pad'}
                      value={this.state.s_phoneNumber}
                      onChangeText={(text) => {
                        this.setState({ s_phoneNumber: text });
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
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="emailAddress"
                      style={styles.input}
                      placeholder="Email address"
                      keyboardType="email-address"
                      value={this.state.s_email}
                      onChangeText={(text) => {
                        this.setState({ s_email: text });
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

            {!this.props.route.params.fromUserProfile && (
              <OrderFooter totalCost={this.props.route.params.totalCost} finalCost={this.props.route.params.finalCost} discount={this.props.route.params.discount} />

            )}
            <View style={[styles.buttonContainer, innerStyles.orderButtonView]}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[innerStyles.buttonPaymentMethod]}
                onPress={() => {
                  this.validateAndRedirect();
                }}>
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
  errorTextText: { paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%' },
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
    justifyContent: 'space-between'
  },
  orderButtonView: {
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20,
  },
  padRight15: { marginRight: 15 },
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
  priceText: { flex: 1, lineHeight: 30, textAlign: 'right' },
  marginStart: { marginStart: 15 },
  alignRight: { flex: 1, textAlign: 'right' },
  textBold: { fontSize: 18, lineHeight: 30 },
  orderViewNested: { flexDirection: 'row', paddingHorizontal: 20 },
  plusIconStyle: {
    width: width * 0.08,
    height: height * 0.08,
  },
  paddingHorizontal: { paddingHorizontal: 20 },
  iconDoneStyle: {
    width: width * 0.12,
    height: height * 0.12,
    justifyContent: 'center',
  },
  marginStart: { marginStart: 20 },
  buttonContainerAdd: { marginTop: 20, width: '100%' },
  maincontainer: { flex: 1, backgroundColor: '#fff' },
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
    backgroundColor: '#1bbfc7',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderImage: { height: 200, width: 200 },
  textAlignLeft: { textAlign: 'left' },
  textAlignCenter: { textAlign: 'center' },
  alignCenter: {
    alignItems: 'center',
  },

});

export default Delivery;
