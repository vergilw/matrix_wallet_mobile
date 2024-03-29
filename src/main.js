/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Image, AppState } from 'react-native';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import WalletScreen from './wallet/wallet.js';
import MiningScreen from './mining/mining.js';
import MeScreen from './me/me.js';
import WalletDetailScreen from './wallet/wallet-detail.js';
import WalletTransferScreen from './wallet/wallet-transfer.js';
import WalletQRCodeScreen from './wallet/wallet-qrcode.js';
import WalletScannerScreen from './wallet/wallet-scanner.js';
import NavigationService from './utils/NavigationService.js';
import StakePostScreen from './mining/stake-post.js';
import StakeDetailScreen from './mining/stake-detail.js';
import StakeJoinScreen from './mining/stake-join.js';
import MeAboutScreen from './me/me-about.js';
import MeBackupWalletScreen from './me/me-backup-wallet.js';

const WalletStack = createStackNavigator({

  Wallet: {
    screen: WalletScreen,
    navigationOptions: {
      headerTitle: '钱包',
    }
  },
  WalletDetail: WalletDetailScreen,
  WalletTransfer: WalletTransferScreen,
  WalletQRCode: WalletQRCodeScreen,
  WalletScanner: WalletScannerScreen,

}, {
  defaultNavigationOptions: {
    headerBackTitle: null,
    headerTransparent: true,
    headerTintColor: '#000',
    headerLeftContainerStyle: {
      paddingLeft: 16,
    },
    headerTitleStyle: {
      fontSize: 17,
    },
  },
});


WalletStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName === 'Wallet') {
    navigationOptions.tabBarLabel = '钱包';
    navigationOptions.tabBarIcon = ({ focused, horizontal, tintColor }) => {
      return <Image
        source={focused === true ? require('../resources/img/wallet/tabBar_walletSelected.png') : require('../resources/img/wallet/tabBar_walletNormal.png')}
      />
    }
  } else if (routeName !== 'Wallet') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const MiningStack = createStackNavigator({
  Mining: {
    screen: MiningScreen,
    navigationOptions: {
      headerTitle: '挖矿',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  StakePost: {
    screen: StakePostScreen,
    navigationOptions: {
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  StakeDetail: {
    screen: StakeDetailScreen,
    navigationOptions: {
      headerTitle: '节点详情',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  StakeJoin: {
    screen: StakeJoinScreen,
    navigationOptions: {
      headerTitle: '加入节点',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
}, {
  defaultNavigationOptions: {
    headerBackTitle: null,
    headerTintColor: '#000',
    headerLeftContainerStyle: {
      paddingLeft: 16,
    },
    headerTitleStyle: {
      fontSize: 17,
    },
  },
});

// MiningStack.navigationOptions = {
//   tabBarLabel: '挖矿',
//   tabBarIcon: ({ focused, horizontal, tintColor }) => {
//     return <Image
//       source={focused === true ? require('../resources/img/wallet/tabBar_miningSelected.png') : require('../resources/img/wallet/tabBar_miningNormal.png')}
//     />
//   },
// };

MiningStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName === 'Mining') {
    navigationOptions.tabBarLabel = '挖矿';
    navigationOptions.tabBarIcon = ({ focused, horizontal, tintColor }) => {
      return <Image
        source={focused === true ? require('../resources/img/wallet/tabBar_miningSelected.png') : require('../resources/img/wallet/tabBar_miningNormal.png')}
      />
    }
  } else if (routeName !== 'Mining') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const MeStack = createStackNavigator({
  Me: {
    screen: MeScreen,
    navigationOptions: {
      headerTitle: '设置',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  MeAbout: {
    screen: MeAboutScreen,
    navigationOptions: {
      headerTitle: '关于我们',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  MeBackupWallet: {
    screen: MeBackupWalletScreen,
    navigationOptions: {
      headerTitle: '备份钱包',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
}, {
  defaultNavigationOptions: {
    headerBackTitle: null,
    headerTintColor: '#000',
    headerLeftContainerStyle: {
      paddingLeft: 16,
    },
    headerTitleStyle: {
      fontSize: 17,
    }
  },
});

MeStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName === 'Me') {
    navigationOptions.tabBarLabel = '设置';
    navigationOptions.tabBarIcon = ({ focused, horizontal, tintColor }) => {
      return <Image
        source={focused === true ? require('../resources/img/wallet/tabBar_settingsSelected.png') : require('../resources/img/wallet/tabBar_settingsNormal.png')}
      />
    }
  } else if (routeName !== 'Me') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const BottomTabNavigator = createBottomTabNavigator(
  {
    Wallet: WalletStack,
    Mining: MiningStack,
    Me: MeStack,
  },
  {
    initialRouteName: 'Wallet',
    tabBarOptions: {
      activeTintColor: '#f5a623',
      inactiveTintColor: '#999999',
      labelStyle: {
        fontSize: 10,
      },
    },
  }
);

const AppRoot = createAppContainer(
  BottomTabNavigator
);

export default class App extends React.Component {

  state = {
    needAuth: false,
  }

  render() {
    return (
      <AppRoot />
    )
  }

  componentDidMount() {
    AppState.addEventListener('change', this._appStateDidChange.bind(this));
  }

  componentWillMount() {
    AppState.removeEventListener('change', this._appStateDidChange.bind(this));
  }

  _appStateDidChange() {

    if (AppState.currentState === 'background') {
      this.setState({
        needAuth: true,
      })
    } else if (this.state.needAuth === true && AppState.currentState === 'active') {
      NavigationService.navigate('AuthPinCode');
      this.setState({
        needAuth: false,
      })
    }
  }
}
