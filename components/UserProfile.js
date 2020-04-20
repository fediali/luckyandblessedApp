import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  InteractionManager
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileText from '../reusableComponents/UserProfileText';
import Accordion from 'react-native-collapsible/Accordion';
import {Icon} from 'react-native-elements';
import Shimmer from 'react-native-shimmer';
import AsyncStorage from '@react-native-community/async-storage';

//TODO: wHAT IF USER ADRESS IS GREATER THAN 2 LINES
//TODO: Data on pressing the arrow
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
        this.setState({isReady: true})
    })
}
  _updateSection1 = (activeSection1) => {
    this.setState({activeSection1});
  };

  _renderContent = (section) => {
    return (
      <View style={{justifyContent: 'center'}}>
        {/* TODO: Justify Text to center */}
        <Text style={[styles.descriptionText, {marginHorizontal: 20}]}>
          {section.content}
        </Text>
      </View>
    );
  };

  _renderHeader1 = (section) => {
    return (
      <View>
        <View style={styles.userDetails}>
          <View style={{paddingVertical: 19}}>
            <Text style={styles.keyText}>{section.title}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                marginVertical: 18,
                marginRight: 6,
                marginLeft: 19.5,
              }}>
              {!this.state.activeSection1.includes(section.id) ? (
                <Icon size={20} name="right" type="antdesign" />
              ) : (
                <Icon size={20} name="down" type="antdesign" />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };


  //FIXME: Fix the update
  customSetState(stateVal) {
    console.log("AAA", stateVal)
    var key = Object.keys(stateVal)[0];
    console.log("KEY", key)
    console.log("VAL", stateVal[key])
    this.setState({ [key]: stateVal[key] })
  }

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    console.log("VAL Render", this.state)
    if (!this.state.isReady) {
      return (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
              <Shimmer>
                  <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
              </Shimmer>
          </View>
      )

  }

    return (
      
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Account" navigation={this.props.navigation} />
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#fff',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View style={styles.subContainer}>
            <Image
              style={{ height: 88, width: 88, borderRadius: 88 }}
              source={require('../static/dp-userProfile.png')}></Image>
            <Text style={styles.userNameText}>Monika Willems</Text>
            <Text style={styles.userAddress}>455 Larkspur Dr. California</Text>
            <Text style={styles.userAddress}>Springs, CA 92926, USA</Text>
            <View style={{ marginTop: 50 }}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Full Name"
            valueText={this.state.fullName} stateKey="fullName" customSetState={(stateVal) => { this.customSetState(stateVal) }}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.email} stateKey="email" customSetState={(stateVal) => { this.customSetState(stateVal) }}></ProfileText>
          <ProfileText
            keyText="Address"
            valueText={this.state.longAddress} stateKey="address" customSetState={(stateVal) => { this.customSetState(stateVal) }}></ProfileText>
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
          <View style={{ paddingBottom: 80, backgroundColor: '#f6f6f6' }}>
            <View
              style={{
                height: Height * 0.074,
                width: Width,
                backgroundColor: '#f6f6f6',
                padding: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.buttonSignIn}
                onPress={() => {
                  AsyncStorage.removeItem("user");
                  this.props.navigation.navigate('SignIn');
                }}>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    // marginBottom:150
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
  decriptionText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    color: '#2d2d2f',
    textAlign: 'justify',
  },
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
});
