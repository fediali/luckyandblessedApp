import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';


class ProfileText extends PureComponent {
  render() {
    return (
      <View>
        {this.props.containIcon ? (
          <View>
            <View style={styles.userDetails}>
              <View style={styles.mainViewPad}>
                <Text style={styles.keyText}>{this.props.keyText}</Text>
              </View>
              <View style={styles.rowView}>
                <View style={styles.mainViewPad}>
                  <Text style={styles.valueText}>{this.props.valueText}</Text>
                </View>
                <View
                  style={styles.iconView}>
                  <Icon size={20} name="right" type="antdesign" />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.userDetails}>
              <View style={styles.mainViewPad}>
                <Text style={[styles.keyText]}>{this.props.keyText}</Text>
              </View>
              <View style={styles.mainViewPad}>
                <Text style={([styles.valueText])}>
                  {this.props.valueText}
                </Text>
              </View>
            </View>
          </View>
        )}
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
  mainViewPad:{
    paddingVertical: 19
  },
  rowView:{
    flexDirection: 'row'
  },
  iconView:{
    marginVertical: 18,
    marginRight: 6,
    marginLeft: 19.5,
  },
});

export default ProfileText;
