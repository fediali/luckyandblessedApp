import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';

export default class WalkThrough extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    var featuredImagesList = [
      '../static/demoimg1-walkthrough.png',
      '../static/demoimg2-walkthrough.png',
    ];
    var featuredImages = [];

    featuredImagesList.forEach((img, index) => {
      console.log(img.toString());
      featuredImages.push(
        <Image
          style={styles.images}
          key={index}
          resizeMode="contain"
          source={require('../static/demoimg1-walkthrough.png')} //TODO: Fix this
        />,
      );
    });

    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../static/logo-walkthrough.png')}
          />
          <View style={styles.imageContainer}>
            <ScrollView horizontal={true}>{featuredImages}</ScrollView>
          </View>
          <View style={styles.texts}> 
            <Text style={styles.newCollection}>New Collection</Text>
            <Text style={styles.youAreRegistering}>
                You are registering for a WHOLESALE account.
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            {/* TODO: Check whether to apply the touchable opacity or ripple */}
            <TouchableOpacity style={styles.buttonRegisterNow}>
              <Text style={styles.buttonText}>Register now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogIn}>
              <Text style={styles.buttonText}>Log-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: wp('30.6%'),
    height: hp('10.5%'),
    marginTop: 17.3,
    marginLeft: 42.7,
    marginRight: 44,
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 3.3,
    marginLeft: 5.3,
  },
  images: {
    width: wp('66.7%'),
    height: hp('44.5%'),
    borderRadius: 2,
    marginRight: 4,
  },
  texts: {
    marginHorizontal: 10.7,
    marginTop: 10.3,

  },
  newCollection: {
    width: 103.7,
    height: 9.7,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 8,
    fontStyle: 'normal',
    lineHeight: 9.3,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
  },
  youAreRegistering: {
    width: 82.3,
    height: 14.7,
    fontFamily: 'Avenir-Heavy',
    fontSize: 5.3,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 7.3,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
    marginTop: 3,
    marginHorizontal: 10.7
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 7.7,
    marginLeft: 10.7
  },
  buttonRegisterNow: {
    width: 48,
    height: 14.7,
    borderRadius: 2,
    backgroundColor: '#22242a',
    paddingTop: 4,
    paddingHorizontal: 6,
    paddingBottom: 4.3
  },
  buttonLogIn: {
    backgroundColor: '#2967ff',
    borderRadius: 6,
    marginLeft: 8,
    paddingTop: 3.9,
    paddingHorizontal: 15.3,
    paddingBottom: 4.4
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
});
