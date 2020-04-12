import React, {Component} from 'react';
import {Text, View, SafeAreaView, StyleSheet, Image} from 'react-native';
import Footer from '../reusableComponents/Footer';
import {Icon} from 'react-native-elements';

export default class ConfirmationSuccess extends Component {
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 21,
              marginTop: 26,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 30,
                color: "#2d2d2f"
              }}>
              Success
            </Text>
            <Icon size={30} name="cross" type="entypo" color="#2d2d2f" />
          </View>
        </View>
        <View style={styles.subContainer}>
          <Image
            style={{height: 48, width: 48}}
            source={require('../static/smile-confirmationSuccess.png')}></Image>
          <View style={{marginTop: 31}}></View>
          <Text style={styles.congratulationsText}>Congratulations!</Text>
          <Text style={styles.congratulationsText}>Your order is accepted</Text>
          <View style={{marginTop: 29}}></View>
          <Text style={styles.yourItemsText}>Your items are on the way and</Text>
          <Text style={styles.yourItemsText}>should arrive shortly</Text>
          <View style={{marginTop: 25}}></View>
          <Text style={styles.orderText}>Order number: 4839200012</Text>
        </View>

        <Footer  navigation={this.props.navigation}/>
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
    marginTop: 94,
  },
  congratulationsText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    lineHeight: 28,
    color: '#2d2d2f',
  },
  yourItemsText: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  orderText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    color: '#000000',
  }
});
