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

const WalletStack = createStackNavigator({
  Wallet: {
    screen: WalletScreen,
    navigationOptions: {
      headerTitle: '钱包',
    }
  },
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

WalletStack.navigationOptions = {
  tabBarLabel: '钱包',
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     name={
  //       Platform.OS === 'ios'
  //         ? `ios-information-circle${focused ? '' : '-outline'}`
  //         : 'md-information-circle'
  //     }
  //   />
  // ),
};

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
