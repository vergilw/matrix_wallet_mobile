import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Alert, TextInput, Dimensions, SectionList, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import WalletUtil from '../utils/WalletUtil.js';
import utils from '../utils/utils.js';
import md5 from '../utils/md5.js';
import filters from '../utils/filters.js';
import { aa, bb, contract } from "../profiles/config.js";
import TradingFuns from "../utils/TradingFuns.js";
import SendTransfer from "../utils/SendTransfer.js";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export default class StakeDetailScreen extends React.Component {

  _menu = null;

  static navigationOptions = ({ navigation }) => {

    return {
      headerRight: () => {
        let stake = navigation.getParam('stake');
        let address = navigation.getParam('address');

        if (address !== stake.OwnerInfo.Owner) {
          return null;
        }

        return (
          <Menu
            ref={ref => {
              this._menu = ref;
            }}
            button={<Text onPress={() => {
              this._menu.show();
            }} style={styles.navigationEditText}>编辑</Text>}
            style={styles.menu}
          >
            <MenuItem
              style={styles.menuItem}
              textStyle={styles.menuItemText}
              onPress={() => {
                this._menu.hide();
                let func = navigation.getParam('onEditStake');
                func();
              }}
            >
              编辑
          </MenuItem>
            <MenuDivider color={'rgba(255, 255, 255, 0.2)'} />
            <MenuItem
              style={styles.menuItem}
              textStyle={styles.menuItemText}
              onPress={() => {
                this._menu.hide();
                let func = navigation.getParam('onDeleteStake');
                func();
              }}
            >
              停用
          </MenuItem>
          </Menu>
        )
      },
    }
  };

  ActionType = Object.freeze({
    RedeemCurrent: Symbol("1"),
    RedeemTime: Symbol("2"),
    Withdraw: Symbol("3"),
    WithdrawReward: Symbol("4"),
    EditStake: Symbol("5"),
    DeleteStake: Symbol("6")
  });

  constructor(props) {
    super(props);

    let stake = props.navigation.getParam('stake');

    let isStakeExpired = false;
    let time = stake.OwnerInfo.WithdrawAllTime;
    if (time !== 0 && time < new Date().getTime()/1000) {
      isStakeExpired = true;
    }

    this.state = {
      stake: stake,
      balance: null,
      address: null,
      entrustAmount: null,
      partnerAmount: stake.ValidatorMap.length,
      nodeRate: stake.Reward.NodeRate.Rate / stake.Reward.NodeRate.Decimal * 100,
      reward: 0,
      currentAmount: 0,
      currentInterest: 0,
      stakeRecordArr: null,
      isStakeExpired: isStakeExpired,

      myNonceNum: 0,
      redeemCurrentAmount: null,
      redeemTimeAmount: null,
      redeemTimePosition: null,
      widthdrawAmount: null,

      actionType: null,
      isRedeemModalVisible: false,
      passcode: null,
      isModalVisible: false,
      isLoading: false,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <SectionList
          style={styles.list}
          sections={this.state.stakeRecordArr}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          // getItemLayout={(data, index) => (
          //   { length: 75, offset: 76 * index, index }
          // )}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 1, backgroundColor: '#f0f1f2' }}>
            </View>
          }}
          ListHeaderComponent={this._renderHeader}
          // ListFooterComponent={this._renderFooter}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />
        {
          !this.state.isStakeExpired && (
            <View style={styles.bottomFloatView}>
              <Button
                // loading={this.state.isLoading}
                // disabled={this.state.isLoading}
                onPress={() => {
                  this.props.navigation.navigate('StakeJoin', { 'stake': this.state.stake });
                }}
                title='加入节点' buttonStyle={styles.action}
                containerStyle={styles.actionContainer}
                titleStyle={styles.actionTitle}
              />
            </View>
          )
        }

        <Modal
          style={{ margin: 0, justifyContent: 'flex-end', }}
          isVisible={this.state.isRedeemModalVisible}
          onSwipeComplete={() => this.setState({ isRedeemModalVisible: false })}
          onBackdropPress={() => this.setState({ isRedeemModalVisible: false })}
          swipeDirection={['down']}
        >
          <View style={styles.modal}>
            <View style={styles.modalHandle}></View>
            <View style={{ marginTop: 26, paddingHorizontal: 35, alignSelf: 'stretch', }}>
              <TextInput
                style={styles.modalInput}
                placeholder='请输入赎回活期的数量'
                returnKeyType='done'
                keyboardType='decimal-pad'
                onChangeText={(text) => this.setState({ redeemCurrentAmount: text })}
                value={this.state.redeemCurrentAmount}
              />
            </View>
            <Button
              onPress={() => {
                this.setState({
                  isRedeemModalVisible: false,
                }, () => {
                  setTimeout(() => {
                    this.setState({
                      isModalVisible: true,
                    })
                  }, 1000);
                });
              }}
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
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
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

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index, section }) => {
    if (section.index === 0) {

      let amount = global.httpProvider.fromWei(item.WithDrawAmount);
      if (amount.indexOf(".") != -1) {
        amount = amount.substring(0, amount.indexOf(".") + 5);
      }

      return <StakeCurrentItem
        onPressItem={(item) => {
          console.log('press', item);
        }}
        item={item}
        amount={amount}
        time={item.WithDrawTime}
      />;
    } else if (section.index === 1) {

      let amount = global.httpProvider.fromWei(item.Amount);
      if (amount.indexOf(".") != -1) {
        amount = amount.substring(0, amount.indexOf(".") + 5);
      }

      let type;
      if (item.DType === 0) {
        type = '活期';
      } else if (item.DType === 1) {
        type = '1个月';
      } else if (item.DType === 3) {
        type = '3个月';
      } else if (item.DType === 16) {
        type = '6个月';
      } else if (item.DType === 12) {
        type = '12个月';
      }

      return <StakeTimeItem
        onRedeem={({ amount, position }) => {
          this.setState({
            redeemTimeAmount: amount,
            redeemTimePosition: position,
          }, () => {
            this._onRedeemTime();
          })
        }}
        onWithdraw={({ amount, position }) => {
          // console.log('press', item);
        }}
        item={item}
        amount={amount}
        type={type}
        time={item.EndTime}
        position={item.Position}
      />;
    }

  };

  _renderHeader = () => {
    let expiredDate = '活期';
    if (this.state.stake.OwnerInfo.WithdrawAllTime !== 0) {
      expiredDate = moment(this.state.stake.OwnerInfo.WithdrawAllTime * 1000).format('YYYY.M.D HH:mm:ss')
    }
    return (
      <View>
        <View style={styles.overviewView}>
          <Text style={styles.overviewTitleText}>{this.state.stake.name}</Text>
          <Text style={styles.overviewCaptionText}>
            <Text style={styles.overviewCaptionTitleText}>发起人：</Text>
            <Text style={styles.overviewCaptionValueText}>{this.state.stake.OwnerInfo.Owner}</Text>
          </Text>
          <Text style={styles.overviewCaptionText}>
            <Text style={styles.overviewCaptionTitleText}>发起人委托到期时间：</Text>
            <Text style={styles.overviewCaptionValueText}>{expiredDate}</Text>
          </Text>
          <View style={styles.overviewSeparatorView}></View>
          <View style={styles.overviewFooterView}>
            <View style={styles.overviewItemView}>
              <Text style={styles.overviewItemValueText}>{this.state.entrustAmount}</Text>
              <Text style={styles.overviewItemTitleText}>金额</Text>
            </View>
            <View style={styles.overviewItemView}>
              <Text style={styles.overviewItemValueText}>{this.state.nodeRate}%</Text>
              <Text style={styles.overviewItemTitleText}>管理费</Text>
            </View>
            <View style={styles.overviewItemEndView}>
              <Text style={styles.overviewItemValueText}>{this.state.partnerAmount}人</Text>
              <Text style={styles.overviewItemTitleText}>委托者</Text>
            </View>
          </View>
        </View>
        <View style={styles.rewardView}>
          <Text style={styles.rewardText}>
            <Text style={styles.rewardTitleText}>收益：</Text>
            <Text style={styles.rewardValueText}>{this.state.reward}</Text>
          </Text>
          <Button
            // loading={this.state.isLoading}
            // disabled={this.state.isLoading}
            onPress={this._onWithdrawReward.bind(this)}
            title='提取收益' buttonStyle={styles.rewardAction}
            containerStyle={styles.rewardActionContainer}
            titleStyle={styles.rewardActionTitle}
          />
        </View>
      </View>
    )
  };

  // _renderFooter = () => (
  //   <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
  //   </View>
  // );

  _renderSectionHeader = (section) => {
    if (section.section.index === 1 && section.section.data.length === 0) {
      return null;
    }

    if (section.section.index === 0) {
      return <View style={styles.sectionHeaderView}>
        <Text style={styles.sectionHeaderHeaderText}>我的活期委托</Text>
        <View style={styles.sectionHeaderContentView}>
          <View style={styles.sectionHeaderLeftView}>
            <Text style={styles.sectionHeaderTitleText}>
              <Text style={styles.sectionHeaderTitleTitleText}>委托总额：</Text>
              <Text style={styles.sectionHeaderTitleValueText}>{this.state.currentAmount}</Text>
            </Text>
            <Text style={styles.sectionHeaderTitleText}>
              <Text style={styles.sectionHeaderTitleTitleText}>委托利息：</Text>
              <Text style={styles.sectionHeaderTitleValueText}>{this.state.currentInterest}</Text>
            </Text>
          </View>
          <Button
            // loading={this.state.isLoading}
            // disabled={this.state.isLoading}
            onPress={this._onRedeemCurrent.bind(this)}
            title='赎回' buttonStyle={styles.sectionHeaderAction}
            containerStyle={styles.sectionHeaderActionContainer}
            titleStyle={styles.sectionHeaderActionTitle}
          />
        </View>
      </View>
    } else if (section.section.index === 1) {
      return <View style={styles.sectionHeaderView}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.sectionHeaderHeaderText}>我的定期委托</Text>
        </View>
      </View>
    }
  }

  componentDidMount() {
    this._fetchData();

    this.props.navigation.setParams({
      onEditStake: this._onEditStake.bind(this),
      onDeleteStake: this._onDeleteStake.bind(this),
    });

  }

  async _fetchData() {
    let address;

    try {
      address = await AsyncStorage.getItem('@address');

      this.setState({
        address: address,
      })
    } catch (e) {
      console.log(e);
    }

    let balance;
    global.httpProvider.man.getBalance(address, (error, result) => {
      if (error === null) {
        balance = filters.weiToNumber(result[0].balance);
        this.setState({
          balance: balance,
        })
      }
    });

    let getDepositByAddr;
    global.httpProvider.man.getDepositByAddr(this.state.stake.name, "latest", (error, result) => {
      if (error !== null) {
        console.log(error, getDepositByAddr);
        return;
      }

      getDepositByAddr = result;
      // console.log(this.getDepositByAddr);


      // this.ownerAddressFn(this.staking.name);

      let AllAmount = 0;
      // let that = this;
      let nowTime = parseInt(new Date().getTime() / 1000);
      // console.log(nowTime)

      let maxTime = 0;
      let validatorMap = this.state.stake.ValidatorMap;
      let currentArr = [];
      let timeArr = [];
      let reward = 0;
      let currentAmount = 0;
      let currentInterest = 0;

      for (let i = 0; i < validatorMap.length; i++) {
        console.log(validatorMap, validatorMap[i].Current.WithdrawList);
        AllAmount += parseInt(validatorMap[i].AllAmount);
        if (validatorMap[i].Address === this.state.stake.OwnerInfo.Owner) {
          let ownerArr = validatorMap[i];
          // console.log(ownerArr)
          let positions = [];
          if (ownerArr.Positions.length != 0) {
            for (let j in ownerArr.Positions) {
              let amount = ownerArr.Positions[j].Amount;
              let fromWei = global.httpProvider.fromWei(amount);
              if (Number(fromWei) >= 100000) {
                positions.push(ownerArr.Positions[j].Position)
              }
            }
          } else {
            currentAmount = true;
          }
          if (positions.length == 0) {
            let currentAmount = global.httpProvider.fromWei(ownerArr.Current.Amount);
            let maxAmount = global.httpProvider.fromWei(ownerArr.Current.Amount);
            let currentposition = 0;
            if (Number(currentAmount) >= 100000) {
              currentAmount = true;
            } else {
              if (ownerArr.Positions.length != 0) {
                for (let j in ownerArr.Positions) {
                  let amount = ownerArr.Positions[j].Amount
                  let fromWei = global.httpProvider.fromWei(amount);
                  if (Number(fromWei) > Number(maxAmount)) {
                    currentposition = ownerArr.Positions[j].Position;
                  }
                }
                if (currentposition == 0) {
                  currentAmount = true;
                } else {
                  for (let k in getDepositByAddr.Dpstmsg) {
                    if (currentposition == getDepositByAddr.Dpstmsg[k].Position && getDepositByAddr.Dpstmsg[k].WithDrawInfolist.length == 0) {
                      let beginTime = [];
                      let beginTimeItem = getDepositByAddr.Dpstmsg[k].BeginTime;
                      let depositType = getDepositByAddr.Dpstmsg[k].DepositType;
                      let endTimes = beginTimeItem + (parseInt((nowTime - beginTimeItem) / (depositType * 2592000)) + 1) * depositType * 2592000
                      if (maxTime < endTimes)
                        maxTime = endTimes;
                    }
                  }
                }
              } else {
                currentAmount = true;
              }
            }
          } else {
            for (let j in positions) {
              // console.log(that.getDepositByAddr)
              for (let k in getDepositByAddr.Dpstmsg) {
                if (positions[j] == getDepositByAddr.Dpstmsg[k].Position && getDepositByAddr.Dpstmsg[k].WithDrawInfolist.length == 0) {
                  // alert(positions[j])
                  let beginTime = [];
                  let beginTimeItem = getDepositByAddr.Dpstmsg[k].BeginTime;
                  let depositType = getDepositByAddr.Dpstmsg[k].DepositType;
                  let endTimes = beginTimeItem + (parseInt((nowTime - beginTimeItem) / (depositType * 2592000)) + 1) * depositType * 2592000
                  // console.log("ssssssssssss", that.maxTime, endTimes);
                  if (maxTime < endTimes)
                    maxTime = endTimes;

                  // console.log(that.maxTime)
                }
                // console.log(that.getDepositByAddr.Dpstmsg[k].Position)
              }
            }
          }
        }
        if (validatorMap[i].Address === address) {

          currentAmount = global.httpProvider.fromWei(validatorMap[i].Current.Amount);
          if (currentAmount.indexOf(".") != -1) {
            currentAmount = currentAmount.substring(0, currentAmount.indexOf(".") + 5);
          }

          currentInterest = global.httpProvider.fromWei(validatorMap[i].Current.Interest);
          if (currentInterest.indexOf(".") != -1) {
            currentInterest = currentInterest.substring(0, currentInterest.indexOf(".") + 5);
          }

          reward = validatorMap[i].Reward;

          currentArr = validatorMap[i].Current.WithdrawList;
          timeArr = validatorMap[i].Positions

        }

      }

      this.setState({
        reward: reward,
        currentAmount: currentAmount,
        currentInterest: currentInterest,
        stakeRecordArr: [
          {
            index: 0,
            data: currentArr,
          },
          {
            index: 1,
            data: timeArr,
          }
        ],
      })

      // this.setState({
      //   stakeRecordArr: [
      //     {
      //       index: 0,
      //       data: currentArr,
      //     },
      //     {
      //       index: 1,
      //       data: timeArr,
      //     }
      //   ],
      // })

      // let b = {};
      // console.log(b);
      // if (that.Current.Amount === undefined) {
      //   this.currentMassage = false;
      // } else {
      //   that.Current.Amount = global.httpProvider.fromWei(that.Current.Amount);
      // }

      // console.log(that.Current.Amount == undefined);
      // this.stakingForm.AllAmount = this.httpProvider.fromWei(AllAmount);
      // this.stakingForm.AllAmount = this.stakingForm.AllAmount.substring(0,this.stakingForm.AllAmount.indexOf(".") + 5);
      //console.log('....222222',this.stakingForm.AllAmount)
      let fromWei = global.httpProvider.fromWei(AllAmount);
      //console.log(fromWei)
      if (fromWei.indexOf(".") != -1) {
        AllAmount = fromWei.substring(0, fromWei.indexOf(".") + 5);
      } else {
        AllAmount = fromWei;
      }

      this.setState({
        entrustAmount: AllAmount,
      })

      // this.stakingForm.renNum = this.staking.ValidatorMap.length;
      // console.log(this.stakingForm);

      // this.getYearSyl();
    });
  }

  _onRedeemCurrent() {
    this.setState({
      isRedeemModalVisible: true,
      actionType: this.ActionType.RedeemCurrent,
    })
  }

  _onRedeemTime() {
    this.setState({
      isModalVisible: true,
      actionType: this.ActionType.RedeemTime,
    });
  }

  _onWithdrawReward() {

    if (this.state.reward <= 0) {

      Toast.show("收益为0", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      return;
    }

    this.setState({
      isModalVisible: true,
      actionType: this.ActionType.WithdrawReward,
    });
  }

  _onEditStake() {
    // setTimeout(() => {
    //   this.setState({
    //     isModalVisible: true,
    //     actionType: this.ActionType.EditStake,
    //   });
    // }, 500);

    this.props.navigation.navigate('StakePost', { isEditing: true, stake: this.state.stake })
  }

  _onDeleteStake() {
    setTimeout(() => {
      this.setState({
        isModalVisible: true,
        actionType: this.ActionType.DeleteStake,
      });
    }, 500);
  }

  _onSubmitPasscode() {
    if (this.state.actionType === this.ActionType.RedeemCurrent) {
      this._redeemCurrent();
    } else if (this.state.actionType === this.ActionType.RedeemTime) {
      this._redeemTime();
    } else if (this.state.actionType === this.ActionType.WithdrawReward) {
      this._withdrawReward();
    } else if (this.state.actionType === this.ActionType.EditStake) {
      this._editStake();
    } else if (this.state.actionType === this.ActionType.DeleteStake) {
      this._deleteStake();
    }
  }

  async _redeemCurrent() {

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

    // console.log(that.redeemFrom.number, that.Current.Amount)
    if (this.state.redeemCurrentAmount > this.state.currentAmount) {
      // console.log(that.currents)
      // that.currents = true;
      // done();
      // setTimeout(function () {
      //   that.redeemShow = true;
      // }, 0);
      return;

      // } else if (this.state.redeemCurrentAmount < 100) {
      // that.current = true;
      // done();
      // setTimeout(function () {
      //   that.redeemShow = true;
      // }, 0);
      // return;
    }

    this.setState({
      isLoading: true,
    });

    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014'
    );
    // console.log(that.redeemFrom.number);
    // return false;

    // console.log(that.redeemFrom.number);
    // return false
    // console.log(that.xhDateTy);
    let result = contractAbi.methods
      .withdraw(global.httpProvider.toWei(this.state.redeemCurrentAmount), "0")
      .encodeABI();

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
          isModalVisible: false,
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
              isModalVisible: false,
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
              isModalVisible: false,
              myNonceNum: 0,
            });
          }
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
          isModalVisible: false,
          myNonceNum: 0,
        });

        Alert.alert(
          '赎回成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {
              text: '确定', onPress: () => {
                this.props.navigation.goBack();
              }, style: 'cancel'
            },
          ],
          { cancelable: false }
        )
      });
    });
  }

  async _redeemTime() {

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

    this.setState({
      isLoading: true,
    });

    // console.log(index > 0);
    // return false
    // let that = this;
    // if (action === "confirm") {
    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014'
    );
    // console.log(that.redeemFrom.number);
    // return false;

    let result;

    if (this.state.redeemTimePosition === 0) {
      // console.log(that.redeemFrom.number);
      // console.log(that.xhDateTy);
      result = contractAbi.methods
        .withdraw(global.httpProvider.toWei(this.state.redeemTimeAmount), "0")
        .encodeABI();
    } else {
      // console.log(that.redeemFrom.number);
      // console.log(that.redeemFrom.position.toString());
      result = contractAbi.methods
        .withdraw(global.httpProvider.toWei(this.state.redeemTimeAmount), this.state.redeemTimePosition.toString())
        .encodeABI();
    }

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
          isModalVisible: false,
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
              isModalVisible: false,
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
              myNonceNum: 0,
              isModalVisible: false,
            });
          }
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
          myNonceNum: 0,
          isModalVisible: false,
        });

        Alert.alert(
          '赎回成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {
              text: '确定', onPress: () => {
              }, style: 'cancel'
            },
          ],
          { cancelable: false }
        )
      });
    });
  }

  async _withdraw() {
    // let that = this;
    // if (Date.now() > time * 1000) {
    //   that.drawing = true;
    // } else {
    //   that.drawing = false;
    //   this.$notify(this.$t('nodeDetail.Stilllocked'));
    //   return false;
    // }

    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014'
    );

    // console.log(contractAbi);

    let result = contractAbi.methods.refund(this.state.widthdrawAmount).encodeABI();

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
          isModalVisible: false,
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
              isModalVisible: false,
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
              myNonceNum: 0,
              isModalVisible: false,
            });
          }
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
          myNonceNum: 0,
          isModalVisible: false,
        });

        Alert.alert(
          '提币成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {
              text: '确定', onPress: () => {
              }, style: 'cancel'
            },
          ],
          { cancelable: false }
        )
      });
    });
  }

  async _withdrawReward() {

    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014'
    );
    // console.log(contractAbi);
    let result = contractAbi.methods.getReward().encodeABI();
    // console.log(result);

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
          isModalVisible: false,
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
              isModalVisible: false,
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
              myNonceNum: 0,
              isModalVisible: false,
            });
          }
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
          myNonceNum: 0,
          isModalVisible: false,
        });

        Alert.alert(
          '提币成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {
              text: '确定', onPress: () => {
              }, style: 'cancel'
            },
          ],
          { cancelable: false }
        )
      });
    });
  }

  async _deleteStake() {


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

    this.setState({
      isLoading: true,
    });

    // 创建母合约 abi调用
    let contractAbiArray = JSON.parse(bb.abi);
    let contractAddress = bb.address;
    // 初始化abi
    let contractAbi = new global.ethProvider.eth.Contract(
      contractAbiArray,
      '0x0000000000000000000000000000000000000014'
    );

    // 输入数值进行转化
    // let siginAddress = SendTransfer.sanitizeHex(
    //   WalletUtil.addressChange(this.myAddress.split(".")[1])
    // );

    // 生成交易凭证
    let result = contractAbi.methods.withdrawAll().encodeABI();

    global.httpProvider.man.getTransactionCount(this.state.address, (error, resultData) => {
      if (error !== null) {

        this.setState({
          isLoading: false,
          isModalVisible: false,
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
              isModalVisible: false,
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
              myNonceNum: 0,
              isModalVisible: false,
            });
          }
          return;
        }

        let hash = resultData;
        console.log('success post', resultData);
        this.setState({
          isLoading: false,
          myNonceNum: 0,
          isModalVisible: false,
        });

        Alert.alert(
          '删除成功',
          '数据处理有一定延迟，请稍后刷新',
          [
            {
              text: '确定', onPress: () => {
                this.props.navigation.goBack();
              }, style: 'cancel'
            },
          ],
          { cancelable: false }
        )
      });
    });
  }
}

