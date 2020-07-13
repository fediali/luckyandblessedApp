import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import md5 from 'react-native-md5';
import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import LogoSmall from './Styles/LogoSmall';
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Globals from '../Globals';
var RNFS = require('react-native-fs');

const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

const baseUrl = Globals.baseUrl;

let DEFAULTS_OBJ = [];

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      fileSelectText: 'Upload Sales TX ID',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      nonMatchingPasswordError: '',
      salesTaxID: '',
      salesTaxIdFile: null,
      fullNameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      salesTaxIDError: '',
      salesTaxIDFileError: '',
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
        this.setState({})
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
      customButtons: [{ name: 'document', title: 'Upload PDF file' }],
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
        if (Platform.OS === "ios") {
          path = "~" + path.substring(path.indexOf("/Documents"));
        }
        if (!response.fileName) response.fileName = path.split("/").pop() + ".jpg";

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
    if (this.isValid()) {
      this.setState({ emailError: '' });
      //call signup API here
      //Splitting name to first and last name
      let fname = ''
      let lname = ''
      if (this.state.fullName.split(' ').length > 1) {
        fname = this.state.fullName.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
        lname = this.state.fullName.split(' ').slice(-1).join(' ');

      } else {
        fname = this.state.fullName
      }

      var data = {
        email: this.state.email,
        // password: md5.hex_md5(this.state.password), //SignUp doesn't require password to be hashed now :/
        password: this.state.password,
        firstname: fname,
        lastname: lname,
        company_id: DEFAULTS_OBJ.store_id.toString(),
        company_name: "Mediagate",
        is_root: 'N',
        user_type: 'C',
        status: 'A',
      };

      // var promises = [];
      if (this.state.salesTaxIdFile) {
        PostData(baseUrl + 'api/users', data)
          .then((res) => res.json())
          .then((response) => {
            if (response.user_id) {
              let taxIdData = {
                user_id: response.user_id,
                company_id: DEFAULTS_OBJ.store_id.toString(),
                taxid_file: this.state.fileBase64,
              };

              PostData(baseUrl + 'api/salestaxid', taxIdData)
                .then((res) => res.json())
                .then((response) => {
                  if (response.tax_id) {
                    Toast.show('Registered Successfully');
                    this.props.navigation.navigate('SignIn'); //Passing user Name
                    let subsData = {
                      "email": data.email,
                      "name": data.firstname + " " + data.lastname,
                      "company_id": data.company_id
                    }
                    PostData(baseUrl + "api/subscribe", subsData)
                      .then(res => res.json())
                      .then((response => {
                        if (response.subscriber_id) {
                          // console.log("Subscribed to newsletter Successfully")
                        }
                      }))
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
              if (showAlert)
                this.alertUser(baseUrl + 'api/users', data);
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
          }).catch(e => Toast.show(e.toString()));
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
          style: 'cancel'
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
      { cancelable: false },
    );
  };

  navigateToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  isValid() {
    let validFlag = true;
    if (this.state.fullName == '') {
      this.setState({ fullNameError: 'Full name is required.' });
      validFlag = false;
    } else {
      this.setState({ fullNameError: '' });
    }

    if (this.state.email == '') {
      this.setState({ emailError: 'Email is required.' });
      validFlag = false;
    } else {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
      if (emailRegex.test(this.state.email) === false) {
        this.setState({ emailError: 'Email is invalid.' });
        validFlag = false;
      } else {
        this.setState({ emailError: '' });
      }
    }
    if (this.state.password != this.state.confirmPassword) {
      this.setState({ nonMatchingPasswordError: 'Passwords do not match.' });
      validFlag = false;
    } else {
      this.setState({ nonMatchingPasswordError: '' });
    }
    if (this.state.password == '') {
      this.setState({ passwordError: 'Password is required.' });
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
        this.setState({ passwordError: '' });
      }
    }

    if (this.state.confirmPassword == '') {
      this.setState({ confirmPasswordError: 'Confirm password is required.' });
      validFlag = false;
    } else {
      this.setState({ confirmPasswordError: '' });
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
                placeholder="Full Name"
                autoCapitalize="words"
                onChangeText={(text) => {
                  this.setState({ fullName: text });
                }}
              />
            </View>
            {this.state.fullNameError != ''
              ? this.showErrorMessage(this.state.fullNameError)
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
                  this.setState({ email: text.trim() });
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
                secureTextEntry={true}
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
              />
            </View>
            {this.state.passwordError != ''
              ? this.showErrorMessage(this.state.passwordError)
              : null}

            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                textContentType="password"
                style={styles.input}
                secureTextEntry={true}
                autoCapitalize="none"
                placeholder="Confirm password"
                onChangeText={(text) => {
                  this.setState({ confirmPassword: text });
                }}
              />
            </View>

            {this.state.confirmPasswordError != ''
              ? this.showErrorMessage(this.state.confirmPasswordError)
              : null}
            {this.state.nonMatchingPasswordError != ''
              ? this.showErrorMessage(this.state.nonMatchingPasswordError)
              : null}

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
  arrowButton: { width: 10, height: 17, alignSelf: 'center' },
  fillTaxView: { width: '100%', flexDirection: 'row' },
  fillTaxID: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonPadding: { paddingHorizontal: 15 },
  marginView: { marginTop: 10 },
  uploadFileImage: { width: 35, height: 47 },
  uploadFile: { alignItems: 'center', justifyContent: 'center' },
  uploadFileView: { flexDirection: 'row' },
  errorMessageText: { paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%' },
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
    borderRadius: 6
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
});

export default SignUp;
