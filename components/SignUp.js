import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import styles from './Styles/Style';

class SignUp extends Component {
  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.subParentContainer}>
          <Image
            style={innerStyles.logoImage}
            resizeMode="contain"
            source={require('../static/logo-signIn.png')}
          />
          <Text style={innerStyles.customTextBold}>Register Now</Text>

          <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder="Full Name" />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              textContentType={'emailAddress'}
              placeholder="Email"
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Password"
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Confirm password"
            />
          </View>
          <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder="Upload Sales TX ID" />
          </View>
          <Text style={innerStyles.customTextBold}>OR</Text>
        </View>
        <View style={styles.line} />
        <View style={innerStyles.customView}>
          <View>
            <Text style={innerStyles.customTextNormal}>
              Fill out TX ID Form Online
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            {/* TODO: Check whether to apply the touchable opacity or ripple */}
            <TouchableOpacity style={innerStyles.buttonSignUp}>
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
          </View>
          <TouchableOpacity style={innerStyles.buttonAlreadyHaveAccount}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: '#2d2d2f',
                  fontFamily: "Montserrat"
                },
              ]}>
              I have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

innerStyles = StyleSheet.create({
  customTextBold: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
    marginTop: 10,
  },
  
  customTextNormal: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
    fontWeight: '600',
    marginTop: 10,
  },
  logoImage: {
    width: '20%',
    height: '15%',
    marginTop: 30,
  },
  customView: {
    flex: 1,
    paddingHorizontal: '5%',
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
    marginTop: 15,
  },
});

export default SignUp;
