import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {Icon} from 'react-native-elements';
import PostData from '../reusableComponents/API/PostData';
import Toast from 'react-native-simple-toast';
import GetData from '../reusableComponents/API/GetData';
import AsyncStorage from '@react-native-community/async-storage';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Globals from '../Globals';
import ThemeContext from '../reusableComponents/ThemeContext';
import PutData from '../reusableComponents/API/PutData';
import LogoSmall from './Styles/LogoSmall';
import FastImage from 'react-native-fast-image';

const baseUrl = Globals.baseUrl;

const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

// This Component is the Actual SignIn screen / Different from WalkThrough screen that will the intial screen(Greeting Screen)
// Naming Conventions for assets camelCase = **assetName-componentName**

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      requested: false,
      isPasswordVisible: false,
    };
  }
  static contextType = ThemeContext;

  _storeData = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  signInClick = () => {
    if (this.isValid()) {
      var promises = [];
      this.setState({requested: true});
      promises.push(
        PostData(baseUrl + 'api/usertoken', {
          email: this.state.email,
          password: this.state.password,
        }),
      );
      promises.push(GetData(baseUrl + `api/users?email=${this.state.email}`));
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              if (responses[0].token) {
                Toast.show('Login Successful');
                var fullName =
                  responses[1].users[0].firstname +
                  ' ' +
                  responses[1].users[0].lastname;
                var user = {
                  user_id: responses[1].users[0].user_id,
                  name: fullName,
                  email: this.state.email.trim(),
                };

                this._storeData(user);

                this.putFcmToken(user);

                this.context.setAuthenticated(fullName);
                this.setState({requested: false});
              } else {
                Toast.show('Username or password incorrect', Toast.LONG);
                this.setState({requested: false});
              }
            })
            .catch((ex) => {
              console.log('Inner Promise signin', ex);
              Toast.show(ex.toString());
            });
        })
        .catch((ex) => {
          console.log('Outer Promise signin', ex);
          Toast.show(ex.toString());
        });
    }
  };

  putFcmToken = async (user) => {
    let data = {
      firebase_id: await RetrieveDataAsync(Globals.STORAGE_FCM_TOKEN),
    };
    console.log('Firebase Token', data.firebase_id);
    let res = await PutData(
      Globals.baseUrl + `api/usersnew/${user.user_id}`,
      data,
    );
    let putResponse = await res.json();
    console.log(putResponse);
  };

  isValid() {
    let validFlag = true;

    if (this.state.email == '') {
      this.setState({emailError: 'Email is required.'});
      validFlag = false;
    } else {
      this.setState({emailError: ''});
    }

    if (this.state.password == '') {
      this.setState({passwordError: 'Password is required.'});
      validFlag = false;
    } else {
      this.setState({passwordError: ''});
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

  callForgetPasswordApi = () => {
    if (this.state.email) {
      Toast.show('Processing request..', Toast.LONG);
      data = {
        email: this.state.email,
      };
      PostData(baseUrl + `api/resetpasswordnew`, data)
        .then((res) => res.text())
        .then((response) => {
          Toast.show('Check you email inbox to set new password.');
        });
    } else {
      Toast.show('Input your email in email box.');
    }
  };
  handlePasswordView = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <View style={styles.bgView}>
          <FastImage
            style={styles.bgImage}
            resizeMode="cover"
            source={require('../static/loginBg.png')}
          />
        </View>
        <Text style={styles.welcomeText}>
          Welcome! Sign in or create an account to checkout, access order
          history and more.
        </Text>
        <View style={styles.subContainer}>
          {/* <LogoSmall /> */}
          {/* <Image
            style={{
              width: '53%',
              height: '35%',
              marginBottom: 20,
            }}
            resizeMode=""
            source={require('../static/logo-signIn.png')}
          /> */}

          <View style={styles.emailInputView}>
            <TextInput
              placeholderTextColor={TEXTINPUT_COLOR}
              textContentType="emailAddress"
              keyboardType="email-address"
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              returnKeyType="done"
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
          <View style={styles.passwordInputView}>
            <TextInput
              placeholderTextColor={TEXTINPUT_COLOR}
              textContentType="password"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry={!this.state.isPasswordVisible}
              placeholder="Password"
              returnKeyType="done"
              onChangeText={(text) => {
                this.setState({password: text});
              }}
            />
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={this.handlePasswordView}>
              <Icon
                size={22}
                name={this.state.isPasswordVisible ? 'md-eye' : 'md-eye-off'}
                type="ionicon"
                color="#2d2d2f"
              />
            </TouchableOpacity>
          </View>
          {this.state.passwordError != '' ? (
            this.showErrorMessage(this.state.passwordError)
          ) : (
            <View></View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonSignUp}
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}>
              <Text style={styles.buttonText}>JOIN NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSignIn}
              onPress={() => {
                this.signInClick();
              }}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.callForgetPasswordApi();
            }}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          {this.state.requested ? (
            <ActivityIndicator
              style={{marginTop: 30}}
              size="large"
              color="#1bbfc7"
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  welcomeText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginVertical: 25,
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
  bgView: {
    height: '54%',
    width: '100%',
  },
  errorTextMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  errorTextText: {paddingHorizontal: 10, color: '#FF0000', maxWidth: '93%'},
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f6f6f6',
    flex: 1,
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    // lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
    paddingVertical: 11,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  buttonSignUp: {
    backgroundColor: '#000',
    paddingVertical: 11,
    paddingHorizontal: 38,
    marginRight: 15,
  },
  buttonSignIn: {
    backgroundColor: '#000',
    paddingVertical: 11,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  forgotPassword: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#1bbfc7',
    marginTop: 20,
  },
  passwordInputView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#f6f6f6',
    marginHorizontal: 25,
    alignItems: 'center',
  },
  emailInputView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '#f6f6f6',
    marginHorizontal: 25,
  },
});

export default SignIn;
