import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
require('bignumber.js');
import filters from '../utils/filters.js';

class WalletScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '转账',
  };

  state = {
    isBalanceHidden: false,
    balance: null,
    currenryArr: null,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffb900' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ position: 'absolute', height: '60%', width: '100%', backgroundColor: '#ffb900' }} />
        <Image source={require('../../resources/img/wallet/wallet_bg.png')} style={{ position: 'absolute' }} />
        <Text style={styles.balanceText}>{this.state.balance}</Text>
        <TouchableOpacity onPress={this._onToggleBalance.bind(this)}>
          <Text style={styles.balanceToggleText}>总资产</Text>
        </TouchableOpacity>

        <View style={{ position: 'absolute', width: '100%', height: '40%', bottom: 0, backgroundColor: '#f6f7fb' }}>
        </View>

        <FlatList
          style={styles.list}
          data={this.state.currenryArr}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          getItemLayout={(data, index) => (
            { length: 84, offset: 96 * index, index }
          )}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 12, backgroundColor: '#f6f7fb' }}>
            </View>
          }}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
        />
      </View>
    );
  }

  _keyExtractor = (item, index) => item.accountType;

  _onToggleBalance() {
    if (this.state.isBalanceHidden === false) {
      this.setState({
        balance: '******',
        isBalanceHidden: true,
      })
    } else {
      if (this.state.currenryArr !== null) {
        let balance = filters.weiToNumber(this.state.currenryArr[0].balance);
        this.setState({
          balance: balance,
          isBalanceHidden: false,
        })
      }
    }
  }

  _renderItem = ({ item }) => (
    <CurrencyItem
      id={item.accountType}
      onPressItem={(id) => {
        this.props.navigation.navigate('WalletDetail');
      }}
      value={filters.weiToNumber(item.balance)}
    />
  );

  _renderHeader = () => (
    <View style={{ backgroundColor: '#ffb900', height: 55 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitleText}>币种列表</Text>
      </View>
    </View>
  );

  _renderFooter = () => (
    <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
    </View>
  );

  componentDidMount() {
    this._fetchData();

    this.props.navigation.addListener('willFocus', this._componentWillFocus.bind(this))
  }

  _componentWillFocus() {
    this._fetchData();
  }

  async _fetchData() {
    try {
      const address = await AsyncStorage.getItem('@address');
      console.log(address, 'componentDidMount');

      await global.httpProvider.man.getBalance(address, (error, result) => {
        console.log(result);
        if (error === null) {
          let balance = filters.weiToNumber(result[0].balance);
          this.setState({
            currenryArr: [result[0]],
            balance: balance,
          })
        }
      });

    } catch (e) {
      console.log(e);
    }
  }
}

class CurrencyItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableHighlight style={{ backgroundColor: '#f6f7fb' }} activeOpacity={0.2} underlayColor='#f6f7fb' onPress={this._onPress}>
        <View style={styles.itemView}>
          <Image style={styles.itemImg} source={require('../../resources/img/wallet/wallet_currencyMark.png')}>

          </Image>
          <View style={styles.itemTitleView}>
            <Text style={styles.itemTitleText}>
              Man
            </Text>
            <Text style={styles.itemDescText}>
              Matrix
            </Text>
          </View>
          <Text style={styles.itemValueText}>
            {this.props.value}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default WalletScreen;

const styles = StyleSheet.create({
  balanceText: {
    fontSize: 30,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 120,
  },
  balanceToggleText: {
    fontSize: 14,
    color: '#222',
    marginTop: 20,
  },
  list: {
    overflow: 'visible',
    marginTop: 30,
    // backgroundColor: 'transparent',
    backgroundColor: '#f6f7fb',
    width: '100%',
  },
  header: {
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    height: 55,
    backgroundColor: '#f6f7fb',
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  itemView: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    height: 84,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemImg: {
    backgroundColor: '#ccc',
    height: 38,
    width: 38,
    flexGrow: 0,
  },
  itemTitleView: {
    flexGrow: 1,
    marginLeft: 18,
  },
  itemTitleText: {
    fontSize: 14,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  itemDescText: {
    fontSize: 14,
    color: '#8f92a1',
  },
  itemValueText: {
    flexGrow: 0,
    fontSize: 16,
    color: '#222',
  }
});

