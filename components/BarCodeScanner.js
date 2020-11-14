import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Toast from 'react-native-simple-toast';

const PendingView = () => (
  <View style={styles.PendingView}>
    <Text>Waiting</Text>
  </View>
);

export default class BarCodeScanner extends Component {
  state = {
    barCodeRead: false,
  };

  componentDidMount() {
    this.onComponentFocus = this.props.navigation.addListener('focus', () => {
      this.setState({barCodeRead: false});
    });
  }

  onBarCodeRead = (barcode) => {
    if (barcode.barcodes[0]) {
      console.log(barcode.barcodes[0].data);
      if (!this.state.barCodeRead) {
        this.setState({barCodeRead: true});
        Toast.show('Barcode read successfully');
        this.props.navigation.navigate('SearchResults', {
          barcode: barcode.barcodes[0],
        });
      }
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
          onGoogleVisionBarcodesDetected={this.onBarCodeRead}
          googleVisionBarcodeType={
            RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL
          }
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
