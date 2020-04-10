import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Accordion from 'react-native-collapsible/Accordion';

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],

      data: {
        category: 'Jeans',
        itemName1: 'RED MINT AZTEC BELL',
        itemName2: 'SLEEVE BLAZER',
        totalPrice: '$48.99',
        unitPrice: '$19.40',
        color: ['Turquoise', 'Green Snake'],
        minQuantity: 6,
        Quanitities: [6, 12, 18],
        imageURL: [
          {img1: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg'},
          {img2: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg'},
          {img3: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg'},
        ],
        description: {
          details:
            "This women's tank top is designed to help you stay cool. It's made of stretchy and breathable fabric that moves heat away from your skin",
          composition: '84% nylon, 16% elastane',
          sizes: '2XS, XS, S, M, L, XL',
          gender: 'Women',
          country: 'Indonesia',
          code: 'EC142690002',
        },
      },
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText={this.state.data.category} rightIcon="share" />

        <View style={styles.subContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.itemNameText}>
                {this.state.data.itemName1}
              </Text>
              <Text style={styles.itemNameText}>
                {this.state.data.itemName2}
              </Text>
            </View>
            <View>
              <Text style={[styles.itemNameText, {alignSelf: "flex-end"}]}>
                {this.state.data.unitPrice}
              </Text>
              <Text style={styles.subText}>
                Prepack Price: {this.state.data.totalPrice}
              </Text>
            </View>
          </View>
          <Image style={styles.mainPicture} source={require('../static/demoimg1-walkthrough.png')}></Image>
          <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 15}}>
            <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
            <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
            <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>


          </View>
        </View>
        <Footer />
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
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 20
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
  },
  subText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    marginVertical: 8
  }, 
  mainPicture: {width: Width * 0.893, height: Width * 0.893, borderRadius: 6},
  thumbnail: {width: Width * 0.28, height: Width * 0.28, borderRadius: 6}
});
