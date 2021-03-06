import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  StatusBar,
  Linking,
} from 'react-native';
import {Icon} from 'react-native-elements';
import LogoSmall from '../components/Styles/LogoSmall';

/* How to use Custom Header

Props:
centerText: "provide the text to show in center"
rightIcon: "search" provide icon name ,supported icon names { info,search,share,edit } and "clear" Clear all text
homepage:true or false

*/
class Header extends PureComponent {
  lockSubmit = false;

  navigateBack = () => {
    if (this.lockSubmit) return;
    this.lockSubmit = true;
    this.props.navigation.goBack();
  };

  navigateToScreen = (screenName) => {
    this.props.navigation.navigate(screenName);
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: this.props.shareText,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  getRightIcon() {
    if (this.props.rightIcon == 'info') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.navigateToScreen('CompanyProfile');
          }}>
          <Icon
            size={30}
            name="md-information-circle-outline"
            type="ionicon"
            color="#000"
          />
        </TouchableOpacity>
      );
    } else if (this.props.rightIcon == 'search') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.navigateToScreen('SearchResults');
          }}>
          <Icon size={30} name="ios-search" type="ionicon" color="#000" />
        </TouchableOpacity>
      );
    } else if (this.props.rightIcon == 'trackOrder') {
      return (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(this.props.trackingURL);
          }}>
          <Icon
            size={30}
            name="truck-delivery"
            type="material-community"
            color="#000"
          />
        </TouchableOpacity>
      );
    } else if (this.props.rightIcon == 'share') {
      return (
        <TouchableOpacity onPress={this.onShare}>
          <Icon size={26} name="upload" type="feather" color="#000" />
        </TouchableOpacity>
      );
    } else if (this.props.rightIcon == 'edit') {
      return <Icon size={26} name="edit" type="feather" color="#000" />;
    } else if (this.props.rightIcon == 'filter') {
      return (
        <Image
          style={styles.iconStyle}
          source={require('../static/Filter.png')}></Image>
      );
    } else if (this.props.rightIcon == 'clear') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.rightIconClickHandler();
          }}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      );
    } else if (this.props.rightIcon == 'scanner') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.navigateToScreen('BarCodeScanner');
          }}>
          <Icon size={30} name="ios-barcode" type="ionicon" color="#000" />
        </TouchableOpacity>
      );
    } else {
      return <View style={styles.iconStyle}></View>;
    }
  }
  render() {
    return (
      <View>
        <View style={styles.topLevelView}>
          <View style={styles.subParent}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {this.props.homepage ? (
              <View style={styles.backView}></View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.navigateBack();
                  }}>
                  <Icon size={30} name="arrow-left" type="feather" />
                </TouchableOpacity>
              </View>
            )}

            {/* {this.props.homepage ? (
              <View style={styles.homePageCenterText}>
                <Text style={styles.centerText}>{this.props.centerText}</Text>
                <Text style={styles.homePersonText}>{this.props.person}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.centerText}>{this.props.centerText}</Text>
              </View>
            )} */}
            {/* <View>{this.getRightIcon()}</View> */}
          </View>
        </View>
        {/* <View style={styles.headerLogo}>
          <LogoSmall />
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  homePersonText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    fontFamily: 'Avenir-Book',
  },
  iconStyle: {height: 22, width: 20},
  clearAllText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    fontFamily: 'Avenir-Medium',
  },
  topLevelView: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  subParent: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  backView: {height: 30, width: 30},
  centerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  headerLogo: {
    //padding: 5,
    // lineHeight: 50,

    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  homePageCenterText: {marginTop: 5, alignItems: 'center'},
});
export default Header;