class StakeCurrentItem extends React.PureComponent {

  render() {
    let isActionEnable = false;
    let date = moment(this.props.time * 1000);
    let formatDate = moment(this.props.time * 1000).format('YYYY.M.D HH:mm');
    if (new Date() > date) {
      isActionEnable = true;
    }

    return (
      <View style={styles.listItemContainerView}>
        <View style={styles.listItemView}>
          <Text style={styles.listItemTitleText}>
            赎回{this.props.amount}
          </Text>
          <Text style={styles.listItemFooterText}>
            到期时间：{formatDate}（到期后才可提币）
          </Text>
        </View>
        {isActionEnable && <TouchableOpacity style={styles.listItemActionView}>
          <Text style={styles.listItemActionText}>
            提币
          </Text>
        </TouchableOpacity>}
        {!isActionEnable && <Text style={styles.listItemStatusText}>
          赎回中
          </Text>}
      </View>
    );
  }
}

class StakeTimeItem extends React.PureComponent {

  _onRedeem = () => {
    this.props.onRedeem({ amount: this.props.amount, position: this.props.position });
  };

  _onWithdraw = () => {
    // this.props.onPressItem(this.props.id);
  };

  render() {
    let isRedeemEnable = false;
    let isWithdrawEnable = false;
    let formatDate = null;
    if (this.props.time === 0) {
      isRedeemEnable = true;
    } else {
      formatDate = moment(this.props.time * 1000).format('YYYY.M.D HH:mm');

      let date = moment(this.props.time * 1000);
      if (new Date() > date) {
        isWithdrawEnable = true;
      }
    }

    return (
      <View style={styles.listItemContainerView}>
        <View style={styles.listItemView}>
          <Text style={styles.listItemTitleText}>
            {this.props.amount}
          </Text>
          <Text style={styles.listItemFooterText}>
            仓位:{this.props.position}  周期:{this.props.type}  {!isRedeemEnable && <Text>到期时间:{formatDate}</Text>}
          </Text>
        </View>
        {isRedeemEnable && <TouchableOpacity onPress={this._onRedeem.bind(this)} style={styles.listItemActionView}>
          <Text style={styles.listItemActionText}>
            赎回
          </Text>
        </TouchableOpacity>}
        {!isRedeemEnable && isWithdrawEnable && <TouchableOpacity onPress={this._onWithdraw.bind(this)} style={styles.listItemActionView}>
          <Text style={styles.listItemActionText}>
            提币
          </Text>
        </TouchableOpacity>}
        {!isRedeemEnable && !isWithdrawEnable && <Text style={styles.listItemStatusText}>
          赎回中
          </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 40,
    marginRight: 16,
    borderRadius: 16,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  menuItem: {
    height: 46,
  },
  menuItemText: {
    color: '#fff',
    textAlign: 'center',
  },
  navigationEditText: {
    paddingRight: 16,
    paddingLeft: 30,
    paddingTop: 12,
    paddingBottom: 12,
    color: '#fbbe07',
    fontSize: 15,
  },
  overviewView: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    alignSelf: 'stretch',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#f0f1f2",
    backgroundColor: '#fff',
    shadowColor: 'rgba(134, 142, 155, 0.15)',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowRadius: 15,
    shadowOpacity: 1
  },
  overviewTitleText: {
    fontSize: 17,
    color: "#2d2d2d",
    fontWeight: 'bold',
  },
  overviewCaptionText: {
    marginTop: 6,
  },
  overviewCaptionTitleText: {
    fontSize: 13,
    color: "#222222",

  },
  overviewCaptionValueText: {
    fontSize: 13,
    color: "#8f92a1",
  },
  overviewFooterView: {
    marginTop: 15,
    borderColor: '#f0f1f2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItemView: {
    alignItems: 'center',
    marginVertical: 15,
    borderColor: '#f0f1f2',
    borderRightWidth: 1,
    flex: 1,
  },
  overviewItemEndView: {
    alignItems: 'center',
    marginVertical: 15,
    flex: 1,
  },
  overviewItemTitleText: {
    fontSize: 12,
    color: "#222222",
    marginTop: 5,
  },
  overviewItemValueText: {
    fontSize: 17,
    color: "#222222",
    fontWeight: 'bold',
  },
  rewardView: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 20,
    alignSelf: 'stretch',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#f0f1f2",
    backgroundColor: '#fff',
    shadowColor: 'rgba(134, 142, 155, 0.15)',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTitleText: {
    fontSize: 14,
    color: "#2d2d2d"
  },
  rewardValueText: {
    fontSize: 14,
    color: "#2d2d2d",
    fontWeight: 'bold',
  },
  rewardAction: {
    backgroundColor: '#fbbe07',
    height: 44,
    borderRadius: 4,
  },
  rewardActionContainer: {
    alignSelf: 'stretch',
    height: 58,
    justifyContent: 'center',
    marginRight: 7,
  },
  rewardActionTitle: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 10,
  },
  list: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  listItemContainerView: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemView: {
    // justifyContent: 'flex-start',
    // alignSelf: 'stretch',
    // alignItems: 'center',
    // flex: 1,
  },
  listItemTitleText: {
    fontSize: 14,
    color: "#2d2d2d",
    fontWeight: 'bold',
  },
  listItemFooterText: {
    marginTop: 5,
    fontSize: 12,
    color: "#8f92a1",
  },
  listItemActionView: {
    justifyContent: 'flex-end',
    width: 60,
    alignItems: 'flex-end',
  },
  listItemActionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 54,
    color: "#fbbe07",
  },
  listItemStatusText: {
    fontSize: 14,
    lineHeight: 54,
    color: "#8f92a1",
  },
  sectionHeaderView: {
    marginHorizontal: 16,
    borderColor: '#f0f1f2',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  sectionHeaderHeaderText: {
    marginTop: 16,
    fontSize: 18,
    color: "#2d2d2d",
    fontWeight: 'bold',
  },
  sectionHeaderTitleText: {

  },
  sectionHeaderContentView: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderTitleTitleText: {
    fontSize: 14,
    color: "#2d2d2d",
    lineHeight: 20,
  },
  sectionHeaderTitleValueText: {
    fontSize: 14,
    color: "#2d2d2d",
    fontWeight: 'bold',
  },
  sectionHeaderAction: {
    backgroundColor: '#e7f0fb',
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionHeaderActionContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  sectionHeaderActionTitle: {
    color: '#4a90e2',
    fontSize: 14,
    marginHorizontal: 10,
  },
  bottomFloatView: {
    height: 78,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    alignSelf: 'stretch',
    marginTop: 10,
    height: 58,
    paddingHorizontal: 16,
  },
  actionTitle: {
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
  modalInput: {
    textAlign: 'center',
  }
});

