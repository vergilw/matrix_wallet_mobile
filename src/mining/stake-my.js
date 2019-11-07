import React from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import filters from '../utils/filters.js';
const axios = require('axios');

export default class StakeMyScreen extends React.Component {

  state = {
    balance: null,
    address: null,
    entrustAmount: null,
    redeemAmount: null,
    validatorGroupInfo: null,
    ownerAddress: [],
    listener: null,
    isRefreshing: false,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <FlatList
          style={styles.list}
          data={this.state.validatorGroupInfo}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          onRefresh={() =>  {
            this.setState({
              isRefreshing: true,
            })

            this._fetchData();
          }}
          refreshing={this.state.isRefreshing}
          getItemLayout={(data, index) => (
            { length: 110, offset: 111 * index, index }
          )}
          ItemSeparatorComponent={() => {
            return <View style={{ marginHorizontal: 16, height: 1, backgroundColor: '#f7f7f7' }}>
            </View>
          }}
          ListHeaderComponent={this._renderHeader}
        // ListFooterComponent={this._renderFooter}
          
        />
      </View>
    );
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item }) => (
    <StakeItem
      onPressItem={(item) => {
        console.log('press', item);
      }}
      stakeAddress={item.name}
      ownerAddress={item.OwnerInfo.Owner}
      amount={item.allAmountFif}
      partner={item.ValidatorMap.length}
    />
  );

  _renderHeader = () => (
    <View>
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
      <View style={{ marginHorizontal: 16, height: 1, backgroundColor: '#f7f7f7' }}>
      </View>
    </View>
  );

  // _renderFooter = () => (
  //   <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
  //   </View>
  // );

  componentDidMount() {
    this._fetchData();

    const listener = this.props.navigation.addListener('willFocus', this._componentWillFocus.bind(this));
    this.setState({
      listener: listener,
    })
  }

  componentWillUnmount() {
    this.state.listener.remove();
  }

  _componentWillFocus() {
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

      // 获取数组遍历数据

      global.httpProvider.man.getValidatorGroupInfo((error, result) => {
        if (error !== null) {
          console.log(error, 'getValidatorGroupInfo');
          this.setState({
            isRefreshing: false,
          })

          return;
        }
        let validatorGroupInfo = result;
        let myGroupInfo = {};
        let ownerAddress = [];
        let bba = [];

        // 循环api获取用户列表
        for (let item in validatorGroupInfo) {
          validatorGroupInfo[item].stakingNames = "resp.data.data.alias";
          validatorGroupInfo[item].stakingFormlv = "999";
          // 获取名称与年收益率
          axios.post('https://www.matrixscan.io/api', {
            method: "getAliasByAddress",
            address: item
          }).then(resp => {
            // that.validatorGroupInfo[item].stakingNames = resp.data.data.alias;
            if (resp.data.status == "200") {
              validatorGroupInfo[item].stakingNames = resp.data.data.alias;
              validatorGroupInfo[item].stakingFormlv =
                resp.data.data.rate * 100 + "%";
            }
            // that.$set(that.validatorGroupInfo[item]);
          });

          let array = validatorGroupInfo[item].ValidatorMap;

          // 计算年收益
          let num = 0;
          for (let index = 0; index < array.length; index++) {
            num += parseFloat(array[index].AllAmount);

            // 计算年收益
            if (array[index].Address === address) {
              // this.Num += 1;

              // console.log("Reward", this.Reward);
              // this.Reward += parseInt(array[index].Reward);
              // console.log("Reward11", this.Reward);
              myGroupInfo[item] = validatorGroupInfo[item];

              ownerAddress.push(item);
              // 定期提取计算
              // if (this.Positions) {
              //   for (let i = 0; i < this.Positions.length; i++) {
              //     if (this.Positions[i].EndTime) {
              //       // this.Shuhui += 1;
              //     }
              //   }
              // }
            }
          }

          let fromWei = global.httpProvider.fromWei(num);
          if (fromWei.indexOf(".") != -1) {
            validatorGroupInfo[item].allAmountFif = fromWei.substring(
              0,
              fromWei.indexOf(".") + 5
            );
          } else {
            validatorGroupInfo[item].allAmountFif = fromWei;
          }
        }

        let sum = 0;
        let e19 = 1000000000000000000;

        for (let item in myGroupInfo) {
          let maGroupInfoArr = myGroupInfo[item].ValidatorMap;
          for (let index in maGroupInfoArr) {
            if (maGroupInfoArr[index].Address == address) {
              let PositionsArr = maGroupInfoArr[index].Positions;
              for (let ips in PositionsArr) {
                if (PositionsArr[ips].EndTime != 0) {
                  sum += Number(PositionsArr[ips].Amount);
                }
              }

              // 活期处理
              if (maGroupInfoArr[index].Current.WithdrawList.length > 0) {
                let redeemArr = maGroupInfoArr[index].Current.WithdrawList;
                for (let i in redeemArr) {
                  sum += Number(redeemArr[i].WithDrawAmount);
                }
              }

              let aba = Number(maGroupInfoArr[index].AllAmount);
              aba = aba / e19;
              bba.push(aba);
            }
          }
        }

        sum = sum / e19;
        sum = String(sum).replace(/^(.*\..{4}).*$/, "$1");
        sum = Number(sum);
        // that.redeem = sum;

        let allAmount = 0;
        for (let i in bba) {
          allAmount += bba[i];
        }
        let entrustAmount = allAmount.toFixed(4);
        // let arrays = this.myGroupInfo;

        let groupInfo = [];
        let keys = Object.keys(validatorGroupInfo);

        for (let i in keys) {
          let key = keys[i];
          let value = validatorGroupInfo[key];
          value['name'] = key;
          if (value.OwnerInfo.Owner === address) {
            groupInfo.push(value);
          }
        }

        this.setState({
          entrustAmount: entrustAmount,
          redeemAmount: sum,
          validatorGroupInfo: groupInfo,
          isRefreshing: false,
        })

        console.log('render list', groupInfo);
      })
    } catch (e) {
      console.log(e);
    }
  }

}

class StakeItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableHighlight activeOpacity={0.2} underlayColor='#f6f7fb' onPress={this._onPress}>
        <View style={styles.itemView}>
          <Text style={styles.itemTitleText}>{this.props.stakeAddress}</Text>
          <Text>
          <Text style={styles.itemCaptionTitleText}>发起人：</Text>
          <Text style={styles.itemCaptionText}>{this.props.ownerAddress}</Text>
          </Text>
          

          <View style={styles.itemFooterView}>
            <Text style={styles.itemFooterText}>金额：{this.props.amount}</Text>
            <Text style={{ marginHorizontal: 12, fontSize: 13, color: '#8f92a1', }}> | </Text>
            <Text style={styles.itemFooterText}>人数：{this.props.partner}</Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  overviewView: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 22,
    alignSelf: 'stretch',
    borderRadius: 6,
    overflow: 'hidden',
  },
  overviewHeaderText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 20,
  },
  balanceText: {
    fontSize: 30,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 15,
  },
  balanceFooterText: {
    fontSize: 12,
    color: '#222',
  },
  addressText: {
    fontSize: 12,
    color: '#222',
  },
  overviewFooterView: {
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewValueText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  overviewTitleText: {
    fontSize: 12,
    color: '#222',
    marginTop: 5,
  },
  actionLeft: {
    backgroundColor: '#fff',
    height: 58,
    borderRadius: 6,
  },
  actionRight: {
    backgroundColor: '#ffcf4b',
    height: 58,
    borderRadius: 6,
  },
  actionLeftContainer: {
    marginRight: 5,
    height: 58,
    flexGrow: 1,
  },
  actionRightContainer: {
    marginLeft: 5,
    height: 58,
    flexGrow: 1,
  },
  actionLeftTitle: {
    color: '#fbbe07',
    fontSize: 16,
  },
  actionRightTitle: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    overflow: 'visible',
    // marginTop: 30,
    backgroundColor: '#fff',
    width: '100%',
  },
  itemView: {
    marginHorizontal: 18,
    height: 110,
  },
  itemFooterView: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  itemTitleText: {
    marginTop: 25,
    fontSize: 14,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  itemCaptionTitleText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 22,
    color: '#2d2d2d',
  },
  itemCaptionText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 22,
    color: '#8f92a1',
  },
  itemFooterText: {
    fontSize: 13,
    color: '#8f92a1',
  },
});

