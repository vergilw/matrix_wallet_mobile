import React from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const BigNumber = require('bignumber.js');
import filters from '../utils/filters.js';
const axios = require('axios');

export default class StakeDetailScreen extends React.Component {

  constructor(props) {
    super(props);

    let stake = props.navigation.getParam('stake');

    this.state = {
      stake: stake,
      balance: null,
      address: null,
      entrustAmount: null,
      partnerAmount: stake.ValidatorMap.length,
      nodeRate: stake.Reward.NodeRate.Rate /stake.Reward.NodeRate.Decimal * 100,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.overviewView}>
          <Text style={styles.overviewTitleText}>{this.state.stake.name}</Text>
          <Text style={styles.overviewCaptionText}>
            <Text style={styles.overviewCaptionTitleText}>发起人：</Text>
            <Text style={styles.overviewCaptionValueText}>{this.state.stake.OwnerInfo.Owner}</Text>
          </Text>
          <Text style={styles.overviewCaptionText}>
            <Text style={styles.overviewCaptionTitleText}>发起人抵押到期时间：</Text>
            <Text style={styles.overviewCaptionValueText}>2019/01/01 08:00:00 活期</Text>
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
        {/* <FlatList
          style={styles.list}
          data={this.state.validatorGroupInfo}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          getItemLayout={(data, index) => (
            { length: 75, offset: 76 * index, index }
          )}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 1, backgroundColor: '#f7f7f7' }}>
            </View>
          }}
        // ListHeaderComponent={this._renderHeader}
        // ListFooterComponent={this._renderFooter}
        /> */}
      </View>
    );
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item }) => (
    <StakeItem
      onPressItem={(item) => {
        console.log('press', item);
      }}
      stakeAddress={item.key}
      ownerAddress={item.OwnerInfo.Owner}
      amount={item.allAmountFif}
      partner={item.ValidatorMap.length}
    />
  );

  _renderHeader = () => (
    <ImageBackground source={require('../../resources/img/wallet/wallet_bg.png')} style={styles.overviewView}>
      <Text style={styles.overviewHeaderText}>MAN钱包</Text>
      <Text style={{ marginTop: 15 }}>
        <Text style={styles.balanceText}>{this.state.balance}</Text>
        <Text style={styles.balanceFooterText}>MAN</Text>
      </Text>
      <Text style={styles.addressText}>{this.state.address}</Text>
      <View style={styles.overviewFooterView}>
        <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <Text style={styles.overviewValueText}>{this.state.balance}</Text>
          <Text style={styles.overviewTitleText}>可用余额</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <Text style={styles.overviewValueText}>{this.state.entrustAmount}</Text>
          <Text style={styles.overviewTitleText}>委托</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1, }}>
          <Text style={styles.overviewValueText}>{this.state.redeemAmount}</Text>
          <Text style={styles.overviewTitleText}>赎回中</Text>
        </View>
      </View>
    </ImageBackground>
  );

  // _renderFooter = () => (
  //   <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
  //   </View>
  // );

  componentDidMount() {
    this._fetchData();
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
      console.log(nowTime)

      let currentAmount;
      let maxTime = 0;
      let validatorMap = this.state.stake.ValidatorMap;

      for (let i = 0; i < validatorMap.length; i++) {
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
          // that.reward = validatorMap[i].Reward;
          // that.Current = validatorMap[i].Current;
          // that.positionsList = validatorMap[i].Positions;
          // that.isTiqu = true;
        }
      }


      let b = {};
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
}

class StakeItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableHighlight style={{ backgroundColor: '#f6f7fb' }} activeOpacity={0.2} underlayColor='#f6f7fb' onPress={this._onPress}>
        <View style={styles.itemView}>
          <View style={styles.itemTitleView}>
            <Text style={styles.itemTitleText}>
              {this.props.stakeAddress}
            </Text>
            <Text style={styles.itemTitleText}>
              {this.props.ownerAddress}
            </Text>
            <Text style={styles.itemDescText}>
              金额：{this.props.amount}
            </Text>
          </View>
          <Text style={styles.itemValueText}>
            人数：{this.props.partner}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
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
    borderColor: '#f7f7f7',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItemView: {
    alignItems: 'center',
    marginVertical: 15,
    borderColor: '#f7f7f7',
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
  }
});

