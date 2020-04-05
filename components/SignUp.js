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
import Header from "./Header"
import LogoSmall from "./Styles/LogoSmall"

import { SafeAreaView } from 'react-native-safe-area-context';


const innerStyles = StyleSheet.create({
  

  customTextNormal: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    fontStyle: 'normal',
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
    marginTop: 10,
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
  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor:"#fff",
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <SafeAreaView style={styles.parentContainer}>
        <Header centerText={""} rightIcon= "info"/>

          <View style={styles.subParentContainer}>
            <LogoSmall/>
            <Text style={styles.customTextBold}>Register Now</Text>

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
            {/*TODO: replace this image with right arrow*/}

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="Upload Sales TX ID"
              />
              <Image
                style={{ width: 70, height: 50 }}
                resizeMode="contain"
                source={require('../static/logo-signIn.png')}
              />
            </View>
            <Text style={styles.customTextBold}>OR</Text>
            <View style={[styles.line, { marginTop: 10 }]} />

            <View style={[styles.buttonContainer, { paddingHorizontal: 15 }]}>
              <TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      innerStyles.customTextNormal,
                      { paddingHorizontal: 15 },
                    ]}>
                    Fill out TX ID Form Online
                  </Text>
                  {/*TODO: replace this image with right arrow*/}

                  <Image
                    style={{ width: 70, height: 50 }}
                    resizeMode="contain"
                    source={require('../static/logo-signIn.png')}
                  />
                </View>
              </TouchableOpacity>
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
              <TouchableOpacity style={[innerStyles.buttonAlreadyHaveAccount]}>
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
