import React, {Component} from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';

export default class ConfirmationSuccess extends Component {
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Text> textInComponent </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
