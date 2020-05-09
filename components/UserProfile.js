import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {ScrollView} from 'react-native-gesture-handler';
import ProfileText from '../reusableComponents/UserProfileText';
import Accordion from 'react-native-collapsible/Accordion';
import {Icon} from 'react-native-elements';
import Shimmer from 'react-native-shimmer';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStyles from './Styles/Style';
import FastImage from 'react-native-fast-image'

const STORAGE_PRODUCT_HISTORY_CATEGORY="productHistoryList"
const STORAGE_USER='user'
const STORAGE_DEFAULTS="defaults"

//TODO: wHAT IF USER ADRESS IS GREATER THAN 2 LINES
export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection1: [],
      isReady: false,
      section1: [
        {
          id: 0,
          title: 'Referral Link',
          content: 'thisisdemo.referallink.com',
        },
      ],
      fullName: 'Monika Willems',
      email: 'blackcherry@gmail.com',
      longAddress: '455 Larkspur Dr. California Springs, CA 92926, USA',
      shortAddress: '455 Larkspur Dr. Califo...',
      payment: 'Visa **** **** **** 6280',
      wishList: 5,
      myBag: 3,
      myOrders: '1 in transit',
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });
  }
  _updateSection1 = (activeSection1) => {
    this.setState({activeSection1});
  };

  _renderContent = (section) => {
    return (
      <View style={styles.descriptionTextView}>
        {/* TODO: Justify Text to center */}
        <Text style={styles.descriptionText}>
          {section.content}
        </Text>
      </View>
    );
  };

  _renderHeader1 = (section) => {
    return (
        <View style={styles.userDetails}>
          <View style={styles.titleTextView}>
            <Text style={styles.keyText}>{section.title}</Text>
          </View>
            <View style={styles.iconStyle}>
              {!this.state.activeSection1.includes(section.id) ? (
                <Icon size={20} name="right" type="antdesign" />
              ) : (
                <Icon size={20} name="down" type="antdesign" />
              )}
            </View>
        </View>
    );
  };

  //To get the data from child component and update the state of main component. Expects a json object.

  customSetState(stateVal) {
    var key = Object.keys(stateVal)[0];
    console.log(stateVal[key])
    this.setState({[key]: stateVal[key]});
    console.log([key], stateVal[key])
  }

  logoutPressed=()=>{
    AsyncStorage.removeItem(STORAGE_USER);
    AsyncStorage.removeItem(STORAGE_PRODUCT_HISTORY_CATEGORY);
    this.props.navigation.navigate('SignIn');
  }

  render() {
    console.log("here", this.state.fullName)

    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
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
        <Header centerText="Account" navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyles}>
          <View style={styles.subContainer}>
            <FastImage
              style={styles.displayPicture}
              source={require('../static/dp-userProfile.png')}></FastImage>
            <Text style={styles.userNameText}>Monika Willems</Text>
            <Text style={styles.userAddress}>455 Larkspur Dr. California</Text>
            <Text style={styles.userAddress}>Springs, CA 92926, USA</Text>
            <View style={styles.divideProfile}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Full Name"
            valueText={this.state.fullName}
            stateKey="fullName"
            customSetState={(stateVal) => {
              this.customSetState(stateVal);
            }}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.email}
            stateKey="email"
            customSetState={(stateVal) => {
              this.customSetState(stateVal);
            }}></ProfileText>
          <ProfileText
            keyText="Address"
            valueText={this.state.longAddress}
            stateKey="address"
            customSetState={(stateVal) => {
              this.customSetState(stateVal);
            }}></ProfileText>
          <ProfileText
            navigation={this.props.navigation}
            keyText="Payment"
            valueText={this.state.payment}
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>

          <Accordion
            underlayColor="#fff"
            sections={this.state.section1}
            activeSections={this.state.activeSection1}
            renderHeader={this._renderHeader1}
            renderContent={this._renderContent}
            onChange={this._updateSection1}
            expandMultiple={true}
          />
          <ProfileText
            navigation={this.props.navigation}
            keyText="TAX ID"
            containIcon={true}></ProfileText>
          <ProfileText
            navigation={this.props.navigation}
            keyText="My orders"
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>
          {/* <ProfileText keyText="Return Request" containIcon={true}></ProfileText>
          <ProfileText keyText="Settings" containIcon={true}></ProfileText> */}
          <View style={styles.bottomContainer}>
            <View style={styles.logOutButton}>
              <TouchableOpacity
              activeOpacity={0.5}
                style={styles.buttonSignIn}
                onPress={this.logoutPressed}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Footer selected="Person" navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    // marginBottom:150
  },
  divideProfile:{marginTop: 50},
  scrollViewStyles: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  userNameText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    lineHeight: 28,
    marginTop: 35,
    marginBottom: 9,
  },
  userAddress: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
    height: Height * 0.01,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  buttonSignIn: {
    backgroundColor: '#2967ff',
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    color: '#ffffff',
    paddingVertical: 11,
    width: Width * 0.8,
  },
  descriptionText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    color: '#2d2d2f',
    textAlign: 'justify',
    marginHorizontal: 20
  },
  descriptionTextView: {justifyContent: 'center'},
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  keyText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  iconStyle: {
    marginVertical: 18,
    marginRight: 6,
    marginLeft: 19.5,
  },
  displayPicture: {height: 88, width: 88, borderRadius: 88},
  bottomContainer: {paddingBottom: 80, backgroundColor: '#f6f6f6'},
  logOutButton: {
    height: Height * 0.074,
    width: Width,
    backgroundColor: '#f6f6f6',
    padding: 20,
    alignItems: 'center',
  },
  titleTextView: {paddingVertical: 19}
});
