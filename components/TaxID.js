import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
} from 'react-native';

import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import SignatureCapture from 'react-native-signature-capture';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import LogoSmall from './Styles/LogoSmall';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Globals from '../Globals';
import Shimmer from 'react-native-shimmer';
import FastImage from 'react-native-fast-image';
import GetData from '../reusableComponents/API/GetData';
import GlobalStyles from './Styles/Style';
import {WebView} from 'react-native-webview';

const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const baseUrl = Globals.baseUrl;
const STORAGE_USER = Globals.STORAGE_USER;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

let DEFAULTS_OBJ = [];
let user = null;
class TaxID extends Component {
  constructor(props) {
    super(props);

    var dateToday = new Date();
    var dd = String(dateToday.getDate()).padStart(2, '0');
    var mm = String(dateToday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateToday.getFullYear();
    dateToday = mm + ' - ' + dd + ' - ' + yyyy;
    this.state = {
      newValue1: '',
      newValue2: '',
      height1: 40,
      height2: 40,
      nameOfPurchase: '',
      nameOfPurchaseError: '',
      phone: '',
      phoneError: '',
      address: '',
      addressError: '',
      address2: '',
      address2Error: '',
      texasSales: '',
      texasSalesError: '',
      outOfState: '',
      outOfStateError: '',
      mexicoRegistrationError: '',
      description: '',
      descriptionError: '',
      sign: false,
      signError: '',
      signImage: '', //base64 encoded
      defaults: null,
      dateToday: dateToday,
      isReady: true,
      fromUserProfile: false,
      isEditable: true,
    };
  }

  componentDidMount() {
    // if (this.props.route.params.fromUserProfile) {
    this.setState({isReady: false, fromUserProfile: true, isEditable: false});
    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
        DEFAULTS_OBJ = JSON.parse(defaults);
      });

