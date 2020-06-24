import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Icon} from 'react-native-elements';
import OrderProductListItem from './OrderProductListItem';
import Toast from 'react-native-simple-toast';

const Globals = require('../Globals');

const baseUrl = Globals.baseUrl;
export default class ordersProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      iteratedPage: 1,
      orders: [],
      isReady: false,
      isTrackingReady: false,
      totalOrders: 0,
      totalItemsPerRequest: 0,
      isLoadingMoreListData: false,
      showZeroProductScreen: false,
      trackingNumber: null,
      trackingURL: null,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: false});
      this.getData(this.props.orderId);
    });
  }

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
            Toast.show(ex.toString())
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        Toast.show(ex.toString());
      });
  };

  getData = (orderId) => {
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
                jsonProducts['imageUrl'] = 'https://picsum.photos/200';
              }
              if (responses[0].shipment_ids.length > 0) {
                jsonProducts['shipment_id'] = responses[0].shipment_ids;
                this.setState({isTrackingReady: false});
                this.getTrackingData(jsonProducts['shipment_id'], i);
              } else {
                this.setState({isTrackingReady: true});
              }
              productArray[i] = jsonProducts;
              jsonProducts = {};
            }

            this.setState({orders: productArray, isReady: true});
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

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    if (!this.state.isReady) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View>
        {this.state.orders.map((item, index) => {
          return <OrderProductListItem key={index.toString()} data={item} />;
        })}
        <View style={styles.dividerLine}></View>

        <TouchableOpacity
          style={styles.trackingStyle}
          onPress={() => {
            Linking.openURL(this.state.trackingURL);
          }}>
          <Text style={styles.orderIdText}>
            Track: {this.state.trackingNumber}
          </Text>
          <View style={styles.mar19}>
            <Icon size={20} name="right" type="antdesign" />
          </View>
        </TouchableOpacity>
        <View style={styles.dividerLine}></View>

        <View style={styles.divider}></View>
      </View>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  thumbnailImage: {
    height: 100,
    width: 100,
    borderRadius: 6,
  },
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  lightText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
  },
  divider: {
    height: Height * 0.01,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  orderIdText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
    marginVertical: 19,
  },
  seperator: {paddingBottom: 20},
  flatlistStyle: {marginTop: 13},
  dividerLine: {backgroundColor: '#f6f6f6', paddingTop: 1},
  trackingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  mar19: {marginTop: 19},
});
