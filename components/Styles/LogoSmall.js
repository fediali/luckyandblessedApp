import React, {PureComponent} from 'react';
import {View, Image, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';

class LogoSmall extends PureComponent {
  render() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;
    return (
      <FastImage
        style={{
          width: width * 0.3,
          height: height * 0.25,
        }}
        resizeMode="contain"
        source={require('../../static/logo-signIn.png')}
      />
    );
  }
}

export default LogoSmall;
