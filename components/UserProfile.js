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
//TODO: wHAT IF USER ADRESS IS GREATER THAN 2 LINES
//TODO: Check why last row is not appearing
export default class UserProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        fullName: 'Monika Willems',
        email: 'blackcherry@gmail.com',
        longAddress: '455 Larkspur Dr. California Springs, CA 92926, USA',
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
          <Header centerText="Account" rightIcon="edit" />
          <View style={styles.subContainer}>
            <Image
              style={{height: 88, width: 88, borderRadius: 88}}
              source={require('../static/dp-userProfile.png')}></Image>
            <Text style={styles.userNameText}>Monika Willems</Text>
            <Text style={styles.userAddress}>455 Larkspur Dr. California</Text>
            <Text style={styles.userAddress}>Springs, CA 92926, USA</Text>
            <View style={{marginTop: 50}}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Full Name"
            valueText={this.state.data.fullName}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.data.email}></ProfileText>
          <ProfileText
            keyText="Address"
            valueText={this.state.data.shortAddress}></ProfileText>
          <ProfileText
            keyText="Payment"
            valueText={this.state.data.payment}
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>

          <ProfileText
            keyText="Wishlist"
            valueText={this.state.data.wishList}
            containIcon={true}></ProfileText>
          <ProfileText
            keyText="My bag"
            valueText={this.state.data.myBag}
            containIcon={true}></ProfileText>
          <ProfileText
            keyText="My orders"
            valueText={this.state.data.myOrders}
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>
          <ProfileText keyText="Newsletter" containIcon={true}></ProfileText>
          <ProfileText keyText="Settings" containIcon={true}></ProfileText>

          <View
            style={{
              height: '7.4%',
              width: '100%',
              backgroundColor: '#f6f6f6',
              padding: 20,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.buttonSignIn}
              onPress={() => {
                this.props.navigation.navigate('UserProfile');
              }}>
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
          </View>
          <ProfileText
            keyText="Settings"
            valueText={this.state.data.myBag}
            containIcon={true}></ProfileText>

          <Footer selected="Person" />
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
    marginTop: 50,
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
    paddingHorizontal: 131.5
  },
});
