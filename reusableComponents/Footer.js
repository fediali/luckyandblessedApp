import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Text,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Globals from '../Globals';
class Footer extends Component {
  /* How to use Custom footer
    
    Name of options corresponding to Icons:
    Home, Shop, Van, Person, Info

    Just Include Footer No Props Needed
    
    */
  constructor(props) {
    super(props);
    if (this.props.selected != null) {
      this.state = {
        selected: this.props.selected,
      };
    } else {
      this.state = {
        selected: 'Home',
      };
    }
  }

  navigateToScreen = (screenName) => {
    this.props.navigation.navigate(screenName);
  };

  render() {
    return (
      <View style={innerStyles.mainViewStyle}>
        <View style={innerStyles.subViewStyle}>
          <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('MainPage');
            }}>
            {this.state.selected == 'Home' ? (
              <Icon size={32} name="home" type="entypo" color="#1bbfc7" />
            ) : (
              <Icon size={32} name="home" type="entypo" color="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('SearchResults');
            }}>
            {this.state.selected == 'Search' ? (
              <ImageBackground
                style={innerStyles.imageStyle}
                source={require('../static/searchSelected.png')}></ImageBackground>
            ) : (
              <ImageBackground
                style={innerStyles.imageStyle}
                source={require('../static/search.png')}></ImageBackground>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('ShoppingCart');
            }}>
            {this.state.selected == 'Shop' ? (
              <ImageBackground
                style={innerStyles.imageStyle}
                source={require('../static/cartSelected.png')}>
                <View
                  style={{
                    height: 16,
                    width: 28,
                    backgroundColor: '#000',
                    borderRadius: 8,
                    marginLeft: 10,
                    marginTop: -5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Avenir-Medium',
                      color: '#fff',
                      fontSize: 12,
                      lineHeight: 16,
                    }}>
                    {Globals.cartCount}
                  </Text>
                </View>
              </ImageBackground>
            ) : (
              <ImageBackground
                style={innerStyles.imageStyle}
                source={require('../static/cart.png')}>
                <View
                  style={{
                    height: 15,
                    width: 25,
                    backgroundColor: '#000',
                    borderRadius: 8,
                    marginLeft: 10,
                    marginTop: -5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Avenir-Medium',
                      color: '#fff',
                      fontSize: 12,
                      lineHeight: 16,
                    }}>
                    {Globals.cartCount}
                  </Text>
                </View>
              </ImageBackground>
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('TrackOrders');
            }}>
            {this.state.selected == 'Van' ? (
              <Icon
                size={35}
                name="truck"
                type="material-community"
                color="#1bbfc7"
              />
            ) : (
              <Icon
                size={35}
                name="truck"
                type="material-community"
                color="#000"
              />
            )}
          </TouchableOpacity> */}
          <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('UserProfile');
            }}>
            {this.state.selected == 'Person' ? (
              <Icon
                size={35}
                name="ios-person"
                type="ionicon"
                color="#1bbfc7"
              />
            ) : (
              <Icon size={35} name="ios-person" type="ionicon" color="#000" />
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={innerStyles.touchPad}
            onPress={() => {
              this.navigateToScreen('CompanyProfile');
            }}>
            {this.state.selected == 'Info' ? (
              <Icon
                size={35}
                name="md-information-circle-outline"
                type="ionicon"
                color="#1bbfc7"
              />
            ) : (
              <Icon
                size={35}
                name="md-information-circle-outline"
                type="ionicon"
                color="#000"
              />
            )}
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const innerStyles = StyleSheet.create({
  mainViewStyle: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  subViewStyle: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchPad: {
    paddingHorizontal: 8,
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
});

export default Footer;
