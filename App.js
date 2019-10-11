
import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/auth.js';
import App from './src/main.js';

const AuthStack = createStackNavigator({
  Auth: AuthScreen,
});

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