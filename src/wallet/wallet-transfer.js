import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
require('bignumber.js');
import { Button } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import WalletUtil from '../utils/WalletUtil.js';

class WalletTransferScreen extends React.Component {
  static navigationOptions = { headerTitle: '转账', };

  state = {
    receiver: null,
    amount: null,
    remark: null,
    ruleForm: {
      addressList: [],
      value: "",
      to: "",
      IsEntrustTx: "",
      ExtraTimeTxType: "0",
      gas: global.httpProvider.fromWei(210000 * 18000000000),
      token: "MAN",
      gasLimit: 210000,
      gasPrice: 18000000000,
      extra_to: [[0, 0, []]],
      data: "",
      nonce: ""
    },
    myNonceNum: 0,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <Text style={styles.receiverHeader}>接受地址</Text>
        <TextInput
          style={styles.receiverInput}
          placeholder='输入对方钱包MAN地址'
          returnKeyType='done'
          onChangeText={(text) => this.setState({ receiver: text })}
          value={this.state.receiver}
        />
        <Text style={styles.amountHeader}>数量</Text>
        <TextInput
          style={styles.amountInput}
          placeholder='输入转账MAN数量'
          returnKeyType='done'
          onChangeText={(text) => this.setState({ receiver: text })}
          value={this.state.receiver}
        />
        <Text style={styles.remarkHeader}>备注</Text>
        <TextInput
          style={styles.remarkInput}
          placeholder='输入交易备注'
          returnKeyType='done'
          onChangeText={(text) => this.setState({ receiver: text })}
          value={this.state.receiver}
        />
        <Button
            // onPress={this._onSubmit.bind(this)}
            onPress={() => {
              console.log('sss');
              this.props.navigation.navigate('PinCodeModal');
            }}
            title='转账'
            buttonStyle={styles.actionRight}
            containerStyle={styles.actionRightContainer}
            titleStyle={styles.actionRightTitle}
          />

      </View>
    );
  }

  // componentDidMount() {

  //   asyncIO = async () => {
  //     try {
  //       // const address = await AsyncStorage.getItem('@address');
  //       // console.log(address);

  //       await global.httpProvider.man.getBalance('MAN.2TKMHtJbgcFiiviX2GZQNf4hNFoYW', (error, result) => {
  //         console.log(result);
  //         if (error === null) {
  //           let balance = result[0].balance.toFixed(2);
  //           this.setState({
  //             currenryArr: [result[0]],
  //             balance: balance,
  //           })
  //         }
  //       });

  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   asyncIO();
  // }

  _onSubmit() {

    // let address;
    // asyncIO = async () => {
    //   try {
    //     address = await AsyncStorage.getItem('@address');
    //   } catch (e) {
    //     console.log(e);
    //   }

    //   let nonce = this.httpProvider.man.getTransactionCount(address);
    //   let myNonceNum = 0;
      
    //   this.ruleForm.nonce = global.httpProvider.man.getTransactionCount(address);
    //   this.ruleForm.nonce += this.state.myNonceNum;
    //   this.ruleForm.nonce =  WalletUtil.numToHex(this.state.ruleForm.nonce);
    //   let jsonObj = TradingFuns.getTxData(this.state.ruleForm);
    //   let tx = WalletUtil.createTx(jsonObj);
    //   let privateKey = privateKeyParam;
    //   privateKey = Buffer.from(
    //     privateKey.indexOf("0x") > -1
    //       ? privateKey.substring(2, privateKey.length)
    //       : privateKey,
    //     "hex"
    //   );
    //   tx.sign(privateKey);
    //   let serializedTx = tx.serialize();
    //   this.newTxData = SendTransfer.getTxParams(serializedTx);
    // }
    // asyncIO();

    
  }
}

export default WalletTransferScreen;

const styles = StyleSheet.create({
  receiverHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 150,
    marginLeft: 16,
  },
  receiverInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  amountHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 20,
    marginLeft: 16,
  },
  amountInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  remarkHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 20,
    marginLeft: 16,
  },
  remarkInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  actionRight: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 6,
  },
  actionRightContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 56,
  },
  actionRightTitle: {
    color: '#fff',
    fontSize: 16,
  },
});

