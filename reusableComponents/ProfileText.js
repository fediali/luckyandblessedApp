import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {round} from 'react-native-reanimated';

//TODO: Fix the forward icon

class ProfileText extends PureComponent {
  render() {
    return (
      <View style={styles.userDetails}>
        <View style={{paddingVertical: 19}}>
          <Text style={styles.keyText}>{this.props.keyText}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingBottom: 12.2, paddingTop: 22.8}}>
            <Text style={styles.valueText} numberOfLines={1}>
              {this.props.valueText}{' '}
            </Text>
          </View>

          {this.props.containIcon && (
            <TouchableOpacity
              style={{
                marginBottom: 21.5,
                marginTop: 21.5,
                marginRight: 7,
                marginLeft: 19.5,
              }}>
              <Icon size={20} name="right" type="antdesign" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  keyText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  valueText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
  },
});

export default ProfileText;
