import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from './Styles/Style';
import Header from "../reusableComponents/Header"
import LogoSmall from "./Styles/LogoSmall"

import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements'
const baseUrl = "http://dev.landbw.co/";

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
    color: '#2d2d2f'
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

  buttonSignUp: {
    width: '100%',
    backgroundColor: '#2d2d2f',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 38,
    marginRight: 15,
    marginTop: 15,
  },
  buttonAlreadyHaveAccount: {
    width: '100%',
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 38,
    marginRight: 15,
    marginTop: 8,
  },
});

class SignUp extends Component {
  constructor() {
    super()
    this.state = {
      fileSelectText: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      nonMatchingPasswordError: "",
      salesTaxID: "",
      salesTaxIdFile: null,
      fullNameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      salesTaxIDError: "",
      salesTaxIDFileError: ""

    }
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
      this.setState({ fileSelectText: res.name, salesTaxIdFile: res.uri })
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

  signUpClick = () => {
    if (this.isValid()) {
      //call signup API here
      //Splitting name to first and last name
      var fullName = this.state.fullName.split(' ');

      var data= {
        email: this.state.email, 
        password: this.state.password,
        firstname: fullName[0],
        lastname: fullName[1],
        company_id: 1, //TODO: Use AsyncStorage
        is_root: "N",
        user_type: "C",
        status: "A",

      }
      console.log(data)
      var promises = []
            promises.push(PostData(baseUrl + 'api/users', data))
            Promise.all(promises).then((promiseResponses) => {
                Promise.all(promiseResponses.map(res => res.json())).then((responses) => {

                  console.log(responses)
                    //TODO: A way to check for response code
                   
                }).catch(ex => { console.log("Inner Promise", ex); alert(ex); })
            }).catch(ex => { console.log("Outer Promise", ex); alert(ex); })
    }
  }

  isValid() {
    let validFlag = true;
    if (this.state.fullName == "") {
      this.setState({ fullNameError: "Full name is required." })
      validFlag = false;
    } else {
      this.setState({ fullNameError: "" })
    }

    if (this.state.email == "") {
      this.setState({ emailError: "Email is required." })
      validFlag = false;
    } else {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
      if (emailRegex.test(this.state.email) === false) {
        this.setState({ emailError: "Email is invalid." })
        validFlag = false;
      } else {
        this.setState({ emailError: "" })
      }
    }
    if ((this.state.password != this.state.confirmPassword)) {
      this.setState({ nonMatchingPasswordError: "Passwords do not match." })
      validFlag = false;
    } else {
      this.setState({ nonMatchingPasswordError: "" })
    }
    if (this.state.password == "") {
      this.setState({ passwordError: "Password is required." })
      validFlag = false;
    } else {
      let passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{7,}$/;
      if (passwordRegex.test(this.state.password) === false) {
        this.setState({ passwordError: "Password must contain atleast one upper case, one lower case, one numeric charachter, and more than or equal to 7 characters long." })
        validFlag = false
        console.log("Test Failed");
      } else {
        this.setState({ passwordError: "" })
      }
    }

    if (this.state.confirmPassword == "") {
      this.setState({ confirmPasswordError: "Confirm password is required." })
      validFlag = false;
    } else {
      this.setState({ confirmPasswordError: "" })
    }

    // if (this.state.salesTaxID == "" || this.state.salesTaxIdFile == null) {
    //   this.setState({ salesTaxIDError: "Sales tax ID or tax file is required." })
    //   validFlag = false;
    // } else {
    //   this.setState({ salesTaxIDError: "" })
    // }

    return validFlag
  }

  showErrorMessage(errorMessage) {
    return (
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 15 }}>
        <Icon size={30} name='md-information-circle-outline' type='ionicon' color='#FF0000' />
        <Text style={{ paddingHorizontal: 10, color: '#FF0000',maxWidth: '93%' }}>{errorMessage}</Text>
      </View>
    )
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#fff",
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <SafeAreaView style={styles.parentContainer}>
          <Header navigation={this.props.navigation} centerText={""} rightIcon="info" />

          <View style={styles.subParentContainer}>
            <LogoSmall />
            <Text style={styles.customTextBold}>Register Now</Text>

            <View style={styles.inputView}>
              <TextInput style={styles.input} placeholder="Full Name" onChangeText={(text) => { this.setState({ fullName: text }) }} />
            </View>
            {this.state.fullNameError != "" ? this.showErrorMessage(this.state.fullNameError) : <View></View>}
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                textContentType={'emailAddress'}
                placeholder="Email"
                onChangeText={(text) => { this.setState({ email: text }) }}
              />
            </View>
            {this.state.emailError != "" ? this.showErrorMessage(this.state.emailError) : <View></View>}

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={(text) => { this.setState({ password: text }) }}

              />
            </View>
            {this.state.passwordError != "" ? this.showErrorMessage(this.state.passwordError) : <View></View>}

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Confirm password"
                onChangeText={(text) => { this.setState({ confirmPassword: text }) }}
              />
            </View>

            {this.state.confirmPasswordError != "" ? this.showErrorMessage(this.state.confirmPasswordError) : <View></View>}
            {this.state.nonMatchingPasswordError != "" ? this.showErrorMessage(this.state.nonMatchingPasswordError) : <View></View>}

            <View style={styles.inputView}>
              <View style={[innerStyles.input, { flexDirection: 'row' }]}>
                <TextInput
                  style={innerStyles.input}
                  placeholder="Upload Sales TX ID"
                  onChangeText={(text) => { this.setState({ salesTaxID: text }) }}
                />
                <TouchableOpacity
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                  onPress={this.selectOneFile.bind(this)}
                >
                  <Image
                    style={{ width: 35, height: 47 }}
                    resizeMode="contain"
                    source={require('../static/uploadFile-signUp.png')}
                  />

                </TouchableOpacity>

              </View>
            </View>

            {this.state.salesTaxIDError != "" ? this.showErrorMessage(this.state.salesTaxIDError) : <View></View>}
            {this.state.salesTaxIDFileError != "" ? this.showErrorMessage(this.state.salesTaxIDFileError) : <View></View>}


            <Text>{this.state.fileSelectText}</Text>
            <Text style={styles.customTextBold}>OR</Text>
            <View style={[styles.line, { marginTop: 10 }]} />

            <View style={[styles.buttonContainer, { paddingHorizontal: 15 }]}>
              <TouchableOpacity style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'space-between' }} onPress={() => { this.props.navigation.navigate("TaxID") }}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <Text
                    style={[
                      innerStyles.customTextNormal,
                      { paddingHorizontal: 15 },
                    ]}>
                    Fill out TX ID Form Online
                  </Text>
                  {/*TODO: replace this image with right arrow*/}

                  <Image
                    style={{ width: 10, height: 17, alignSelf: 'center' }}
                    resizeMode="contain"
                    source={require('../static/arrow_right.png')}
                  />
                </View>
              </TouchableOpacity>
              {/* TODO: Check whether to apply the touchable opacity or ripple */}
              <TouchableOpacity style={innerStyles.buttonSignUp} onPress={() => this.signUpClick()}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: '#ffffff',
                    },
                  ]}>
                  Create an account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[innerStyles.buttonAlreadyHaveAccount]} onPress={() => { this.props.navigation.navigate("SignIn") }}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: '#2d2d2f',
                      fontFamily: 'Montserrat',
                    },
                  ]}>
                  I have an account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}


export default SignUp;
