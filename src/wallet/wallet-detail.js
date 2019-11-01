import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
const BigNumber = require('bignumber.js');
import filters from '../utils/filters.js';
import { Button } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { aa, bb, contract } from "../profiles/config.js";
import Moment from 'moment';

class WalletDetailScreen extends React.Component {

  state = {
    balance: null,
    recordArr: null,
    listener: null,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: '#ffb900' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Image source={require('../../resources/img/wallet/wallet_bg.png')} style={{ position: 'absolute' }} />
        <Text style={{ marginTop: 120, marginLeft: 16 }}>
          <Text style={styles.balanceText}>{this.state.balance}</Text>
          <Text style={styles.balanceFooterText}>MAN</Text>
        </Text>
        <View style={{ width: '100%', paddingHorizontal: 16, flexDirection: 'row', marginTop: 20, }}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('WalletTransfer', { onSuccessTransfer: this._onChangedRecords.bind(this) });
            }}
            title='转账'
            buttonStyle={styles.actionLeft}
            containerStyle={styles.actionLeftContainer}
            titleStyle={styles.actionLeftTitle}
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate('WalletQRCode');
            }}
            title='接受'
            buttonStyle={styles.actionRight}
            containerStyle={styles.actionRightContainer}
            titleStyle={styles.actionRightTitle}
          />
        </View>

        <FlatList
          style={styles.list}
          data={this.state.recordArr}
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

  _renderItem = ({ item }) => (
    <RecordItem
      onPressItem={(item) => {
        console.log('press', item);
      }}
      receiver={item.receiver}
      time={Moment(item.time).format('YYYY-MM-DD HH:mm:ss')}
      amount={'-' + item.amount}
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

      global.httpProvider.man.getBalance(address, (error, result) => {
        if (error === null) {
          let balance = filters.weiToNumber(result[0].balance);
          this.setState({
            balance: balance,
          })
        }
      });

      let transactionRecords = await AsyncStorage.getItem('@myTransfer');
      transactionRecords = JSON.parse(transactionRecords);
      this.setState({
        recordArr: transactionRecords,
      })

    } catch (e) {
      console.log(e);
    }
  }

  _onChangedRecords() {
    this._fetchData();
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
            <Text style={styles.itemTitleText} numberOfLines={1}>
              {this.props.receiver}
            </Text>
            <Text style={styles.itemDescText}>
              {this.props.time}
            </Text>
          </View>
          <Text style={styles.itemValueText}>
            {this.props.amount}
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
    flexShrink: 1,
    marginRight: 10,
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

