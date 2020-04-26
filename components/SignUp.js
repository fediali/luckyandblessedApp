import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';

import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import LogoSmall from './Styles/LogoSmall';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
const baseUrl = 'http://dev.landbw.co/';

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
  }

  async selectOneFile() {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // console.log('res : ' + JSON.stringify(res));
      // console.log('URI : ' + res.uri);
      this.setState({fileSelectText: res.name, salesTaxIdFile: res.uri});
      console.log("DL URI: "+res.uri)

      // console.log('Type : ' + res.type);
      // console.log('File Name : ' + res.name);
      // console.log('File Size : ' + res.size);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //alert('Canceled from single doc picker');
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
      customButtons: [{ name: 'document', title: 'Upload document' }],
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
      // console.log('Response = ', response);
      console.log('uri=> ' + response.uri)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.selectOneFile()
      } else {
        // const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({fileSelectText: response.fileName, salesTaxIdFile: response.uri});
        console.log("IP URI: "+response.uri)
      }
    });
  }


  signUpClick() {
    if (this.isValid()) {
      //call signup API here
      //Splitting name to first and last name
      var fullName = this.state.fullName.split(' ');

      var data = {
        email: this.state.email,
        password: this.state.password,
        firstname: fullName[0],
        lastname: fullName[1],
        company_id: 1, //TODO: Use AsyncStorage
        is_root: 'N',
        user_type: 'C',
        status: 'A',
      };
      var promises = [];
      promises.push(PostData(baseUrl + 'api/users', data));
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              console.log(responses[0])
              if (responses[0].user_id){
                console.log("::::::::::",responses[0].user_id)
                if(this.state.salesTaxIdFile){
                  // TODO: Sent this file to api
                }else{
                  this.props.navigation.navigate("TaxID",{user_id:responses[0].user_id})
                }
                
              }
              else {
                this.setState({ emailError: 'The username or email you have chosen already exists'});
              }
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
              alert(ex);
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          alert(ex);
        });
    }
  }

  navigateToSignIn=()=>{
    this.props.navigation.navigate("SignIn") 
}

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
        console.log('Test Failed');
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

    //TODO: Uncomment this
    // if (this.state.salesTaxID == "" || this.state.salesTaxIdFile == null) {
    //   this.setState({ salesTaxIDError: "Sales tax ID or tax file is required." })
    //   validFlag = false;
    // } else {
    //   this.setState({ salesTaxIDError: "" })
    // }

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

  handleFillOutTXId=()=>{
    this.signUpClick()
  }

  navigateScreen=(screen)=>()=>{
    this.props.navigation.navigate(screen);
  }

  render() {
    return (
        <SafeAreaView style={styles.parentContainer}>
          <Header
            navigation={this.props.navigation}
            centerText={''}
            rightIcon="info"
          />
      <ScrollView contentContainerStyle={innerStyles.scrollViewStyles}>

          <View style={styles.subParentContainer}>
            <LogoSmall />
            <Text style={styles.customTextBold}>Register Now</Text>

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
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
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                textContentType={'emailAddress'}
                placeholder="Email"
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

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
              />
            </View>
            {this.state.passwordError != '' ? (
              this.showErrorMessage(this.state.passwordError)
            ) : (
                <View></View>
              )}

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Confirm password"
                onChangeText={(text) => {
                  this.setState({ confirmPassword: text });
                }}
              />
            </View>

            {this.state.confirmPasswordError != '' ? (
              this.showErrorMessage(this.state.confirmPasswordError)
            ) : (
                <View></View>
              )}
            {this.state.nonMatchingPasswordError != '' ? (
              this.showErrorMessage(this.state.nonMatchingPasswordError)
            ) : (
                <View></View>
              )}

            <View style={styles.inputView}>
              <TouchableOpacity
                style={[innerStyles.input, innerStyles.uploadFileView]}
                onPress={this.displayImagePicker.bind(this)}>
                <TextInput
                  style={innerStyles.input}
                  editable={false}
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

            {this.state.salesTaxIDError != '' ? (
              this.showErrorMessage(this.state.salesTaxIDError)
            ) : (
                <View></View>
              )}
            {this.state.salesTaxIDFileError != '' ? (
              this.showErrorMessage(this.state.salesTaxIDFileError)
            ) : (
                <View></View>
              )}

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
                onPress={this.navigateScreen("SignIn")}>
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
