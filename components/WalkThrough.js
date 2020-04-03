import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

export default class WalkThrough extends Component {

    constructor() {
        super();
        this.state = {
        };
    }


  render() {

    var featuredImagesList =  ["../static/demoimg1-walkthrough.png", "../static/demoimg2-walkthrough.png"];
    var featuredImages = []

    featuredImagesList.forEach((value, index) => {
        featuredImages.push(

            <Image 
                style={styles.images}
                key={index}
                resizeMode="contain"
                source={require("../static/demoimg1-walkthrough.png")}
            />

        )
    })

    return (



      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../static/logo-walkthrough.png')}
          />
          <View style={styles.imageContainer}>
              <ScrollView horizontal={true}>
                {featuredImages}
              </ScrollView>
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
      flexDirection: "row",
      marginTop: 3.3,
      marginLeft: 5.3
  },
  images: {
    width: 83.3, //wp('66.7%'),
    height: 120.3, //hp('44.5%'),
    marginRight: 4
  }
});
