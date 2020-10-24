import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from 'react-native-fast-image';
const LOOKBOOK_CATEGORY_ID = -2;

class CategoriesListItem extends PureComponent {
  navigateToProductPage = () => {
    console.log(this.props.name);
    if (this.props.cid == LOOKBOOK_CATEGORY_ID)
      this.props.navigation.navigate('LookbookRenderer', {
        html: [this.props.html],
        pageName: [this.props.name],
      });
    else
      this.props.navigation.navigate('CategoriesProduct', {
        cid: [this.props.cid],
        cname: [this.props.name],
      });
  };

  render() {
    //console.log(this.props.imageUrl)
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.button}
        onPress={this.navigateToProductPage}>
        {this.props.cid != LOOKBOOK_CATEGORY_ID && (
          <FastImage
            source={this.props.imageUrl}
            resizeMode="contain"
            style={styles.image}
          />
        )}
        {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
        <View style={styles.paddingLeft}>
          {this.props.cid != LOOKBOOK_CATEGORY_ID && (
            <Text style={styles.mainText}>{this.props.name.trim()}</Text>
          )}
          {this.props.cid == LOOKBOOK_CATEGORY_ID && (
            <Text style={styles.mainTextLookbook}>{this.props.name.trim()}</Text>
          )}
          {/* <Text style={styles.subText}>{this.props.quantity}</Text> */}
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Icon size={30} name="ios-arrow-forward" type="ionicon" />
        </View>
      </TouchableOpacity>
    );
  }
}
let Width = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  button: {flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center'},
  image: {
    height: Height * 0.2,
    width: Width * 0.24,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  mainText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    lineHeight: 28,
    maxWidth: 200,
  },
  mainTextLookbook: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  subText: {fontSize: 14, lineHeight: 18, color: '#2967ff'},
  paddingLeft: {paddingLeft: 20},
});

export default CategoriesListItem;
