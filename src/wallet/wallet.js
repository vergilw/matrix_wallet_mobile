import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

class WalletScreen extends React.Component {

  state = {
    isBalanceHidden: false,
    balance: null,
    data: null,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <Text style={styles.balanceText}>{this.state.balance}</Text>
        <TouchableOpacity onPress={this._onToggleBalance.bind(this)}>
          <Text style={styles.balanceToggleText}>总资产</Text>
        </TouchableOpacity>
        {/* <FlatList data={this.state.data} renderItem={this._renderItem}>

        </FlatList> */}
      </View>
    );
  }

  _onToggleBalance() {
    if (this.state.isBalanceHidden === false) {
      this.setState({
        balance: '******',
        isBalanceHidden: true,
      })
    } else {
      this.setState({
        balance: '6421.00',
        isBalanceHidden: false,
      })
    }
  }

  // _renderItem = ({item} => (

  // ))

  componentDidMount() {

    asyncIO = async () => {
      try {
        const address = await AsyncStorage.getItem('@address');
        console.log(address);
        await global.httpProvider.man.getBalance(address, (error, result) => {
          console.log(error);
          console.log(result);
        });
        console.log(balance);
        this.setState({
          balance: balance,
        })
        // fetch('https://api85.matrix.io/man_getBalance', {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(address),
        // }).then((response) => {
        //   console.log(response);
        // })
        // .then((responseJson) => {
        //   console.log(responseJson);
        // })
        // .catch((error) => {
        //   console.error(error);
        // });

      } catch (e) {
        console.log(e);
      }
    }
    asyncIO();
  }
}

class CurrencyItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
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
  }
});

