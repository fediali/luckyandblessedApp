import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';

//FIXME: Don't know why warning is there.
//TODO: Check how to make GET DATA generalised.
//TODO: Error handling from Bad Stuff
export default class WalkThrough extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      images: [],
      error: null
    };
    this.getData('http://dev.landbw.co/api/mobile');
  }

  getData(url) {
    let h = new Headers();
    h.append(
      'Authorization',
      'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
    );
    h.append('Accept', 'application/json');

    let req = new Request(url, {
      headers: h,
      method: 'GET',
    });

    fetch(req)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          images: data.home.not_logged.sliders,
          loaded: true,
        });
      })
      .catch(this.badStuff);
  }

  badStuff = (err) => {
    this.setState({loaded: true, data: null, error: err.message});
  };

  render() {
    // console.log(this.state.images)

    var featuredImages = [];

    this.state.images.forEach((img, index) => {
      console.log(img);
      featuredImages.push(
        <Image
          style={styles.images}
          key={index}
          resizeMode="contain"
          source={{uri: img}}
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
          {(this.state.loaded && !this.state.error) ? (
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {featuredImages}
              </ScrollView>
            </View>
          ) : (
            <Text>Loading</Text>
            // {/*TODO: Add Lazy loader*/}
          )}

          <View style={styles.texts}>
            <Text style={styles.newCollection}>New Collection</Text>
            <View style={styles.youAreRegistering}>
              <Text style={styles.text1}>You are registering for a</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text2}>{' WHOLESALE'}</Text>
                <Text style={styles.text1}>{' account.'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonRegisterNow}
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}>
              <Text style={styles.registerButtonText}>Register now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogIn}
              onPress={() => {
                this.props.navigation.navigate('SignIn');
              }}>
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
