import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

export default class AuthScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fbbe07' }}>
        <View />
        <Text>Auth</Text>
        <View style={{ marginBottom: 68, width: '100%' }}>
          <Button buttonStyle={{ backgroundColor: '#fff', height: 58, borderRadius: 4, }} containerStyle={{ marginHorizontal: 30, }} title='创建钱包' titleStyle={{ color: '#fbbe07', fontSize: 16 }} />
          <Button buttonStyle={{ backgroundColor: 'transparent', height: 58 }} containerStyle={{ marginHorizontal: 30, marginTop: 20, borderRadius: 4, borderWidth: 0.5, borderColor: '#fff' }} title='导入钱包' titleStyle={{ color: '#fff', fontSize: 16 }} />
        </View>
        
      </View>

    );
  }
}
