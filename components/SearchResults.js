import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

//TODO: Check for the last row
export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          itemNum: '0',
          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
        {
          itemNum: '1',

          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
        {
          itemNum: '2',
          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
        {
          itemNum: '3',

          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
        {
          itemNum: '4',

          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
        {
          itemNum: '5',

          itemName: '3-Stripes Shirt',
          totalPrice: '$48.99',
          category: 'Hoodies',
          imageURL:
            'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
        },
      ],
    };
  }

  renderSeparator = (item) => {
    return <View style={{paddingBottom: 20}} />;
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Search" rightIcon="filter"  navigation={this.props.navigation}/>
        <View style={{marginHorizontal: 20}}>
          <View style={styles.inputView}>
            <View
              style={{
                marginVertical: 9.8,
                marginLeft: 20.8,
                marginRight: 10.8,
              }}>
              <Icon
                size={20}
                name="ios-search"
                type="ionicon"
                color="#bababa"
              />
            </View>

            <TextInput style={styles.inputText} placeholder="Search" />
          </View>

          <FlatList
            style={{marginTop: 32}}
            data={this.state.data}
            keyExtractor={(item, index) => item.itemNum}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={[styles.thumbnailImage]}
                    resizeMode="contain"
                    source={require('../static/item_cart1.png')}
                  />
                  <View style={{flexDirection: 'column', marginLeft: 20}}>
                    <Text style={styles.itemNameText}>{item.itemName}</Text>
                    <Text style={[styles.categoriesText]}>{item.category}</Text>
                    <Text style={[styles.priceText]}>{item.totalPrice}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
          <View style={{marginBottom: 60}}></View>
        </View>
        <Footer  navigation={this.props.navigation}/>
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
  inputText: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
    color: '#2d2d2f',
    paddingVertical: 7,
    width: Width * 0.893,
  },
  inputView: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 20,
    borderRadius: 18,
    marginTop: 4,
    // height: Height * 0.044
  },
  thumbnailImage: {
    height: 110,
    width: 110,
    borderRadius: 6,
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
  },
  categoriesText: {
    color: '#2967ff',
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 7,
  },
  priceText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
    marginTop: 6,
  },
});
