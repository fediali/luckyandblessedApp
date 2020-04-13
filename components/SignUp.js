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
      fileSelectText: ""
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
      this.setState({ fileSelectText: res.name })
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
              <View style={[innerStyles.input, { flexDirection: 'row' }]}>
                <TextInput
                  style={innerStyles.input}
                  placeholder="Upload Sales TX ID"
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

            <Text>{this.state.fileSelectText}</Text>
            <Text style={styles.customTextBold}>OR</Text>
            <View style={[styles.line, { marginTop: 10 }]} />

            <View style={[styles.buttonContainer, { paddingHorizontal: 15 }]}>
              <TouchableOpacity style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'space-between' }}>
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
