import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

const PendingView = () => (
  <View style={styles.PendingView}>
    <Text>Waiting</Text>
  </View>
);

export default class BarCodeScanner extends Component {
  state = {
    barCodeRead: false,
  };

  onBarCodeRead = (barcode) => {
    if (!this.state.barCodeRead){
      this.setState({barCodeRead: true})
      Alert.alert("Barcode value is"+barcode.data ,"Barcode type is"+barcode.type);
      this.props.navigation.navigate("SearchResults", barcode);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
          onBarCodeRead={this.onBarCodeRead}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}></View>
            );
          }}
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  PendingView: {
    flex: 1,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
