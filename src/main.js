/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import WalletScreen from './wallet/wallet.js';
import MiningScreen from './mining.js';
import InvitationCodeScreen from './invitation-code.js';
import MeScreen from './me.js';
import WalletDetailScreen from './wallet/wallet-detail.js';
import WalletTransferScreen from './wallet/wallet-transfer.js';
import PinCodeModal from './auth/pin-code-modal.js';


const WalletStack = createStackNavigator({
  Wallet: WalletScreen,
  WalletDetail: WalletDetailScreen,
  WalletTransfer: WalletTransferScreen,

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

// WalletStack.navigationOptions = {
//   tabBarLabel: '钱包',
// };

WalletStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName === 'Wallet') {
    navigationOptions.tabBarLabel = '钱包';
  } else if (routeName !== 'Wallet') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const MiningStack = createStackNavigator({
  Mining: MiningScreen,
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
    }
  },
});

MiningStack.navigationOptions = {
  tabBarLabel: '挖矿',
};

const InvitationCodeStack = createStackNavigator({
  InvitationCode: InvitationCodeScreen,
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
    }
  },
});

InvitationCodeStack.navigationOptions = {
  tabBarLabel: '邀请',
};

const MeStack = createStackNavigator({
  Me: MeScreen,
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
    }
  },
});

MeStack.navigationOptions = {
  tabBarLabel: '设置',
};

const AppRoot = createAppContainer(
  createBottomTabNavigator(
    {
      Wallet: WalletStack,
      Mining: MiningStack,
      InvitationCode: InvitationCodeStack,
      Me: MeStack,
    },
    {
      initialRouteName: 'Wallet',
      tabBarOptions: {
        activeTintColor: '#f5a623',
        inactiveTintColor: '#999999',
        labelStyle: {
          fontSize: 10,
        }
      }
    }
  )
);

export default class App extends React.Component {
  render() {
    return (
      <AppRoot />
    )
  }
}
