import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  InteractionManager,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import GetData from '../reusableComponents/API/GetData';
import Shimmer from 'react-native-shimmer';
import StoreDataAsync from '../reusableComponents/AsyncStorage/StoreDataAsync';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import FastImage from 'react-native-fast-image';
import ThemeContext from '../reusableComponents/ThemeContext';
import Globals from '../Globals';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-simple-toast';

class CategorySlider extends Component {
  navigateToCategoryScreen = (cid, cname) => () => {
    this.props.navigation.navigate('CategoriesProduct', {cid, cname});
  };

  navigateToHistoryCategoryScreen = (cid, cname, items) => () => {
    this.props.navigation.navigate('CategoriesProduct', {cid, cname, items});
  };

  navigateToProductScreen = (pid, cname) => () => {
    this.props.navigation.navigate('ProductPage', {pid, cname});
  };

  render() {
    const nextButton = (
      <FastImage
        source={require('../static/arrow-right.png')}
        style={innerStyles.nextButton}
      />
    );
    const prevButton = (
      <FastImage
        source={require('../static/arrow-left.png')}
        style={innerStyles.prevButton}
      />
    );

    const data = [
      {image: require('../static/slide1.jpg')},
      {image: require('../static/slide2.jpg')},
      {image: require('../static/slide3.jpg')},
    ];

    return (
      <SafeAreaView style={[styles.parentContainer]}>
        <Swiper
          nextButton={nextButton}
          prevButton={prevButton}
          style={innerStyles.wrapper}
          showsButtons={true}
          autoplay={true}
          showsPagination={false}>
          {data.map((image) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MainPage')}
              style={innerStyles.slide1}>
              <FastImage
                style={innerStyles.slide}
                resizeMode="cover"
                source={image.image}
              />
            </TouchableOpacity>
          ))}

          {/* <View style={innerStyles.slide1}>
            <FastImage
              style={innerStyles.slide}
              resizeMode="cover"
              source={require('../static/slide1.jpg')}
            />
          </View>

          <View style={innerStyles.slide3}>
            <FastImage
              style={innerStyles.slide}
              resizeMode="cover"
              source={require('../static/slide3.jpg')}
            />
          </View> */}
        </Swiper>

        {/* <Footer
          Key={Math.random()}
          selected="Home"
          navigation={this.props.navigation}
        /> */}
      </SafeAreaView>
    );
  }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
  nextButton: {
    height: 25,
    width: 25,
    marginRight: 25,
  },
  prevButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
  },
  slide: {
    height: '100%',
    width: '100%',
  },
  scrollContainer: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  buttonSubmit: {
    width: '100%',
    backgroundColor: '#2967ff',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  lightText: {
    width: Width * 0.8,
    height: Height * 0.06,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
    textAlign: 'center',
    margin: 30,
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default CategorySlider;
