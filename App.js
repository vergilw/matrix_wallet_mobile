
import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/auth/auth.js';
import PinCodeScreen from './src/auth/pin-code.js';
import MnemonicGenerateConnect from './src/auth/mnemonic-generate.js';
import MnemonicDisplayScreen from './src/auth/mnemonic-display.js';
import App from './src/main.js';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducers from './src/store/reducers/index.js';
import MnemonicSignScreen from './src/auth/mnemonic-sign.js';

const AuthStack = createStackNavigator({
  Auth: AuthScreen,
  MnemonicDisplay: MnemonicDisplayScreen,
  MnemonicSign: MnemonicSignScreen,
  MnemonicGenerate: MnemonicGenerateConnect,
  PinCode: PinCodeScreen,
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
},);

const AppNavigationContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: App,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'App',
    }
  )
);

const store = createStore(AppReducers);

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigationContainer  />
      </Provider>
    )
  }
}
