import React from 'react';
import { Text, View, StyleSheet, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const BigNumber = require('bignumber.js');
import filters from '../utils/filters.js';

export default class StakeMyScreen extends React.Component {

  state = {
    balance: null,
    address: null,
    recordArr: null,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ImageBackground source={require('../../resources/img/wallet/wallet_bg.png')} style={styles.overviewView}>
          <Text style={styles.overviewHeaderText}>MAN钱包</Text>
          <Text style={{ marginTop: 15 }}>
            <Text style={styles.balanceText}>{this.state.balance}</Text>
            <Text style={styles.balanceFooterText}>MAN</Text>
          </Text>
          <Text style={styles.addressText}>{this.state.address}</Text>
          <View style={styles.overviewFooterView}>
            <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              <Text style={styles.overviewValueText}>0</Text>
              <Text style={styles.overviewTitleText}>可用余额</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              <Text style={styles.overviewValueText}>0</Text>
              <Text style={styles.overviewTitleText}>委托</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1, }}>
              <Text style={styles.overviewValueText}>0</Text>
              <Text style={styles.overviewTitleText}>赎回中</Text>
            </View>
          </View>
        </ImageBackground>

        {/* <FlatList
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
    // ListHeaderComponent={this._renderHeader}
    // ListFooterComponent={this._renderFooter}
    /> */}
      </View>
    );
  }

  _keyExtractor = (item, index) => item.accountType;

  _renderItem = ({ item }) => (
    <StakeItem
      onPressItem={(item) => {
        console.log('press', item);
      }}
      receiver={1}
      time={2}
      amount={3}
    />
  );

  // _renderHeader = () => (
  //   <View style={{ backgroundColor: '#ffb900', height: 55 }}>
  //     <View style={styles.header}>
  //       <Text style={styles.headerTitleText}>记录列表</Text>
  //     </View>
  //   </View>
  // );

  // _renderFooter = () => (
  //   <View style={{ backgroundColor: '#f6f7fb', height: 12 }}>
  //   </View>
  // );

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
        console.log(result);
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


const styles = StyleSheet.create({
  overviewView: {
    marginHorizontal: 16,
    marginTop: 20,
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

