import React, {Component} from 'react';
import {Text, View, SafeAreaView, StyleSheet, Image} from 'react-native';
import Footer from '../reusableComponents/Footer';
import {Icon} from 'react-native-elements';
import Globals from '../Globals';

export default class ConfirmationSuccess extends Component {

  constructor(props) {
    super(props);
    Globals.cartCount = 0
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.subView}>
          <View
            style={styles.nestedSubView}>
            <Text
              style={styles.successText}>
              Success
            </Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <Image
            style={styles.successImage}
            source={require('../static/smile-confirmationSuccess.png')}></Image>
          <View style={styles.marginTopView1}></View>
          <Text style={styles.congratulationsText}>Congratulations!</Text>
          <Text style={styles.congratulationsText}>Your order is accepted</Text>
          <View style={styles.marginTopView2}></View>
          <Text style={styles.yourItemsText}>Your items are on the way and</Text>
          <Text style={styles.yourItemsText}>should arrive shortly</Text>
          <View style={styles.marginTopView3}></View>
          <Text style={styles.orderText}>Order number: {this.props.route.params.orderId}</Text>
        </View>

        <Footer Key={Math.random()} navigation={this.props.navigation}/>
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
  },
  subView:{flexDirection: 'row', alignItems: 'center'},
  nestedSubView:{
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 21,
    marginTop: 26,
  },
  successText:{
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    color: "#2d2d2f"
  },
  successImage:{height: 48, width: 48},
  marginTopView1:{marginTop: 31},
  marginTopView2:{marginTop: 29},
  marginTopView3:{marginTop: 25}
});
