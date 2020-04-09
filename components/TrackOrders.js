import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OrderProducts from '../reusableComponents/OrdersProduct';
import Accordion from 'react-native-collapsible/Accordion';

export default class TrackOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          orderId: '48392004',
          date: 'June 4, 2020',
          trackingNumber: '1Z04563340987283920',
          products: [
            {
              itemNum: '0',
              itemName: '3-Stripes Shirt',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 14,
              imageURL:
                'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
            },
            {
              itemNum: '1',

              itemName: '3-Stripes Shirt',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 14,
              imageURL:
                'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
            },
          ],
        },
        {
          orderId: '78309897',
          date: 'June 5, 2020',
          trackingNumber: '1Z04563340987283920',
          products: [
            {
              itemNum: '0',

              itemName: '3-Stripes Shirt',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 14,
              imageURL: 'http://dev.landbw.co/images/detailed/39/26.jpg',
            },
            {
              itemNum: '1',

              itemName: '3-Stripes Shirt',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 14,
              imageURL:
                'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg',
            },
          ],
        },
        {
          orderId: '78309898',
          date: 'June 5, 2020',
          trackingNumber: '1Z04563340987283920',

          products: [
            {
              itemNum: '0',

              itemName: '3-Stripes Shirt',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 14,
              imageURL: 'http://dev.landbw.co/images/detailed/39/26.jpg',
            },
            
          ],
        },
      ],
    };
  }

  //TODO: How to get colour?
  renderSeparator = (item) => {
    return (
      <View>
        {/* <View style={{paddingTop: 13}}></View> */}

        <View style={{backgroundColor: '#f6f6f6', paddingTop: 1}}></View>
      </View>
    );
  };

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Your orders" rightIcon="search" />
        <View style={{backgroundColor: '#f6f6f6', paddingTop: 1}}></View>

        <FlatList
          style={{paddingTop: 10}}
          data={this.state.data}
          keyExtractor={(item, index) => item.orderId}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity style={[styles.order, {marginHorizontal: 20}]}>
                <Text style={[styles.orderIdText, {marginTop: 13}]}>
                  {'#' + item.orderId}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: 29}}>
                    <Text style={styles.orderDateText}>{item.date}</Text>
                    <Text style={styles.subText}>Tap for details</Text>
                  </View>
                  <View style={{marginTop: 26}}>
                    <Icon size={20} name="right" type="antdesign" />
                  </View>
                </View>
              </TouchableOpacity>

              <OrderProducts trackingNumber={item.trackingNumber} productList={item.products} />
            </View>
          )}
          ItemSeparatorComponent={this.renderSeparator}

        />

        <View style={{paddingBottom: 59, backgroundColor: '#ffffff'}}></View>

        <Footer selected="Van" />
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
  },
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderIdText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  orderDateText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2967ff',
    marginTop: 13,
  },
  subText: {
    marginTop: 2,
    alignSelf: 'flex-end',
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    marginBottom: 7
  },
});
