import React, { Component } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity, Dimensions,SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class WalkThrough extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    var featuredImagesList = [
      require('../static/demoimg1-walkthrough.png'),
      require('../static/demoimg2-walkthrough.png'),
    ];
    var featuredImages = [];

    featuredImagesList.forEach((img, index) => {
      //   console.log(img.toString());
      featuredImages.push(
        <Image
          style={styles.images}
          key={index}
          resizeMode="contain"
          source={img} //TODO: Fix this
        />,
      );
    });

    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../static/logo-walkthrough.png')}
          />
          <View style={styles.imageContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {featuredImages}
            </ScrollView>
          </View>
          <View style={styles.texts}>
            <Text style={styles.newCollection}>New Collection</Text>
            <View style={styles.youAreRegistering}>
              <Text style={styles.text1}>
                You are registering for a
                </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text2}>
                  WHOLESALE
                </Text>
                <Text style={styles.text1}>
                  {" account"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonRegisterNow}>
              <Text style={styles.registerButtonText}>Register now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogIn}>
              <Text style={styles.loginButtonText}>Log-in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    );
  }
}

const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
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
    width: '30.6%',
    height: '10.5%',
    marginTop: 15,
    // backgroundColor:"#ffe"
    // marginLeft: 128,
    // marginRight: 132.1,
  },
  imageContainer: {
    // flexDirection: 'row',
    marginTop: 10,
    height: height * 0.5, //Here 0.5 means 50 percent of screen width ; setting for image container as well for the images container doesn't need the width as its horizontal scroll view
  },
  images: {
    width: width * 0.66, //Here 0.66 means 66 percent of screen width 
    height: height * 0.5, //Here 0.5 means 50 percent of screen width cause direct percentage was causing issue under scrollview
    borderRadius: 6,
    marginHorizontal: 5
    // marginRight: 12,
  },
  texts: {
    // marginHorizontal: 32,
    // marginTop: 31,
    textAlign: "center",
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
    marginTop:10
  },
  youAreRegistering: {
    // width: '65.9%',
    // height: '5.4%',
    marginTop: 9,
    marginHorizontal: 32
  },
  text1: {
    fontFamily: 'Avenir-Books',
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 23,
    // marginLeft: 32,

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
    paddingBottom: 13.3
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
    paddingBottom: 13
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
});
