import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import OrderProductListItem from './OrderProductListItem';
const Globals = require('../Globals');

const baseUrl = Globals.baseUrl;
//TODO: image from imageurl is not getting rendered. So currently hard coded image is presenter
//TODO: allignment is out for name and price of products
//TODO: IDK how to set tracking number for each list because that is seperate API
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
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isReady: false });
      this.getData(this.props.orderId);
    });
  }

  getTrackingData = (shipmentID, index) => {
    var promises = [];
    promises.push(
      GetData(
        baseUrl +
        `api/shipments/${shipmentID}`,
      ),
    );
    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((responses) => {
            console.log(responses)
            let newOrder = this.state.orders
            newOrder[index]['trackingNumber'] = responses[0].tracking_number
            this.setState({ orders: newOrder, isTrackingReady: true })
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        alert(ex);
      });
  }

  getData = (orderId) => {
    var promises = [];
    promises.push(
      GetData(
        baseUrl +
        `api/orders/${orderId}`,
      ),
    );

    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((responses) => {

            productGroupKeys = Object.keys(responses[0].product_groups[0].products)
            let productArray = []
            let jsonProducts = {}
            //TODO: No Size attribute in response.
            //TODO: No Color attribute in response.
            for (var i = 0; i < productGroupKeys.length; i++) {
              jsonProducts['itemNum'] = productGroupKeys[i].toString()
              jsonProducts['totalPrice'] = responses[0].product_groups[0].products[productGroupKeys[i]].price * responses[0].product_groups[0].products[productGroupKeys[i]].amount
              jsonProducts['itemName'] = responses[0].product_groups[0].products[productGroupKeys[i]].product
              jsonProducts['size'] = "Not available"
              jsonProducts['color'] = "Not available"
              jsonProducts['quantity'] = responses[0].product_groups[0].products[productGroupKeys[i]].amount
              jsonProducts['unitPrice'] = responses[0].product_groups[0].products[productGroupKeys[i]].price
              if ('detailed' in responses[0].product_groups[0].products[productGroupKeys[i]].main_pair) {
                jsonProducts['imageUrl'] = responses[0].product_groups[0].products[productGroupKeys[i]].main_pair.detailed.image_path
              } else {
                jsonProducts['imageUrl'] = '../static/item_cart1.png'
              }
              if (responses[0].shipment_ids.length > 0) {
                jsonProducts['shipment_id'] = responses[0].shipment_ids
                this.setState({ isTrackingReady: false })
                this.getTrackingData(jsonProducts['shipment_id'], i)
              } else {
                this.setState({ isTrackingReady: true })
              }
              productArray[i] = jsonProducts
              jsonProducts = {}


            }

            this.setState({ orders: productArray, isReady: true })
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        alert(ex);
      });
  };

  renderSeparator = (item) => {
    return <View style={styles.seperator} />;
  };

  renderFlatListFooter = (item) => {
    var listFooter = (
      <TouchableOpacity style={styles.trackingStyle}>
        <Text style={styles.orderIdText}>
          {/* TODO: Get trackingNumberNumber(not working currently) */}
        Track: {item.trackingNumber}
        </Text>
        <View style={styles.mar19}>
          <Icon size={20} name="right" type="antdesign" />
        </View>
      </TouchableOpacity>
    );
    return listFooter;
  }
  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    if (!this.state.isReady) {
      return (
        <View style={styles.loader}><ActivityIndicator size="large" /></View>
      )
    }
    return (
      <View>
        <FlatList
          style={styles.flatlistStyle}
          data={this.state.orders}
          keyExtractor={(item, index) => item.itemNum}
          renderItem={({ item }) => <OrderProductListItem data={item} />}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={(item)=>this.renderFlatListFooter(item)}

        />
        <View style={styles.dividerLine}></View>


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
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  seperator: { paddingBottom: 20 },
  flatlistStyle: { marginTop: 13 },
  dividerLine: { backgroundColor: '#f6f6f6', paddingTop: 1 },
  trackingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  mar19: { marginTop: 19 },
});
