import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from '../utils/WalletUtil.js';
import Utils from '../utils/utils.js';

export default class MnemonicDisplayScreen extends React.Component {
  static navigationOptions = { headerTitle: '助记词' };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />

        <View style={styles.topView}>
          <View style={styles.wordsView}>
            <Text style={styles.wordsText} >BitCoin</Text>
            <Text style={styles.wordsSequence} >1/12</Text>
          </View>
          <Text style={styles.captionText} >请按顺序写下单词并保存在安全的地方</Text>
        </View>
        <View style={styles.actionView}>
          <Button
            disabled='true'
            onPress={this._onSubmit.bind(this)}
            title='上一个'
            buttonStyle={styles.action}
            containerStyle={styles.actionPreviousContainer}
            titleStyle={styles.actionTitle}
            disabledStyle={styles.actionDisabled}
            disabledTitleStyle={styles.actionTitleDisabled} />
          <Button
            onPress={this._onSubmit.bind(this)}
            title='下一个'
            buttonStyle={styles.action}
            containerStyle={styles.actionNextContainer}
            titleStyle={styles.actionTitle}
            disabledStyle={styles.actionDisabled}
            disabledTitleStyle={styles.actionTitleDisabled} />
        </View>

      </SafeAreaView>
    );
  }

  _onSubmit() {
    let mnemonic = WalletUtil.createMnemonic();
    let privateKey = WalletUtil.mnemonicToPrivateKey(mnemonic).toString("hex");
    
    // this.mnemonicList = mnemonic.split(" ");
    // this.privateKey = privateKey;
    var wallet = WalletUtil.privateKeyToWallet(privateKey);
    let pashadterss = wallet.signingKey.publicKey.split('').reverse().join("");

    console.log(mnemonic, wallet, pashadterss);
    // localStorage.setItem("pashadterss",pashadterss);
    // localStorage.setItem("address", this.wallet.address);
    // this.password = this.$route.params.pin;
    // let newPin = localStorage.getItem('pashadterss')+this.password;
    //     newPin = md5(newPin);
    // this.keyStore = utils.encrypt(privateKey,newPin);
    // localStorage.setItem('keyStore',this.keyStore)
    // let encrypt = utils.encrypt(mnemonic,newPin);
    // localStorage.setItem('encrypt',encrypt);
  }
}

const styles = StyleSheet.create({
  topView: {
    marginTop: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 222,
    height: 222,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#f0f1f2',
    borderRadius: 7.5,
    shadowColor: 'rgba(134, 142, 155, 0.09)',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  wordsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 15,
  },
  wordsSequence: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 15,
  },
  captionText: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 32,
    marginHorizontal: 65,
    lineHeight: 22,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 12,
    marginHorizontal: 75,
    lineHeight: 21,
    textAlign: 'center',
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 58,
    marginBottom: 80,
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionDisabled: {
    backgroundColor: 'rgba(251, 190, 7, 0.1)',
  },
  actionPreviousContainer: {
    flex: 1,
    paddingLeft: 30,
  },
  actionNextContainer: {
    flex: 2,
    paddingLeft: 10,
    paddingRight: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  },
  actionTitleDisabled: {
    color: '#fbbe07',
  }
});