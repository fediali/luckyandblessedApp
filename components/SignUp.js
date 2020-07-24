import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import md5 from 'react-native-md5';
import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import LogoSmall from './Styles/LogoSmall';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import {Icon} from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Globals from '../Globals';
var RNFS = require('react-native-fs');

const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;
const usStates = Globals.usStates;
var radio_props = [
  {label: 'Yes', value: true},
  {label: 'No', value: false},
];
const baseUrl = Globals.baseUrl;

let DEFAULTS_OBJ = [];

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      fileSelectText: 'Upload Sales TX ID',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      nonMatchingPasswordError: '',
      salesTaxID: '',
      salesTaxIdFile: null,
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      salesTaxIDError: '',
      salesTaxIDFileError: '',
      company: '',
      companyError: '',
      businessPhone: '',
      businessPhoneError: '',
      mobile: '',
      mobileError: '',
      //billing states
      billingFirstName: '',
      billingFirstNameError: '',
      billingLastName: '',
      billingLastNameError: '',
      streetAddress: '',
      streetAddressError: '',
      cityTownError: '',
      stateTextError: '',
      zipCodeError: '',
      email: '',
      emailError: '',
      phoneNumber: '',
      phoneNumberError: '',
      s_firstName: '',
      s_firstNameError: '',
      s_lastName: '',
      s_lastNameError: '',
      s_streetAddress: '',
      s_streetAddressError: '',
      s_cityTownError: '',
      s_stateTextError: '',
      s_zipCodeError: '',
      s_email: '',
      s_emailError: '',
      s_phoneNumber: '',
      s_phoneNumberError: '',
      sameShipping: true,
      isConfirmPasswordVisible:false,
      isPasswordVisible:false
    };

    RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
      DEFAULTS_OBJ = JSON.parse(defaults);
    });
  }

  async selectOneFile() {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      RNFS.readFile(res.uri, 'base64').then((fileBase64) => {
        // console.log(fileBase64)
        this.setState({
          fileSelectText: res.name,
          salesTaxIdFile: res.uri,
          fileBase64: fileBase64,
        });
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //alert('Canceled from single doc picker');
        this.setState({});
      } else {
        //For Unknown Error
        alert('Some unknown error occured while selecting file');
        throw err;
      }
    }
  }

  displayImagePicker() {
    /////////////////////////   Image Picker   ////////////////////////////
    const options = {
      title: 'Upload from..',
      customButtons: [{name: 'document', title: 'Upload PDF file'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.selectOneFile();
      } else {
        // const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // this.getBase64(idCard, (result) => {
        //   // idCardBase64 = result;
        //   console.log(result)
        // });

        let path = response.uri;
        if (Platform.OS === 'ios') {
          path = '~' + path.substring(path.indexOf('/Documents'));
        }
        if (!response.fileName)
          response.fileName = path.split('/').pop() + '.jpg';

        RNFS.readFile(response.uri, 'base64').then((fileBase64) => {
          // console.log(fileBase64)
          this.setState({
            fileSelectText: response.fileName,
            salesTaxIdFile: response.uri,
            fileBase64: fileBase64,
          });
        });
      }
    });
  }
  signUpClick(showAlert = true) {
    console.log("SignUp Clicked")
    if (this.isValid()) {
      this.setState({emailError: ''});
      //call signup API here
      console.log("input is Valid")

      var data = {
        email: this.state.email,
        password: md5.hex_md5(this.state.password),
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        company_id: DEFAULTS_OBJ.store_id.toString(),
        company: this.state.company,
        phone: this.state.businessPhone,
        is_root: 'N',
        user_type: 'C',
        status: 'D',
      };

      if (this.state.sameShipping) {
        (data.b_firstname = this.state.billingFirstName),
          (data.b_lastname = this.state.billingLastName),
          (data.b_address = this.state.streetAddress.split(',')[0]), //TODO: Everything before first comma in b_address and everything after that is b_address_2
          (data.b_address_2 = this.state.streetAddress
            .split(',')
            .slice(1)
            .join(',')),
          (data.b_county = ''),
          (data.b_country = 'US'),
          (data.b_city = this.state.cityTown),
          (data.b_state = this.state.stateText),
          (data.b_zipcode = this.state.zipCode),
          (data.b_phone = this.state.phoneNumber),
          (data.is_same_shipping = 'Y');
      } else {
        

        (data.b_firstname = this.state.billingFirstName),
          (data.b_lastname = this.state.billingLastName),
          (data.b_address = this.state.streetAddress.split(',')[0]),
          (data.b_address_2 = this.state.streetAddress
            .split(',')
            .slice(1)
            .join(',')),
          (data.b_county = ''),
          (data.b_country = 'US'),
          (data.b_city = this.state.cityTown),
          (data.b_state = this.state.stateText),
          (data.b_zipcode = this.state.zipCode),
          (data.b_phone = this.state.phoneNumber),
          (data.s_firstname = this.state.s_firstName),
          (data.s_lastname = this.state.s_lastName),
          (data.s_address = this.state.s_streetAddress.split(',')[0]),
          (data.s_address_2 = this.state.s_streetAddress
            .split(',')
            .slice(1)
            .join(',')),
          (data.s_county = ''),
          (data.s_country = 'US'),
          (data.s_city = this.state.s_cityTown),
          (data.s_state = this.state.s_stateText),
          (data.s_zipcode = this.state.s_zipCode),
          (data.s_phone = this.state.s_phoneNumber),
          (data.is_same_shipping = 'N');
      }

      // var promises = [];
      if (this.state.salesTaxIdFile) {
        PostData(baseUrl + 'api/users', data)
          .then((res) => res.json())
          .then((response) => {
            console.log("User", response)

            if (response.user_id) {
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              today = mm + '/' + dd + '/' + yyyy;

              let taxIdData = {
                user_id: response.user_id,
                company_id: DEFAULTS_OBJ.store_id.toString(),
                taxid_file: this.state.fileBase64,
                date: today,
              };
              Toast.show('Please wait...');
              

              PostData(baseUrl + 'api/salestaxid', taxIdData)
                .then((res) => res.json())
                .then((response) => {
                  console.log("TaxID", response)

                  if (response.tax_id) {
                    
                    Toast.show('Registered Successfully');
                    this.props.navigation.navigate('SignIn'); //Passing user Name
                    let subsData = {
                      email: data.email,
                      name: data.firstname + ' ' + data.lastname,
                      company_id: data.company_id,
                    };
                    PostData(baseUrl + 'api/subscribe', subsData)
                      .then((res) => res.json())
                      .then((response) => {
                        if (response.subscriber_id) {
                          // console.log("Subscribed to newsletter Successfully")
                        }
                      });
                  } else {
                    //TODO: Incase of an error in taxId file, delete user.
                  }
                })
                .catch((err) => {
                  throw err;
                });
            } else {
              this.setState({
                emailError:
                  'The username or email you have chosen already exists',
              });
            }
          })
          .catch((ex) => {
            console.log('Promise exception', ex);
            Toast.show(ex.toString());
          });
      } else {
        GetData(baseUrl + 'api/users?email=' + this.state.email)
          .then((res) => res.json())
          .then((response) => {
            if (response.users.length == 0) {
              if (showAlert) this.alertUser(baseUrl + 'api/users', data);
              else {
                this.props.navigation.navigate('TaxID', {
                  url: baseUrl + 'api/users',
                  data,
                });
              }
            } else {
              this.setState({
                emailError:
                  'The username or email you have chosen already exists',
              });
            }
          })
          .catch((e) => Toast.show(e.toString()));
      }
    }
  }

  alertUser = (url, data) => {
    Alert.alert(
      'Attention!',
      'Tax ID file required',
      [
        {
          text: 'Upload file',
          style: 'cancel',
        },

        {
          text: 'Fill form',
          onPress: () => {
            this.props.navigation.navigate('TaxID', {
              url: url,
              data,
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  navigateToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  isValid() {
    let validFlag = true;
    if (this.state.firstName == '') {
      this.setState({firstNameError: 'First name is required.'});
      validFlag = false;
    } else {
      this.setState({firstNameError: ''});
    }

    if (this.state.lastName == '') {
      this.setState({lastNameError: 'Last name is required.'});
      validFlag = false;
    } else {
      this.setState({lastNameError: ''});
    }

    if (this.state.company == '') {
      this.setState({companyError: 'Company name is required.'});
      validFlag = false;
    } else {
      this.setState({companyError: ''});
    }

    if (this.state.businessPhone == '') {
      this.setState({businessPhoneError: 'Phone number is required.'});
      validFlag = false;
    } else {
      this.setState({businessPhoneError: ''});
    }

    // if (this.state.mobile == '') {
    //   this.setState({mobileError: 'Mobile is required.'});
    //   validFlag = false;
    // } else {
    //   this.setState({mobileError: ''});
    // }

    if (this.state.email == '') {
      this.setState({emailError: 'Email is required.'});
      validFlag = false;
    } else {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
      if (emailRegex.test(this.state.email) === false) {
        this.setState({emailError: 'Email is invalid.'});
        validFlag = false;
      } else {
        this.setState({emailError: ''});
      }
    }
    if (this.state.password != this.state.confirmPassword) {
      this.setState({nonMatchingPasswordError: 'Passwords do not match.'});
      validFlag = false;
    } else {
      this.setState({nonMatchingPasswordError: ''});
    }
    if (this.state.password == '') {
      this.setState({passwordError: 'Password is required.'});
      validFlag = false;
    } else {
      let passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{7,}$/;
      if (passwordRegex.test(this.state.password) === false) {
        this.setState({
          passwordError:
            'Password must contain atleast one upper case, one lower case, one numeric charachter, and more than or equal to 7 characters long.',
        });
        validFlag = false;
      } else {
        this.setState({passwordError: ''});
      }
    }

    if (this.state.confirmPassword == '') {
      this.setState({confirmPasswordError: 'Confirm password is required.'});
      validFlag = false;
    } else {
      this.setState({confirmPasswordError: ''});
    }

    //Billing address
    if (this.state.billingFirstName == '') {
      this.setState({billingFirstNameError: 'First Name is required.'});
      validFlag = false;
    } else {
      this.setState({billingFirstNameError: ''});
    }

    if (this.state.billingLastName == '') {
      this.setState({billingLastNameError: 'Last Name is required.'});
      validFlag = false;
    } else {
      this.setState({billingLastNameError: ''});
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

    //Shipping address
    if (!this.state.sameShipping) {
      if (this.state.s_firstName == '') {
        this.setState({s_firstNameError: 'First Name is required.'});
        validFlag = false;
      } else {
        this.setState({s_firstNameError: ''});
      }

      if (this.state.s_lastName == '') {
        this.setState({s_lastNameError: 'Last Name is required.'});
        validFlag = false;
      } else {
        this.setState({s_lastNameError: ''});
      }

      if (this.state.s_streetAddress == '') {
        this.setState({s_streetAddressError: 'Street address is required.'});
        validFlag = false;
      } else {
        this.setState({s_streetAddressError: ''});
      }

      if (this.state.s_cityTown == '') {
        this.setState({s_cityTownError: 'City/Town is required.'});
        validFlag = false;
      } else {
        this.setState({s_cityTownError: ''});
      }

      if (this.state.s_stateText == '') {
        this.setState({s_stateTextError: 'State is required.'});
        validFlag = false;
      } else {
        this.setState({s_stateTextError: ''});
      }

      if (this.state.s_zipCode == '') {
        this.setState({s_zipCodeError: 'Zip code is required.'});
        validFlag = false;
      } else {
        this.setState({s_zipCodeError: ''});
      }

      if (this.state.s_email == '') {
        this.setState({s_emailError: 'Email is required.'});
        validFlag = false;
      } else {
        this.setState({s_emailError: ''});
      }

      if (this.state.s_phoneNumber == '') {
        this.setState({s_phoneNumberError: 'Phone number is required.'});
        validFlag = false;
      } else {
        this.setState({s_phoneNumberError: ''});
      }
    }

    return validFlag;
  }

  showErrorMessage(errorMessage) {
    return (
      <View style={innerStyles.errorMessageView}>
        <Icon
          size={30}
          name="md-information-circle-outline"
          type="ionicon"
          color="#FF0000"
        />
        <Text style={innerStyles.errorMessageText}>{errorMessage}</Text>
      </View>
    );
  }

  handleFillOutTXId = () => {
    this.signUpClick(false);
  };

  navigateScreen = (screen) => () => {
    this.props.navigation.navigate(screen);
  };

  onRadioPress = (value) => {
    this.setState({sameShipping: value});
  };

  onStateModalSelect = (index) => {
    this.setState({
      stateText: usStates[index],
      s_country: usStates[index],
      b_country: usStates[index],
    });
  };
  onShipStateModalSelect = (index) => {
    this.setState({s_stateText: usStates[index]});
  };

  handlePasswordView=()=>{
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible
    }));
  }
  handleConfirmPasswordView=()=>{
    this.setState(prevState => ({
      isConfirmPasswordVisible: !prevState.isConfirmPasswordVisible
    }));
  }
  render() {
    return (
      <SafeAreaView style={styles.parentContainer}>
        <Header navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={innerStyles.scrollViewStyles}>
          <View style={styles.subParentContainer}>
            <LogoSmall />
            <Text style={styles.customTextBold}>Register Now</Text>

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="name"
                style={styles.input}
                placeholder="First Name"
                autoCapitalize="words"
                onChangeText={(text) => {
                  this.setState({firstName: text});
                }}
              />
            </View>
            {this.state.firstNameError != ''
              ? this.showErrorMessage(this.state.firstNameError)
              : null}
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="name"
                style={styles.input}
                placeholder="Last Name"
                autoCapitalize="words"
                onChangeText={(text) => {
                  this.setState({lastName: text});
                }}
              />
            </View>
            {this.state.lastNameError != ''
              ? this.showErrorMessage(this.state.lastNameError)
              : null}
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                style={styles.input}
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={(text) => {
                  this.setState({email: text.trim()});
                }}
              />
            </View>
            {this.state.emailError != ''
              ? this.showErrorMessage(this.state.emailError)
              : null}

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="password"
                style={styles.input}
                secureTextEntry={!this.state.isPasswordVisible}
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={(text) => {
                  this.setState({password: text});
                }}
              />
              <TouchableOpacity activeOpacity={0.95} onPress={this.handlePasswordView}>
                <Icon
                  size={22}
                  name={this.state.isPasswordVisible ? "md-eye" : "md-eye-off"}
                  type="ionicon"
                  color="#2d2d2f"
                />
              </TouchableOpacity>
            </View>
            {this.state.passwordError != ''
              ? this.showErrorMessage(this.state.passwordError)
              : null}

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="password"
                style={styles.input}
                secureTextEntry={!this.state.isConfirmPasswordVisible}
                autoCapitalize="none"
                placeholder="Confirm password"
                onChangeText={(text) => {
                  this.setState({confirmPassword: text});
                }}
              />
              <TouchableOpacity activeOpacity={0.95} onPress={this.handleConfirmPasswordView}>
                <Icon
                  size={22}
                  name={this.state.isConfirmPasswordVisible ? "md-eye" : "md-eye-off"}
                  type="ionicon"
                  color="#2d2d2f"
                />
              </TouchableOpacity>
            </View>

            {this.state.confirmPasswordError != ''
              ? this.showErrorMessage(this.state.confirmPasswordError)
              : null}
            {this.state.nonMatchingPasswordError != ''
              ? this.showErrorMessage(this.state.nonMatchingPasswordError)
              : null}
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="name"
                style={styles.input}
                autoCapitalize="words"
                placeholder="Company Name"
                onChangeText={(text) => {
                  this.setState({company: text});
                }}
              />
            </View>
            {this.state.companyError != ''
              ? this.showErrorMessage(this.state.companyError)
              : null}
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="telephoneNumber"
                style={styles.input}
                keyboardType={'phone-pad'}
                autoCapitalize="none"
                placeholder="Business Phone"
                onChangeText={(text) => {
                  this.setState({businessPhone: text});
                }}
              />
            </View>
            {this.state.businessPhoneError != ''
              ? this.showErrorMessage(this.state.businessPhoneError)
              : null}
            {/* <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="telephoneNumber"
                style={styles.input}
                secureTextEntry={true}
                autoCapitalize="none"
                placeholder="Mobile"
                onChangeText={(text) => {
                  this.setState({mobile: text});
                }}
              />
            </View>
            {this.state.mobile != ''
              ? this.showErrorMessage(this.state.mobile)
              : null} */}

            {/*************************  BILLING ADDRESS ************************** */}
            <Text style={innerStyles.shippingAddress}>Billing Address</Text>
            <View style={styles.inputView}>
              <TextInput
                textContentType="name"
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={TEXTINPUT_COLOR}
                value={this.state.billingFirstName}
                onChangeText={(text) => {
                  this.setState({billingFirstName: text});
                }}
              />
            </View>
            {this.state.billingFirstNameError != '' ? (
              this.showErrorMessage(this.state.billingFirstNameError)
            ) : (
              <View></View>
            )}
            <View style={styles.inputView}>
              <TextInput
                textContentType="name"
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={TEXTINPUT_COLOR}
                value={this.state.billingLastName}
                onChangeText={(text) => {
                  this.setState({billingLastName: text});
                }}
              />
            </View>
            {this.state.billingLastNameError != '' ? (
              this.showErrorMessage(this.state.billingLastNameError)
            ) : (
              <View></View>
            )}

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="fullStreetAddress"
                style={styles.input}
                placeholder="Street address"
                value={this.state.streetAddress}
                multiline={true}
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

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="addressCity"
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

            <View style={styles.inputView}>
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
                    return <Text style={[innerStyles.numText]}>{option}</Text>;
                  }}
                />
              </View>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="postalCode"
                style={[styles.input, innerStyles.marginStart]}
                keyboardType={'phone-pad'}
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
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="telephoneNumber"
                style={styles.input}
                placeholder="Phone number"
                keyboardType={'phone-pad'}
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

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="emailAddress"
                style={styles.input}
                keyboardType="email-address"
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
              <>
                <Text style={innerStyles.shippingAddress}>
                  Shipping Address
                </Text>
                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="name"
                    style={styles.input}
                    placeholder="First name"
                    value={this.state.s_firstName}
                    onChangeText={(text) => {
                      this.setState({s_firstName: text});
                    }}
                  />
                </View>
                {this.state.s_firstNameError != '' ? (
                  this.showErrorMessage(this.state.s_firstNameError)
                ) : (
                  <View></View>
                )}

                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="name"
                    style={styles.input}
                    placeholder="Last name"
                    value={this.state.s_lastName}
                    onChangeText={(text) => {
                      this.setState({s_lastName: text});
                    }}
                  />
                </View>
                {this.state.s_lastNameError != '' ? (
                  this.showErrorMessage(this.state.s_lastNameError)
                ) : (
                  <View></View>
                )}

                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="fullStreetAddress"
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

                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="addressCity"
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

                <View style={styles.inputView}>
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
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="postalCode"
                    style={[styles.input, innerStyles.marginStart]}
                    keyboardType={'phone-pad'}
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
                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="telephoneNumber"
                    style={styles.input}
                    placeholder="Phone number"
                    keyboardType={'phone-pad'}
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

                <View style={styles.inputView}>
                  <TextInput
                    placeholderTextColor={TEXTINPUT_COLOR}
                    textContentType="emailAddress"
                    style={styles.input}
                    placeholder="Email address"
                    keyboardType="email-address"
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
              </>
            )}
            <View style={styles.inputView}>
              <TouchableOpacity
                style={[innerStyles.input, innerStyles.uploadFileView]}
                onPress={this.displayImagePicker.bind(this)}>
                <TextInput
                  placeholderTextColor={TEXTINPUT_COLOR}
                  style={innerStyles.input}
                  editable={false}
                  multiline={true}
                  placeholder={this.state.fileSelectText}
                />
                <View style={innerStyles.uploadFile}>
                  <FastImage
                    style={innerStyles.uploadFileImage}
                    resizeMode="contain"
                    source={require('../static/uploadFile-signUp.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {this.state.salesTaxIDError != ''
              ? this.showErrorMessage(this.state.salesTaxIDError)
              : null}
            {this.state.salesTaxIDFileError != ''
              ? this.showErrorMessage(this.state.salesTaxIDFileError)
              : null}

            <Text style={styles.customTextBold}>OR</Text>
            <View style={[styles.line, innerStyles.marginView]} />

            <View style={[styles.buttonContainer, innerStyles.buttonPadding]}>
              <TouchableOpacity
                style={innerStyles.fillTaxID}
                onPress={this.handleFillOutTXId}>
                <View style={innerStyles.fillTaxView}>
                  <Text
                    style={[
                      innerStyles.customTextNormal,
                      innerStyles.buttonPadding,
                    ]}>
                    Fill out TX ID Form Online
                  </Text>

                  <FastImage
                    style={innerStyles.arrowButton}
                    resizeMode="contain"
                    source={require('../static/arrow_right.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={innerStyles.buttonSignUp}
                onPress={() => this.signUpClick()}>
                <Text style={[styles.buttonText, innerStyles.accText]}>
                  Create an account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[innerStyles.buttonAlreadyHaveAccount]}
                onPress={() => this.navigateToSignIn()}>
                <Text style={[styles.buttonText, innerStyles.buttonText]}>
                  I have an account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
  input: {
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    flex: 1,
    paddingHorizontal: 8.5,
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
  },

  customTextNormal: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    backgroundColor: '#fff',
    fontStyle: 'normal',
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
  },
  scrollViewStyles: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  errorMessageView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  accText: {
    color: '#ffffff',
  },
  buttonText: {
    color: '#2d2d2f',
    fontFamily: 'Montserrat',
  },
  arrowButton: {width: 10, height: 17, alignSelf: 'center'},
  fillTaxView: {width: '100%', flexDirection: 'row'},
  fillTaxID: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonPadding: {paddingHorizontal: 15},
  marginView: {marginTop: 10},
  uploadFileImage: {width: 35, height: 47},
  uploadFile: {alignItems: 'center', justifyContent: 'center'},
  uploadFileView: {flexDirection: 'row'},
  errorMessageText: {paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%'},
  buttonSignUp: {
    width: '100%',
    backgroundColor: '#2d2d2f',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 38,
    marginRight: 15,
    marginTop: 23,
  },
  alertFillTax: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
  },
  buttonAlreadyHaveAccount: {
    width: '100%',
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 38,
    marginRight: 15,
    marginTop: 18,
    marginBottom: 20,
  },
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
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20,
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

export default SignUp;
