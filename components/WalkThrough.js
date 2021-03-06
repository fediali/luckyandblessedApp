import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  InteractionManager,
  StatusBar,
} from 'react-native';
import Shimmer from 'react-native-shimmer';
import GlobalStyles from './Styles/Style';
import FastImage from 'react-native-fast-image';
import StoreDataAsync from '../reusableComponents/AsyncStorage/StoreDataAsync';
import Globals from '../Globals';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import Video from 'react-native-video';

const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const baseUrl = Globals.baseUrl;

export default class WalkThrough extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      images: [],
      headerText: null,
      error: null,
      isReady: false,
    };
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  navigateScreen = (screen) => () => {
    this.props.navigation.navigate(screen);
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      var promises = [];
      promises.push(GetData(baseUrl + 'api/mobile'));
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              this.setState({
                isReady: true,
                images: responses[0].home.not_logged.sliders,
                headerText: responses[0].home.not_logged.header,
              });

              this.checkPermission();
              StoreDataAsync(STORAGE_DEFAULTS, responses[0].defaults).then();
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
              Toast.show(ex.toString());
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast.show(ex.toString());
        });
    });
  }

  render() {
    var featuredImages = [];

    this.state.images.forEach((img, index) => {
      featuredImages.push(
        <FastImage
          style={styles.images}
          key={index}
          resizeMode="contain"
          source={{uri: img ? img : Globals.noImageFoundURL}}
        />,
      );
    });

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
      <SafeAreaView style={GlobalStyles.parentContainer}>
        <View style={styles.subContainer}>
          <FastImage
            style={styles.logo}
            resizeMode="contain"
            source={require('../static/logo-walkthrough.png')}
          />
          {/* <View style={styles.imageContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {featuredImages}
            </ScrollView>
          </View> */}

          {/* <View style={styles.texts}>
            <Text style={styles.newCollection}>{this.state.headerText}</Text>
            <View style={styles.youAreRegistering}>
              <Text style={styles.text1}>You are registering for a</Text>
              <View style={styles.wholeSaleAccountTV}>
                <Text style={styles.text2}>{' WHOLESALE'}</Text>
                <Text style={styles.text1}>{' account.'}</Text>
              </View>
            </View>
          </View> */}

          <Video
            source={{uri: 'https://revamp.landbw.co/storage/intro-video-1.mp4'}}
            ref={(ref) => {
              this.player = ref;
            }}
            muted={true}
            resizeMode={'cover'}
            repeat
            style={styles.video}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonRegisterNow}
              onPress={this.navigateScreen('SignUp')}>
              <Text style={styles.registerButtonText}>Register now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogIn}
              onPress={this.navigateScreen('SignIn')}>
              <Text style={styles.loginButtonText}>Log-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: '40.6%',
    height: '20.5%',
    marginTop: 25,
    // backgroundColor:"#ffe"
    // marginLeft: 128,
    // marginRight: 132.1,
  },
  imageContainer: {
    // flexDirection: 'row',
    marginTop: 10,
    marginLeft: 16,
    height: height * 0.5, //Here 0.5 means 50 percent of screen width ; setting for image container as well for the images container doesn't need the width as its horizontal scroll view
  },
  images: {
    width: width * 0.66, //Here 0.66 means 66 percent of screen width
    height: height * 0.5, //Here 0.5 means 50 percent of screen width cause direct percentage was causing issue under scrollview
    borderRadius: 6,
    // marginHorizontal: 5
    marginRight: 12,
  },
  texts: {
    // marginHorizontal: 32,
    // marginTop: 31,
    textAlign: 'center',
  },
  newCollection: {
    // width: '82.9%',
    // height: '3.6%',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
    marginTop: 10,
  },
  youAreRegistering: {
    // width: '65.9%',
    // height: '5.4%',
    marginTop: 9,
    marginHorizontal: 32,
  },
  text1: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
  },
  text2: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
  },
  wholeSaleAccountTV: {flexDirection: 'row'},
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 23,
    // marginLeft: 32,
    bottom: 30,
    position: 'absolute',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
  },

  buttonRegisterNow: {
    // width: '38.4%', no need to give height and width to button
    // height: '5.4%',
    borderRadius: 6,
    backgroundColor: '#22242a',
  },
  buttonLogIn: {
    // width: '38.4%', no need to give height and width to button
    // height: '5.4%',
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    marginLeft: 24,
    paddingTop: 11.8,
    paddingHorizontal: 46,
    paddingBottom: 13.3,
  },
  registerButtonText: {
    // width: '28.8%', no need to give height and width to button
    // height: '2.3%',
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 13,
  },
  loginButtonText: {
    // width: '13.9%', no need to give height and width to button
    // height: '2.3%',
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
  },
  footer: {
    width: '35.7%',
    height: '0.6%',
    borderRadius: 100,
    backgroundColor: '#1b1b1d',
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
});
