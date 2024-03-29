import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Alert } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from '../utils/WalletUtil.js';
import utils from '../utils/utils.js';
import md5 from '../utils/md5.js';
import filters from '../utils/filters.js';
import { aa, bb, contract } from "../profiles/config.js";
import TradingFuns from "../utils/TradingFuns.js";
import SendTransfer from "../utils/SendTransfer.js";
import Modal from 'react-native-modal';

export default class StakePostScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const isEditing = navigation.getParam('isEditing', false);
    if (isEditing) {
      return {
        headerTitle: '编辑节点',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      };
    } else {
      return {
        headerTitle: '创建节点',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      };
    }
  };

  constructor(props) {
    super(props);

    let isEditing = props.navigation.getParam('isEditing', false);
    let stake = props.navigation.getParam('stake', {});
    let nodeAddress;
    if (isEditing === true && stake.OwnerInfo !== null) {
      nodeAddress = stake.OwnerInfo.SignAddress;
    }
    let nodeRate;
    if (isEditing === true && stake.Reward !== null && stake.Reward.NodeRate !== null) {
      nodeRate = (stake.Reward.NodeRate.Rate / stake.Reward.NodeRate.Decimal * 100).toString();
    }

    this.state = {
      address: null,
      balance: null,
      stake: stake,
      name: stake.name,
      nodeAddress: nodeAddress,
      amount: stake.allAmountFif,
      nodeRate: nodeRate,
      period: null,
      periodSelectedIndex: null,
      ownerRate: 1,
      lvlRate: [1, 1, 1],
      myNonceNum: 0,
      passcode: null,
      isModalVisible: false,
      isLoading: false,
      isEditing: isEditing,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.inputTopView}>
          <Text style={styles.inputTitle}>节点名称</Text>
          <TextInput
            editable={this.state.isEditing !== true}
            style={this.state.isEditing !== true ? styles.input : styles.inputDisabled}
            placeholder='输入节点名称'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputTitle}>签名地址</Text>
          <TextInput
            style={styles.input}
            placeholder='输入签名地址'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ nodeAddress: text })}
            value={this.state.nodeAddress}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputTitle}>抵押MAN数量</Text>
          <TextInput
            editable={this.state.isEditing !== true}
            style={this.state.isEditing !== true ? styles.input : styles.inputDisabled}
            placeholder='抵押数量不得低于10000'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ amount: text })}
            value={this.state.amount}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputTitle}>节点管理费（%）</Text>
          <TextInput
            editable={this.state.isEditing !== true}
            style={this.state.isEditing !== true ? styles.input : styles.inputDisabled}
            placeholder='输入节点管理费'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ nodeRate: text })}
            value={this.state.nodeRate}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputTitle}>节点周期</Text>
          <ButtonGroup
            disabled={this.state.isEditing}
            containerStyle={styles.periodContainer}
            buttonStyle={styles.periodBtn}
            containerBorderRadius={0}
            innerBorderStyle={{ width: 10, color: '#fff' }}
            selectedButtonStyle={styles.periodSelectedBtn}
            textStyle={styles.periodText}
            selectedTextStyle={styles.periodSelectedText}
            onPress={(index) => {
              if (index === 0) {
                this.setState({
                  periodSelectedIndex: index,
                  period: '0',
                });
              } else if (index === 1) {
                this.setState({
                  periodSelectedIndex: index,
                  period: '1',
                });
              } else if (index === 2) {
                this.setState({
                  periodSelectedIndex: index,
                  period: '3',
                });
              } else if (index === 3) {
                this.setState({
                  periodSelectedIndex: index,
                  period: '6',
                });
              } else if (index === 4) {
                this.setState({
                  periodSelectedIndex: index,
                  period: '12',
                });
              }

            }}
            selectedIndex={this.state.periodSelectedIndex}
            buttons={['活期', '1个月', '3个月', '6个月', '12个月']}
          />
        </View>
        <View style={{ alignSelf: 'stretch' }}>

        </View>

        <Button
          loading={this.state.isLoading}
          disabled={this.state.isLoading}
          onPress={this._onSubmit.bind(this)}
          title='确定'
          buttonStyle={styles.action}
          containerStyle={styles.actionContainer}
          titleStyle={styles.actionTitle}
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
            <View style={{ marginTop: 26, paddingHorizontal: 35, alignSelf: 'stretch', }}>
              <TextInput
                secureTextEntry={true}
                style={styles.modalInput}
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
              containerStyle={{
                width: '100%',
                marginTop: 26,
                height: 58,
                paddingHorizontal: 30,
                marginBottom: 50,
              }}
              titleStyle={styles.actionTitle}
            />
          </View>
        </Modal>
      </SafeAreaView>

    );
  }

  componentDidMount() {
    this._fetchData();
  }

  async _fetchData() {
    try {
      const address = await AsyncStorage.getItem('@address');
      this.setState({
        address: address,
      })

      global.httpProvider.man.getBalance(address, (error, result) => {
        if (error === null) {
          let balance = filters.weiToNumber(result[0].balance);
          this.setState({
            balance: balance,
          })
        }
      });

    } catch (e) {
      console.log(e);
    }
  }

  _onSubmit() {

    if (this.state.isEditing === true) {
      if (global.httpProvider.fromUtf8(this.state.name).length > 66) {
        
        Toast.show("节点名称不能超过66个字符", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });

        return false;
      }

      this.setState({
        isModalVisible: true,
      });

      return;
    }

    if (
      !/(^[0-9]\d*$)/.test(this.state.nodeRate) &&
      !this.state.nodeRate > -1 &&
      !this.state.nodeRate <= 100
    ) {
      
      Toast.show("节点管理费必须在1-100之间", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return false;

    } else if (this.state.amount < 100000) {
      
      Toast.show("抵押数量不得低于100000", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return false;

    } else if (this.state.nodeAddress === null) {
      
      Toast.show("节点地址不能为空", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return false;
    } else if (global.httpProvider.fromUtf8(this.state.name).length > 66) {
      
      Toast.show("节点名称不能超过66个字符", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return false;
    } else if (this.state.period === null) {
      
      Toast.show("抵押周期不能为空", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return false;

    } else if (parseInt(this.state.amount) > parseInt(this.state.balance)) {
      
      Toast.show("你的余额不足", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      
      return false;
    }

    this.setState({
      isModalVisible: true,
    });
  }

  _onSubmitPasscode() {
    if (this.state.isEditing === true) {
      this._editStake();
    } else {
      this._postStake();
    }
  }

  async _postStake() {
    let passcode;
    let keyStore;
    let pashadterss;
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
    });


    // 创建母合约 abi调用
    let contractAbiArray = JSON.parse(aa.abi);
    let contractAddress = aa.address;
    // 初始化abi
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014',
    );

    // 输入数值进行转化
    let myaddrTemps = SendTransfer.sanitizeHex(
      WalletUtil.addressChange(this.state.nodeAddress.split(".")[1])
    );
    let nodeRate = this.state.nodeRate * 10000000;
    // 生成交易凭证
    let result = contractAbi.methods
      .createValidatorGroup(
        myaddrTemps,
        this.state.period,
        this.state.ownerRate,
        nodeRate,
        this.state.lvlRate,
      )
      .encodeABI();

    let muhyFromNames = global.httpProvider
      .fromUtf8(this.state.name)
      .slice(2);
    let zero =
      "0000000000000000000000000000000000000000000000000000000000000000";
    muhyFromNames =
      zero.substr(0, 64 - muhyFromNames.length) + muhyFromNames;
    // rawTx.data = rawTx.data+zero.substr(0,64-tt.length)+tt;
    result += muhyFromNames;

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
        });
        console.log('getTransactionCount', error);

        return;
      }
      let nonce = resultData;
      nonce += this.state.myNonceNum;
      nonce = WalletUtil.numToHex(nonce);
      let data = {
        to: contractAddress, // MAN母合约不转化地址
        value: this.state.amount,
        gasLimit: 210000,
        data: "",
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      };
      let jsonObj = TradingFuns.getTxData(data);
      jsonObj.data = result;
      let tx = WalletUtil.createTx(jsonObj);

      let newPin = md5(pashadterss + passcode);
      let decrypt = utils.decrypt(keyStore, newPin);

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

      global.httpProvider.man.sendRawTransaction(newTxData, (error, resultData) => {
        if (error !== null) {
          if (error.message === 'insufficient funds for gas * price + value') {
            Toast.show("余额不足以支付交易手续费", {
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

            return
          }

          if (this.state.myNonceNum < 5) {
            this.setState({
              myNonceNum: this.state.myNonceNum + 1,
            }, () => {
              this._postStake();
            })
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
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
        });

        Alert.alert(
          '创建成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {text: '确定', onPress: () => {
              this.props.navigation.goBack();
            }, style: 'cancel'},
          ],
          { cancelable: false }
        )
      });
    });

  }

  async _editStake() {

    let passcode;
    let keyStore;
    let pashadterss;
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
    });
    
    // 创建母合约 abi调用
    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    // 初始化abi
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014',
    );

    // 输入数值进行转化
    let siginAddress = SendTransfer.sanitizeHex(
      WalletUtil.addressChange(this.state.nodeAddress.split(".")[1])
    );

    // 生成交易凭证
    // console.log(contractAbi.methods);
    // console.log(siginAddress);
    let result = contractAbi.methods
      .setSignAccount(siginAddress)
      .encodeABI();

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
        });
        console.log('getTransactionCount', error);
        
        return;
      }
      let nonce = resultData;
      nonce += this.state.myNonceNum;
      nonce = WalletUtil.numToHex(nonce);
      let data = {
        to: this.state.stake.name, // MAN母合约不转化地址
        value: this.state.amount,
        gasLimit: 210000,
        data: "",
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      };
      let jsonObj = TradingFuns.getTxData(data);
      jsonObj.data = result;
      let tx = WalletUtil.createTx(jsonObj);

      let newPin = md5(pashadterss + passcode);
      let decrypt = utils.decrypt(keyStore, newPin);

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

      global.httpProvider.man.sendRawTransaction(newTxData, (error, resultData) => {
        if (error !== null) {
          if (error.message === 'insufficient funds for gas * price + value') {
            Toast.show("余额不足以支付交易手续费", {
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

            return
          }

          if (this.state.myNonceNum < 5) {
            this.setState({
              myNonceNum: this.state.myNonceNum + 1,
            }, () => {
              this._postStake();
            })
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
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
        });

        Alert.alert(
          '编辑成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {text: '确定', onPress: () => {
              this.props.navigation.goBack();
            }, style: 'cancel'},
          ],
          { cancelable: false }
        )
      });
    });
  }
}

const styles = StyleSheet.create({
  inputTopView: {
    marginTop: 60,
    paddingHorizontal: 35,
    width: '100%',
  },
  inputView: {
    marginTop: 20,
    paddingHorizontal: 35,
    alignSelf: 'stretch',
  },
  inputTitle: {
    fontSize: 14,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  input: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 6,
    paddingTop: 10,
    fontSize: 15,
  },
  inputDisabled: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 6,
    paddingTop: 10,
    fontSize: 15,
    color: '#bdc6cf',
  },
  periodContainer: {
    marginTop: 12,
    height: 30,
    borderWidth: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  periodBtn: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#f2f2f2",
  },
  periodSelectedBtn: {
    borderWidth: 0,
    backgroundColor: "#fbbe07",
  },
  periodText: {
    fontSize: 14,
    color: "#222222",
    fontWeight: 'normal',
  },
  periodSelectedText: {
    color: "#fff",
  },
  periodOptionLeft: {
    fontSize: 14,
  },
  periodOptionMiddle: {
    fontSize: 14,
  },
  periodOptionRight: {
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    color: '#000',
    marginTop: 100,
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
  modalInput: {
    textAlign: 'center',
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
    marginTop: 136,
    height: 58,
    paddingHorizontal: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  }
});