import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Clipboard, Image, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera as Camera } from 'react-native-camera';

class WalletScannerScreen extends React.Component {
  static navigationOptions = { headerTitle: '二维码', };

  state = {
    address: 'MAN.35dDuaK7Pb42338pXq5a6shtsTDoZ',
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7fb' }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <QRCodeScanner
          onRead={this._onSuccess.bind(this)}
          flashMode={Camera.Constants.FlashMode.torch}
          topContent={
            <Text style={styles.centerText}>
              Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
          </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }

  _onSuccess(e) {
    console.log(e.data);
  }

  _onPressCopy() {
    Clipboard.setString(this.state.address);

    Toast.show("复制成功", {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

}

export default WalletScannerScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  qrcodeView: {
    margin: 25,
    marginBottom: 16,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 60 - 50,
    height: Dimensions.get('window').width - 60 - 50,
  },
  qrcodeText: {
    fontSize: 13,
    color: '#222',
  },
  action: {
    backgroundColor: 'rgba(251, 190, 7, 0.1)',

    borderRadius: 6,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  actionContainer: {
    marginTop: 12,
    marginBottom: 25,
  },
  actionTitle: {
    color: '#fbbe07',
    fontSize: 14,
    lineHeight: 30,
  },
});

