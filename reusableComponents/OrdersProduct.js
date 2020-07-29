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
  Linking,
} from 'react-native';
import { Icon } from 'react-native-elements';
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
      this.setState({ isReady: false });
    });
  }

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    // if (!this.state.isReady) {
    //   return (
    //     <View style={styles.loader}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }
    return (
      <View >
        {this.props.orders.map((item, index) => {
          return <OrderProductListItem key={index.toString()} data={item} />;
        })}
        <View style={styles.dividerLine}></View>
        {this.props.trackingURL ?
          <TouchableOpacity
            style={styles.trackingStyle}
            onPress={() => {
              Linking.openURL(this.props.trackingURL);
            }}>
            <Text style={styles.orderIdText}>
              Track: {this.props.trackingNumber}
            </Text>
            <View style={styles.mar19}>
              <Icon size={20} name="right" type="antdesign" />
            </View>
          </TouchableOpacity>

          : <></>
        }
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
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
