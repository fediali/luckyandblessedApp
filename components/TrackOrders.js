import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  InteractionManager,
  Image,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OrderProducts from '../reusableComponents/OrdersProduct';
import Accordion from 'react-native-collapsible/Accordion';
import Shimmer from 'react-native-shimmer';
import GlobalStyles from './Styles/Style';

//FIXME: Accordian ScrollView
export default class TrackOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      isReady: false,

      data: [
        {
          orderId: '48392004',
          date: 'June 4, 2020',
          trackingNumber: '1Z04563340987283920',
          products: [
            {
              itemNum: '0',
              itemName: '3-Stripes Shirt-1',
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

              itemName: '3-Stripes Shirt-1',
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

              itemName: '3-Stripes Shirt-2',
              totalPrice: '$48.99',
              unitPrice: '$19.40',
              size: '2(S), 2(M), 2(L)',
              color: 'Turquoise',
              quantity: 6,
              imageURL: 'http://dev.landbw.co/images/detailed/39/26.jpg',
            },
            {
              itemNum: '1',

              itemName: '3-Stripes Shirt-2',
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

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });
  }

  _renderHeader = (section) => {
    console.log(section);

    return (
      <View>
        <View style={styles.seperator}></View>

        <TouchableOpacity  activeOpacity={0.6} style={styles.order}>
          <Text style={styles.orderIdText}>{'#' + section.orderId}</Text>

          <View style={styles.details}>
            <View style={styles.marginIcon}>
              <Text style={styles.orderDateText}>{section.date}</Text>
              <Text style={styles.subText}>Tap for details</Text>
            </View>

            <View style={styles.iconView}>
              {!this.state.activeSections.some(item => item.orderId === section.orderId) ? (
                // <Icon size={20} name="right" type="antdesign" />
                console.log(section.orderId)
              ) : (
                <Icon size={20} name="down" type="antdesign" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _updateSections = (activeSections) => {
    console.log(activeSections);
    this.setState({activeSections});
  };

  _renderContent = (section) => {
    return (
      <OrderProducts
        trackingNumber={section.trackingNumber}
        productList={section.products}
      />
    );
  };

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;

    if (!this.state.isReady) {
      return (
        <View style={GlobalStyles.loader}>
          <Shimmer>
            <Image
              style={GlobalStyles.logoImageLoader}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }
    return (
      <SafeAreaView style={GlobalStyles.parentContainer}>
        <Header
          centerText="Your orders"
          rightIcon="search"
          navigation={this.props.navigation}
        />

        <View style={styles.accordionStart}>
          <Accordion
            underlayColor="#fff"
            sections={this.state.data}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            expandMultiple={true}
          />
        </View>

        <View style={{paddingBottom: 59, backgroundColor: '#ffffff'}}></View>

        <Footer selected="Van" navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  orderIdText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
    marginTop: 13,
  },
  details: {flexDirection: 'row'},
  marginIcon: {marginRight: 29},
  iconView: {marginTop: 26},
  seperator: {backgroundColor: '#f6f6f6', paddingTop: 1},
  accordionStart: {paddingTop: 10},
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
    marginBottom: 7,
  },
});
