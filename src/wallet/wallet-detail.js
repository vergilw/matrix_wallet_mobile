import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
require('bignumber.js');
import { Button } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { aa,bb, contract } from "../profiles/config.js";

class WalletDetailScreen extends React.Component {

  state = {
    balance: null,
    recordArr: null,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: '#ffb900' }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <Image source={require('../../resources/img/wallet/wallet_bg.png')} style={{ position: 'absolute' }} />
        <Text style={{ marginTop: 120, marginLeft: 16 }}>
          <Text style={styles.balanceText}>{this.state.balance}</Text>
          <Text style={styles.balanceFooterText}>MAN</Text>
        </Text>
        <View style={{ width: '100%', paddingHorizontal: 16, flexDirection: 'row', marginTop: 20, }}>
          <Button
            // onPress={this._onSubmit.bind(this)}
            title='转账'
            buttonStyle={styles.actionLeft}
            containerStyle={styles.actionLeftContainer}
            titleStyle={styles.actionLeftTitle}
          />
          <Button
            // onPress={this._onSubmit.bind(this)}
            title='接受'
            buttonStyle={styles.actionRight}
            containerStyle={styles.actionRightContainer}
            titleStyle={styles.actionRightTitle}
          />
        </View>

        <FlatList
          style={styles.list}
          data={this.state.currenryArr}
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
        let balance = this.state.currenryArr[0].balance.toNumber();
        this.setState({
          balance: balance,
          isBalanceHidden: false,
        })
      }
    }
  }

  _renderItem = ({ item }) => (
    <RecordItem
      id={item.accountType}
      onPressItem={(id) => {
        console.log('press', id);
      }}
      value={item.balance.toNumber()}
    />
  );

  _renderHeader = () => (
    <View style={{ backgroundColor: '#ffb900', height: 55 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitleText}>记录列表</Text>
      </View>
    </View>
  );

  _renderFooter = () => (
    <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
    </View>
  );

  componentDidMount() {

    asyncIO = async () => {
      try {
        // const address = await AsyncStorage.getItem('@address');
        // console.log(address);

        await global.httpProvider.man.getBalance('MAN.2TKMHtJbgcFiiviX2GZQNf4hNFoYW', (error, result) => {
          console.log(result);
          if (error === null) {
            let balance = result[0].balance.toFixed(2);
            this.setState({
              currenryArr: [result[0]],
              balance: balance,
            })
          }
        });

        // console.log(balance);


        // axios({
        //   method: 'post',
        //   url: 'https://testnet.matrix.io',
        //   data: { "jsonrpc": "2.0", "method": "man_getBalance", "params": ["MAN.35dDuaK7Pb42338pXq5a6shtsTDoZ", "latest"], "id": 1 }
        // })
        //   .then((response) => {
        //     console.log(response);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });

      } catch (e) {
        console.log(e);
      }
    }
    asyncIO();
  }
}

class RecordItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableHighlight style={{ backgroundColor: '#f6f7fb' }} activeOpacity={0.2} underlayColor='#f6f7fb' onPress={this._onPress}>
        <View style={styles.itemView}>
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

export default WalletDetailScreen;

const styles = StyleSheet.create({
  balanceText: {
    fontSize: 30,
    color: '#222',
    fontWeight: 'bold',
  },
  balanceFooterText: {
    fontSize: 12,
    color: '#222',
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
    height: 75,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemTitleView: {
    flexGrow: 1,
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

