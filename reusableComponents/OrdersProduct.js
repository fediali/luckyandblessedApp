import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import OrderProductListItem from './OrderProductListItem';
export default class ordersProduct extends PureComponent {
  renderSeparator = (item) => {
    return <View style={styles.seperator} />;
  };

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    return (
      <View>
        <FlatList
          style={styles.flatlistStyle}
          data={this.props.productList}
          keyExtractor={(item, index) => item.itemNum}
          renderItem={({item}) => <OrderProductListItem data={item} />}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <View style={styles.dividerLine}></View>

        <TouchableOpacity
          style={styles.trackingStyle}>
          <Text style={styles.orderIdText}>
            Track: {this.props.trackingNumber}
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
    marginVertical: 19
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
