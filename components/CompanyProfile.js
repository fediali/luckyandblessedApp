import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {ScrollView} from 'react-native-gesture-handler';
import ProfileText from '../reusableComponents/ProfileText';

//TODO: Check why last row is not appearing

export default class CompanyProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        fullName: 'Monika Willems',
        email: 'blackcherry@gmail.com',
        longAddress1: '455 Larkspur Dr. California',
        longAddress2: 'Springs, CA 92926, USA',
        shortAddress: '455 Larkspur Dr. Califo...',
        payment: 'Visa **** **** **** 6280',
        wishList: 5,
        myBag: 3,
        myOrders: '1 in transit',
      },
    };
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#fff',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <SafeAreaView style={styles.mainContainer}>
          <Header centerText="Help & Info" rightIcon="edit" />
          <View style={styles.subContainer}>
            <Image
              style={{height: 168.9, width: 198.7, marginBottom: 26}}
              source={require('../static/logo-companyProfile.png')}></Image>

            <Text style={styles.userAddress}>
              {this.state.data.longAddress1}
            </Text>
            <Text style={styles.userAddress}>
              {this.state.data.longAddress2}
            </Text>
            <View style={{marginTop: 33}}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Call"
            valueText={this.state.data.fullName}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.data.email}></ProfileText>
          <ProfileText
            keyText="Online Orders"
            valueText={this.state.data.shortAddress}></ProfileText>

          <View style={styles.divider}></View>

          <ProfileText keyText="Company" containIcon={true}></ProfileText>
          <ProfileText keyText="Locations" containIcon={true}></ProfileText>
          <ProfileText
            keyText="Wholesale Info"
            containIcon={true}></ProfileText>
          <ProfileText keyText="Use and Sales TX ID form" containIcon={true}></ProfileText>
          <ProfileText keyText="Settings" containIcon={true}></ProfileText>
          <View style={styles.divider}></View>
          <ProfileText
            keyText="Return Policy"
            containIcon={true}></ProfileText>
          <ProfileText keyText="FAQs" containIcon={true}></ProfileText>
          <ProfileText keyText="Upcoming Tradeshows" containIcon={true}></ProfileText>
          <Footer selected="Info" />
        </SafeAreaView>
      </ScrollView>
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
    marginTop: 33.1,
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
    height: '0.9%',
    width: '100%',
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
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    paddingVertical: 11,
    paddingHorizontal: 131.5,
  },
});
