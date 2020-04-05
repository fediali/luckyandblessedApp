import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, SafeAreaView, Image} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { ScrollView } from 'react-native-gesture-handler';

//TODO: wHAT IF USER ADRESS IS GREATER THAN 2 LINES
export default class UserProfile extends PureComponent {
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Account" rightIcon="edit" />
        <View style={styles.subContainer}>
          <Image
            style={{height: 88, width: 88, borderRadius: 88}}
            source={require('../static/dp-userProfile.png')}></Image>
          <Text style={styles.userNameText}>Monika Willems</Text>
          <Text style={styles.userAddress}>455 Larkspur Dr. California</Text>
          <Text style={styles.userAddress}>Springs, CA 92926, USA</Text> 
        <ScrollView>
            <View style={styles.divider}></View>
        </ScrollView>
        </View>
        <Footer selected="Person" />
      </SafeAreaView>
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
    marginBottom: 9
  },
  userAddress: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
      paddingTop: 10,
      backgroundColor: "#f6dddd"
  }
});
