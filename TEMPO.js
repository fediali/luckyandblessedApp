import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  InteractionManager,
  Image,
  ActivityIndicator
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import OrderProducts from '../reusableComponents/OrdersProduct';
import Accordion from 'react-native-collapsible/Accordion';
import Shimmer from 'react-native-shimmer';
import GlobalStyles from './Styles/Style';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Globals from '../Globals';
import Toast from 'react-native-simple-toast';

const baseUrl = Globals.baseUrl;
const STORAGE_USER = Globals.STORAGE_USER;
let orderOpened;
export default class TrackOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      iteratedPage: 1,
      orders: [],
      isReady: false,
      totalOrders: 0,
      totalItemsPerRequest: 0,
      isLoadingMoreListData: false,
      showZeroProductScreen: false,
      customOrders:[]
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isReady: false });

      // Retriving the user_id
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        this.getData(JSON.parse(user));
      });
    });
  }

  getData = (user) => {
    var promises = [];
    promises.push(
      GetData(
        baseUrl +
        `api/orders?user_id=${user.user_id}&page=${this.state.iteratedPage}`,
      ),

    );

    console.log(user.user_id);
    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((responses) => {
            //Converting to required date format
            console.log("AAAAAAAAAAAAAAAAA => ", JSON.stringify(responses) );
            parseProducts = async () => {
              const tempOrders = [];
              if (responses[0].orders.length == 0) {
                this.setState(
                  {
                    showZeroProductScreen: true,
                  }
                );
              } else {
                let newOrders = responses[0].orders.map((ord) => {
                  let mlist = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ];

                  let milliseconds = ord.timestamp * 1000; //
                  let dateObject = new Date(milliseconds);
                  let monthIndex = dateObject.getMonth(); //2019-12-9 10:30:15
                  let monthName = mlist[monthIndex];
                  let day = dateObject.getDate();
                  let year = dateObject.getFullYear();

                  ord.timestamp = `${monthName} ${day}, ${year}`;
                });

                for (let i = 0; i < responses[0].orders.length; i++) {
                  await tempOrders.push({
                    order_id: responses[0].orders[i].order_id,
                    timestamp: responses[0].orders[i].timestamp,
                  });
                }
              }
              return tempOrders;
            };

            parseProducts().then((ord) => {
              this.setState({
                totalOrders: parseFloat(
                  responses[0].params.total_items,
                ).toFixed(0),
                totalItemsPerRequest: parseFloat(
                  responses[0].params.items_per_page,
                ).toFixed(0),
                isReady: true,
                orders: [...this.state.orders, ...ord],
                isLoadingMoreListData: false,
                showZeroProductScreen: false,
              });
            });
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
            Toast.show(ex.toString())
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        Toast.show(ex.toString());
      });
  };

  handleLoadMore = () => {
    if (this.state.isLoadingMoreListData == false) {
      if (
        this.state.iteratedPage <
        Math.ceil(this.state.totalOrders / this.state.totalItemsPerRequest)
      ) {
        this.setState(
          {
            iteratedPage: this.state.iteratedPage + 1,
            isLoadingMoreListData: true,
          },
          () => this.getData(),
        );
      }
    }
  };

  _renderHeader = (section, index) => {

    return (
      <View>
        <View style={styles.seperator}></View>

        <TouchableOpacity activeOpacity={0.6} style={styles.order}>
          <Text style={styles.orderIdText}>{'#' + section.order_id}</Text>

          <View style={styles.details}>
            <View style={styles.marginIcon}>
              <Text style={styles.orderDateText}>{section.timestamp}</Text>
              <Text style={styles.subText}>Tap for details</Text>
            </View>

            <View style={styles.iconView}>
              {!this.state.activeSections.includes(index) ? (
                <Icon size={20} name="right" type="antdesign" />
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

    this.setState({ activeSections });
  };
  getTrackingData = (shipmentID, index) => {
    var promises = [];
    promises.push(GetData(baseUrl + `api/shipments/${shipmentID}`));
    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((responses) => {
            this.setState({
              trackingNumber: responses[0].tracking_number,
              trackingURL: responses[0].carrier_info.tracking_url,
            });
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
            // Toast.show(ex.toString())
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        Toast.show(ex.toString());
      });
  };

  getDataCustom = (orderId) => {
    var promises = [];
    promises.push(GetData(baseUrl + `api/orders/${orderId}`));
    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((responses) => {
            productGroupKeys = Object.keys(
              responses[0].product_groups[0].products,
            );
            let productArray = [];
            let jsonProducts = {};
            //TODO: No Size attribute in response.
            //TODO: No Color attribute in response.
            for (var i = 0; i < productGroupKeys.length; i++) {
              jsonProducts['itemNum'] = productGroupKeys[i].toString();
              jsonProducts['totalPrice'] =
                responses[0].product_groups[0].products[productGroupKeys[i]]
                  .price *
                responses[0].product_groups[0].products[productGroupKeys[i]]
                  .amount;
              jsonProducts['itemName'] =
                responses[0].product_groups[0].products[
                  productGroupKeys[i]
                ].product;
              jsonProducts['size'] = 'Not available';
              jsonProducts['color'] = 'Not available';
              jsonProducts['quantity'] =
                responses[0].product_groups[0].products[
                  productGroupKeys[i]
                ].amount;
              jsonProducts['unitPrice'] =
                responses[0].product_groups[0].products[
                  productGroupKeys[i]
                ].price;
              if (
                'detailed' in
                responses[0].product_groups[0].products[productGroupKeys[i]]
                  .main_pair
              ) {
                jsonProducts['imageUrl'] =
                  responses[0].product_groups[0].products[
                    productGroupKeys[i]
                  ].main_pair.detailed.image_path;
              } else {
                jsonProducts['imageUrl'] = Globals.noImageFoundURL;
              }
              if (responses[0].shipment_ids.length > 0) {
                jsonProducts['shipment_id'] = responses[0].shipment_ids;
                this.setState({ isTrackingReady: false });
                this.getTrackingData(jsonProducts['shipment_id'], i);
              } else {
                this.setState({ isTrackingReady: true });
              }
              productArray[i] = jsonProducts;
              jsonProducts = {};
            }

            this.setState({ customOrders: productArray, customIsReady: true });
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
            Toast.show(ex.toString())
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        Toast.show(ex.toString());
      });
  };
  _renderContent = (section, index) => {

    if (this.state.activeSections.includes(index)) {
      if (section.order_id != orderOpened) {
        orderOpened = section.order_id;
        this.getDataCustom(section.order_id);
      }
  
      return (
        <OrderProducts
          orderId={section.order_id}
          orders={this.state.customOrders}
          trackingNumber={this.state.trackingNumber}
          trackingURL={this.state.trackingURL}
          isReady = {this.state.customIsReady}
        />
      );
          
      }
     
    

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

    if (this.state.showZeroProductScreen) {
      return <ZeroDataScreen />;
    } else {
      return (
        <SafeAreaView style={GlobalStyles.parentContainer}>
          <Header
            centerText="Your orders"
            rightIcon="search"
            navigation={this.props.navigation}
          />

          <ScrollView style={styles.accordionStart}>
            <Accordion
              underlayColor="#fff"
              sections={this.state.orders}
              activeSections={this.state.activeSections}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            // expandMultiple={true}
            />
          </ScrollView>

          <View style={styles.bottomContainer}></View>

          <Footer selected="Van" navigation={this.props.navigation} />
        </SafeAreaView>
      );
    }
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
  details: { flexDirection: 'row' },
  marginIcon: { marginRight: 29 },
  iconView: { marginTop: 26 },
  seperator: { backgroundColor: '#f6f6f6', paddingTop: 1 },
  accordionStart: { paddingTop: 10 },
  bottomContainer: { paddingBottom: 59, backgroundColor: '#ffffff' },
  orderDateText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#1bbfc7',
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
