
import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/auth/auth.js';
import PinCodeScreen from './src/auth/pin-code.js';
import MnemonicGenerateScreen from './src/auth/mnemonic-generate.js';
import MnemonicDisplayScreen from './src/auth/mnemonic-display.js';
import App from './src/main.js';


const AuthStack = createStackNavigator({
  MnemonicDisplay: MnemonicDisplayScreen,
  MnemonicGenerate: MnemonicGenerateScreen,
  Auth: AuthScreen,
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

export default createAppContainer(
  createSwitchNavigator(
    {
      App: App,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);

// export default class Auth1Screen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Auth</Text>
//       </View>
//     );
//   }
// }