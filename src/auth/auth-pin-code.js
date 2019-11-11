import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthPinCodeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      passcode: null,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.title} >验证PIN码</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder='以字母开头，8-16位包含数字和字母'
            returnKeyType='done'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ passcode: text })}
            value={this.state.passcode}
          />
        </View>
        <Button onPress={this._onSubmit.bind(this)} title='确定' buttonStyle={styles.action} containerStyle={styles.actionContainer} titleStyle={styles.actionTitle} />

      </SafeAreaView>

    );
  }

  _onSubmit() {
    let that = this;
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z]\S{7,15}$/;
    if (!reg.test(this.state.passcode)) {
      Toast.show("8-16 bits of numbers and letters, beginning with a letter.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      this._validatePasscode();
    }
  }

  async _validatePasscode() {
    try {
      let passcode = await AsyncStorage.getItem('@passcode');

      if (passcode === this.state.passcode) {
        this.props.navigation.navigate('App');
      } else {
        Toast.show("PIN码不正确", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } catch (e)  {
      console.log(e);
    }
  }
}

const styles = StyleSheet.create({
  inputView: {
    marginTop: 60,
    paddingHorizontal: 35,
    width: '100%',
  },
  input: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#000',
    marginTop: 100,
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
    marginTop: 136,
    height: 58,
    paddingHorizontal: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  }
});