      this.getTaxId();
    });
    if (this.getTaxId()) {
      this.getTaxId();
    } else {
      RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
        DEFAULTS_OBJ = JSON.parse(defaults);
      });
    }
  }

  getTaxId = async () => {
    RetrieveDataAsync(STORAGE_USER).then((user_data) => {
      user = JSON.parse(user_data);
      let url =
        baseUrl +
        `/api/salestaxid/${
          user.user_id
        }&company_id=${DEFAULTS_OBJ.store_id.toString()}`;
      GetData(url)
        .then((res) => res.json())
        .then((taxIdData) => {
          if (!taxIdData.taxid_file) {
            this.setState({
              nameOfPurchase: taxIdData.name,
              phone: taxIdData.phone,
              address: taxIdData.address,
              address2: taxIdData.address2,
              texasSales: taxIdData.tax_number,
              outOfState: taxIdData.registration_number,
              description: taxIdData.business_description,
              dateToday: taxIdData.date,
              signImage: taxIdData.signature,
              isReady: true,
            });
          } else {
            this.setState({
              showWebView: true,
              taxIdUrl: baseUrl + taxIdData.taxid_file,
              isReady: true,
            });
          }
        });
    });
  };

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  //this will save the signature as an image in internal storage of user
  saveSign() {
    this.refs['sign'].saveImage();
  }

  resetSign() {
    this.setState({sign: false});
    this.refs['sign'].resetImage();
  }

  _onSaveEvent = (result) => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name

    this.setState({
      signImage: 'data:image/png;base64,' + result.encoded.toString(),
    });
  };
  _onDragEvent() {
    // This callback will be called when the user enters signature
    this.setState({sign: true});
  }

  submitClick = () => {
    return this.props.route.params.fromUserProfile;
    if (this.props.route.params.fromUserProfile)
      this.props.navigation.navigate('UserProfile');
    //Passing user Name
    else if (this.isValid()) {
      this.refs['sign'].saveImage();
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;

      PostData(this.props.route.params.url, this.props.route.params.data)
        .then((res) => res.json())
        .then((response) => {
          setTimeout(() => this.callAPI(today, response.user_id), 500);
        })
        .catch((ex) => {
          console.log('Promise exception', ex);
          Toast.show(ex.toString());
        });

      //The timeout below is because of signImage (As calling saveImage triggers the onSave where setState is done)
    }
  };

  callAPI(today, user_id) {
    const data = {
      name: this.state.nameOfPurchase,
      phone: this.state.phone,
      address: this.state.address,
      address2: this.state.address2,
      tax_number: this.state.texasSales,
      registration_number: this.state.outOfState,
      products_description: this.state.description,
      business_description: this.state.description,
      title: this.state.nameOfPurchase,
      date: today,
      signature: this.state.signImage,
      user_id: user_id,
      company_id: DEFAULTS_OBJ.store_id.toString(),
      timestamp: +new Date(),
    };

    PostData(baseUrl + 'api/salestaxid', data)
      .then((res) => res.json())
      .then((response) => {
        Toast.show('Registered Successfully');
        this.props.navigation.navigate('SignIn'); //Passing user Name
      })
      .catch((err) => {
        Toast.show(err.toString());
        console.log(err);
      });
  }

  isValid() {
    let validFlag = true;
    if (this.state.nameOfPurchase == '') {
      this.setState({
        nameOfPurchaseError: 'Name of purchase,firm or agence is required.',
      });
      validFlag = false;
    } else {
      this.setState({nameOfPurchaseError: ''});
    }

    if (this.state.phone == '') {
      this.setState({phoneError: 'Phone is required.'});
      validFlag = false;
    } else {
      this.setState({phoneError: ''});
    }

    if (this.state.address == '') {
      this.setState({
        addressError: 'Address is required.',
      });
      validFlag = false;
    } else {
      this.setState({addressError: ''});
    }

    if (this.state.address2 == '') {
      this.setState({
        address2Error: 'City, State, Zip code is required.',
      });
      validFlag = false;
    } else {
      this.setState({addressError: ''});
    }

    if (this.state.texasSales == '' && this.state.outOfState == '') {
      this.setState({
        texasSalesError:
          'Texas sales or out-of-state taxpay number is required.',
        outOfStateError: 'Out-of-state or Federal Texpay number is required.',
      });
      validFlag = false;
    } else {
      this.setState({texasSalesError: '', outOfStateError: ''});
    }

    // if (this.state.outOfState == '') {
    //   this.setState({
    //     outOfStateError: 'Out-of-state or Federal Texpay number is required.',
    //   });
    //   validFlag = false;
    // } else {
    //   this.setState({outOfStateError: ''});
    // }

    if (this.state.description == '') {
      this.setState({descriptionError: 'Description of buisness is required.'});
      validFlag = false;
    } else {
      this.setState({descriptionError: ''});
    }

    if (this.state.sign == false) {
      this.setState({signError: 'Your signature is required.'});
      validFlag = false;
    } else {
      this.setState({signError: ''});
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
  render() {
    const {value1, _, height1, __} = this.state;
    const {___, value2, ____, height2} = this.state;

    let newStyle1 = {
      height1,
    };
    let newStyle2 = {
      height2,
    };
    if (!this.state.isReady) {
      return (
        <View style={GlobalStyles.loader}>
          <Shimmer>
            <FastImage
              style={GlobalStyles.logoImageLoader}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.parentContainer}>
        {/* <Header navigation={this.props.navigation} /> */}
        <ScrollView contentContainerStyle={innerStyles.scrollViewStyles}>
          <View style={[styles.parentContainer, innerStyles.scrollMargin]}>
            <View style={innerStyles.logoView}>
              <FastImage
                source={require('../static/logo-main.png')}
                style={innerStyles.logomain}
                resizeMode="contain"
              />
            </View>
            <View style={styles.subParentContainer}>
              {/* <LogoSmall /> */}

              {/* keyboardType={Device.isAndroid ? "numeric" : "number-pad"}
               */}
              {/* <Text style={[styles.customTextBold, innerStyles.textMargin]}>
                Use & Sale Tax Form
              </Text> */}

              <View style={{...innerStyles.tabContainer}}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('UserProfile')}
                  style={innerStyles.activeTab}>
                  <Text style={innerStyles.inactiveTabText}>PROFILE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => this.setState({activeTab: 0})}
                  style={innerStyles.activeTab}>
                  <Text style={innerStyles.activeTabText}>TAX ID</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('TrackOrders')}
                  style={innerStyles.activeTab}>
                  <Text style={innerStyles.inactiveTabText}>MY ORDERS</Text>
                </TouchableOpacity>
              </View>
              {this.state.taxIdUrl ? (
                <View style={{flex: 1}}>
                  <View style={{flex: 10, marginBottom: 20}}>
                    <WebView source={{uri: this.state.taxIdUrl}}></WebView>
                  </View>
                  <Text style={styles.input}>
                    TaxID form is being downloaded
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      style={styles.input}
                      editable={this.state.isEditable}
                      placeholder="Name of purchaser, firm or agence"
                      value={this.state.nameOfPurchase}
                      onChangeText={(text) => {
                        this.setState({nameOfPurchase: text});
                      }}
                    />
                  </View>
                  {this.state.nameOfPurchaseError != ''
                    ? this.showErrorMessage(this.state.nameOfPurchaseError)
                    : null}

                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="telephoneNumber"
                      style={styles.input}
                      editable={this.state.isEditable}
                      placeholder="Phone"
                      value={this.state.phone}
                      keyboardType="phone-pad"
                      onChangeText={(text) => {
                        this.setState({phone: text});
                      }}
                    />
                  </View>
                  {this.state.phoneError != ''
                    ? this.showErrorMessage(this.state.phoneError)
                    : null}

                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="fullStreetAddress"
                      style={styles.input}
                      editable={this.state.isEditable}
                      value={this.state.address}
                      placeholder="Address"
                      onChangeText={(text) => {
                        this.setState({address: text});
                      }}
                    />
                  </View>
                  {this.state.addressError != ''
                    ? this.showErrorMessage(this.state.addressError)
                    : null}

                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      textContentType="postalCode"
                      style={styles.input}
                      editable={this.state.isEditable}
                      value={this.state.address2}
                      placeholder="City, State, ZIP code"
                      onChangeText={(text) => {
                        this.setState({address2: text});
                      }}
                    />
                  </View>
                  {this.state.address2Error != ''
                    ? this.showErrorMessage(this.state.address2Error)
                    : null}

                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      style={styles.input}
                      editable={this.state.isEditable}
                      placeholder="Texas sales & Use Tax Permit Num"
                      keyboardType={'phone-pad'}
                      value={this.state.texasSales}
                      onChangeText={(text) => {
                        this.setState({texasSales: text});
                      }}
                    />
                  </View>
                  {this.state.texasSalesError != ''
                    ? this.showErrorMessage(this.state.texasSalesError)
                    : null}

                  <View style={styles.inputView}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      style={styles.input}
                      editable={this.state.isEditable}
                      placeholder="Out-of-state or Fedral Taxpay Num"
                      keyboardType={'phone-pad'}
                      value={this.state.outOfState}
                      onChangeText={(text) => {
                        this.setState({outOfState: text});
                      }}
                    />
                  </View>
                  {this.state.outOfStateError != ''
                    ? this.showErrorMessage(this.state.outOfStateError)
                    : null}

                  <Text style={[innerStyles.customText1]}>
                    I, the purchaser named above, claim the right to make a
                    non-taxable purchase (for resale of the taxable items
                    described below or on the attached order or invoice) from:
                  </Text>
                  <Text
                    style={[
                      innerStyles.customText1,
                      innerStyles.customTextMargin,
                    ]}>
                    <Text
                      style={[
                        styles.customTextBold,
                        innerStyles.titleFontSize,
                      ]}>
                      L&B
                    </Text>{' '}
                    - 12801 N STEMMONS FWY STE 710 FARMERS BRANCH, TX 75234
                  </Text>
                  <View style={innerStyles.divider}></View>
                  <Text
                    style={[
                      innerStyles.customTextBoldSmall,
                      innerStyles.customTextMargin,
                    ]}>
                    Description of the type of business activity generally
                    engaged in or type of items normally sold by the purchaser:
                  </Text>

                  <View
                    style={[
                      innerStyles.customInputView,
                      innerStyles.customPadding,
                    ]}>
                    <TextInput
                      placeholderTextColor={TEXTINPUT_COLOR}
                      placeholder="Type here"
                      editable={this.state.isEditable}
                      value={this.state.description}
                      onChangeText={(value1) =>
                        this.setState({description: value1})
                      }
                      style={[innerStyles.customInput]}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        this.updateSize(e.nativeEvent.contentSize.height)
                      }></TextInput>
                  </View>
                  {this.state.descriptionError != ''
                    ? this.showErrorMessage(this.state.descriptionError)
                    : null}

                  <Text
                    style={[
                      innerStyles.customTextBoldSmall,
                      innerStyles.customTextMargin,
                    ]}>
                    This certificate should be furnished to the supplier. Do not
                    send the completed certificate to the Comptroller of Public
                    Accounts.
                  </Text>
                  {this.state.isEditable && (
                    <View
                      style={[
                        innerStyles.customInputView,
                        innerStyles.customDim,
                      ]}>
                      <View style={innerStyles.customView}>
                        <Text style={innerStyles.signText}>Sign Below:</Text>
                        <TouchableOpacity onPress={this.resetSign.bind(this)}>
                          <Text style={innerStyles.resetSignature}>Reset</Text>
                        </TouchableOpacity>
                      </View>
                      <SignatureCapture
                        style={innerStyles.signCap}
                        ref="sign"
                        showBorder={true}
                        backgroundColor={'#f6f6f6'}
                        contentSize="10"
                        onSaveEvent={this._onSaveEvent}
                        onDragEvent={this._onDragEvent.bind(this)}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={true}
                        viewMode={'portrait'}
                        maxStrokeWidth={8}
                        minStrokeWidth={7}
                      />
                      {this.state.signError != ''
                        ? this.showErrorMessage(this.state.signError)
                        : null}
                    </View>
                  )}

                  <Text
                    style={[
                      innerStyles.customTextBoldSmall,
                      innerStyles.dateText,
                    ]}>
                    Date: {this.state.dateToday}
                  </Text>
                </>
              )}
              <View style={[styles.buttonContainer, innerStyles.buttonView]}>
                <TouchableOpacity
                  style={[innerStyles.buttonSubmit]}
                  onPress={this.submitClick}>
                  {this.state.fromUserProfile ? (
                    <Text style={[styles.buttonText, innerStyles.submitText]}>
                      Go Back
                    </Text>
                  ) : (
                    <Text style={[styles.buttonText, innerStyles.submitText]}>
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;

const innerStyles = StyleSheet.create({
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logomain: {
    width: '50%',
    height: 100,
  },
  inactiveTabText: {
    fontSize: 15,
    color: '#ccc',
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  activeTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  activeTabText: {
    color: '#000',
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold',
  },
  customText1: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
    paddingHorizontal: 30,
  },
  customTextBoldSmall: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: '#2d2d2f',
    paddingHorizontal: 30,
    marginTop: 5,
  },
  customInputView: {
    height: 130,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  errorMessageView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  errorMessageText: {paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%'},
  customInput: {
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
    flexWrap: 'wrap',
  },
  scrollViewStyles: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  titleFontSize: {fontSize: 20},
  scrollMargin: {marginBottom: 38},
  textMargin: {marginTop: 20},
  customTextMargin: {marginTop: 15},
  customPadding: {paddingHorizontal: 30},
  customDim: {height: 240, paddingHorizontal: 30},
  customView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: '#2d2d2f',
    marginTop: 5,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 20,
  },
  buttonView: {
    paddingHorizontal: 30,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {width: '100%', textAlign: 'left'},
  signCap: {borderRadius: 6, borderColor: '#000', flex: 1},
  buttonSubmit: {
    width: '60%',
    backgroundColor: '#000000',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginTop: 15,
    height: Height * 0.009,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  resetSignature: {
    fontFamily: 'Avenir-Book',
    fontSize: 12,
    lineHeight: 24,
    color: '#2967FF',
  },
});

export default TaxID;
