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
import HomeScreen from './home.js';
import MiningScreen from './mining.js';
import InvitationCodeScreen from './invitation-code.js';
import MeScreen from './me.js';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const MiningStack = createStackNavigator({
  Mining: MiningScreen,
});

const InvitationCodeStack = createStackNavigator({
  InvitationCode: InvitationCodeScreen,
});

const MeStack = createStackNavigator({
  Me: MeScreen,
});

const AppRoot = createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeStack,
      Mining: MiningStack,
      InvitationCode: InvitationCodeStack,
      Me: MeStack,
    },
    {
      /* Other configuration remains unchanged */
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
