import React from 'react';
import { Text, View } from 'react-native';

class MeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Me</Text>
      </View>
    );
  }
}

export default MeScreen;