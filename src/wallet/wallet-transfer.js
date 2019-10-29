import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
require('bignumber.js');
import { Button } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import WalletUtil from '../utils/WalletUtil.js';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import SendTransfer from '../utils/SendTransfer.js';
import TradingFuns from '../utils/TradingFuns.js';
import md5 from '../utils/md5.js';
import utils from '../utils/utils.js';

class WalletTransferScreen extends React.Component {
  static navigationOptions = { headerTitle: '转账', };

  state = {
    remark: null,
    ruleForm: {
      addressList: [],
      value: "10",
      to: 'MAN.35dDuaK7Pb42338pXq5a6shtsTDoZ',
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
    isModalVisible: false,
    passcode: 'Vergilw123',
    isLoading: false,
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
          onChangeText={(text) => this.setState({
            ruleForm: {
              ...this.state.ruleForm,
              to: text
            }
          })}
          value={this.state.ruleForm.to}
        />
        <Text style={styles.amountHeader}>数量</Text>
        <TextInput
          style={styles.amountInput}
          placeholder='输入转账MAN数量'
          returnKeyType='done'
          onChangeText={(text) => this.setState({
            ruleForm: {
              ...this.state.ruleForm,
              value: text
            }
          })}
          value={this.state.ruleForm.value}
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
          loading={this.state.isLoading}
          disabled={this.state.isLoading}
          onPress={this._onSubmitTransfer.bind(this)}
          title='转账'
          buttonStyle={styles.actionRight}
          containerStyle={styles.actionRightContainer}
          titleStyle={styles.actionRightTitle}
        />

        <Modal
          style={{ margin: 0, justifyContent: 'flex-end', }}
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          swipeDirection={['down']}
        >
          <View style={styles.modal}>
            <View style={styles.modalHandle}></View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder='请输入PIN码，以此验证你的身份'
                returnKeyType='done'
                onChangeText={(text) => this.setState({ passcode: text })}
                value={this.state.passcode}
              />
            </View>
            <Button
              onPress={this._onSubmitPasscode.bind(this)}
              title='确定'
              buttonStyle={styles.action}
              containerStyle={styles.actionContainer}
              titleStyle={styles.actionTitle}
            />
          </View>
        </Modal>
      </View>
    );
  }

  _onSubmitTransfer() {
    this.setState({
      isModalVisible: true,
    })
  }

  _onSubmitPasscode() {

    let that = this;

    asyncIO = async () => {

      //get passcode from disk
      let passcode
      let keyStore
      let pashadterss
      try {
        passcode = await AsyncStorage.getItem('@passcode');
        keyStore = await AsyncStorage.getItem('@keyStore');
        pashadterss = await AsyncStorage.getItem('@pashadterss');

      } catch (e) {
        console.log(e);
      }

      //validate passcode
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z]\S{7,15}$/;
      if (!reg.test(this.state.passcode) || this.state.passcode !== passcode) {
        console.log(passcode);
        Toast.show("PIN码输入有误，请重新输入", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;
      }

      //dismiss passcode modal and show loading
      this.setState({
        isModalVisible: false,
        isLoading: true,
      })

      //get address from disk
      let address;
      try {
        address = await AsyncStorage.getItem('@address');
      } catch (e) {
        console.log(e);
        this.setState({
          isLoading: false,
        })
      }


      let newPin = md5(pashadterss + passcode);
      let decrypt = utils.decrypt(keyStore, newPin);

      let nonce;

      global.httpProvider.man.getTransactionCount(address, (error, result) => {

        if (error !== null) {
          console.log('getTransactionCount', error);
          this.setState({
            isLoading: false,
          });
          return;
        }
        nonce = result;
        console.log('getTransactionCount', result);

        nonce += this.state.myNonceNum;

        nonce = WalletUtil.numToHex(nonce);

        this.setState({
          ruleForm: {
            ...this.state.ruleForm,
            nonce: nonce,
          }
        }, () => {
          console.log('setup ruleForm', this.state.ruleForm);

          let jsonObj = TradingFuns.getTxData(this.state.ruleForm);
          let tx = WalletUtil.createTx(jsonObj);
          let privateKey = decrypt;
          privateKey = Buffer.from(
            privateKey.indexOf("0x") > -1
              ? privateKey.substring(2, privateKey.length)
              : privateKey,
            "hex"
          );
          tx.sign(privateKey);
          let serializedTx = tx.serialize();
          let newTxData = SendTransfer.getTxParams(serializedTx);

          console.log('done', newTxData);


          //send transaction
          global.httpProvider.man.sendRawTransaction(newTxData, (error, result) => {

            if (error !== null) {
              if (this.state.myNonceNum < 5) {
                //retry send transaction
                this.setState({
                  myNonceNum: this.state.myNonceNum + 1
                }, () => {
                  this._onSubmitPasscode();
                });

              } else {
                Toast.show("交易正在处理中", {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.CENTER,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                });

                this.setState({
                  isLoading: false,
                });
              }

              console.log('sendRawTransaction error', error);
              return;
            }

            console.log('sendRawTransaction success', result)
            that._onSuccess(result);
          });

        })
      });

    }
    asyncIO();
  }

  async _onSuccess(transaction) {
    let hash = transaction;
    let nS = new Date().getTime()

    let record = {
      receiver: this.state.ruleForm.to,
      time: nS,
      amount: this.state.ruleForm.value,
      hash: hash,
      remark: this.state.remark,
      isTransferOut: true,
    }
    let myTransfer

    try {
      myTransfer = await AsyncStorage.getItem('@myTransfer');
    } catch (e) {
      console.log(e);
    }

    if (myTransfer) {
      let myTransfers = JSON.parse(myTransfer);
      myTransfers.push(record)
      try {
        await AsyncStorage.setItem('@myTransfer', JSON.stringify(myTransfers));
      } catch (e) {
        console.log(e);
      }
    } else {
      let myTransfers = [record]
      try {
        await AsyncStorage.setItem('@myTransfer', JSON.stringify(myTransfers));
      } catch (e) {
        console.log(e);
      }
    }

    this.setState({
      myNonceNum: 0,
      isLoading: false,
      ruleForm: {
        ...this.state.ruleForm,
        to: null,
        value: null,
      },
    });

    Toast.show("转账成功", {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
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
  modal: {
    borderRadius: 16,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalHandle: {
    width: 38,
    height: 5,
    backgroundColor: 'rgba(45, 45, 45, 0.2)',
    borderRadius: 2.5,
    marginTop: 22,
  },
  inputView: {
    marginTop: 60,
    paddingHorizontal: 35,
    width: '100%',
  },
  input: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingBottom: 10,
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
    marginTop: 26,
    height: 58,
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  },
});

