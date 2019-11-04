import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Clipboard, Image, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import QRCode from 'react-native-qrcode-svg';
import filters from '../utils/filters.js';

class WalletQRCodeScreen extends React.Component {
  static navigationOptions = { headerTitle: '二维码', };

  state = {
    address: 'MAN.35dDuaK7Pb42338pXq5a6shtsTDoZ',
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7fb' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <View style={styles.qrcodeView}>
            <QRCode
              size={Dimensions.get('window').width - 60 - 50}
              value={this.state.address}
              logo={require('../../resources/img/wallet/wallet_currencyMark.png')}
              logoSize={38}
              logoBorderRadius={6}
            ></QRCode>
          </View>
          <Text ellipsizeMode='tail' numberOfLines={1}>{this.state.address}</Text>
          <Button
            onPress={this._onPressCopy.bind(this)}
            title='复制编码'
            buttonStyle={styles.action}
            containerStyle={styles.actionContainer}
            titleStyle={styles.actionTitle}
          />
        </View>


      </View>
    );
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

  componentDidMount() {

    asyncIO = async () => {
      try {
        const address = await AsyncStorage.getItem('@address');
        console.log(address);

        this.setState({
          address: address,
        })

      } catch (e) {
        console.log(e);
      }
    }
    asyncIO();
  }

}

export default WalletQRCodeScreen;

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
    marginHorizontal: 25,
    flexShrink: 1,
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

