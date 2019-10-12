import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class PinCodeScreen extends React.Component {
  // static navigationOptions = { headerTitle: 'Pin码' };
  // const [value, onChangeText] = React.useState('Useless Placeholder');
  state = {
    passcode: null,
    repetition: null,
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <Text style={styles.title} >设置解锁PIN码</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder='以字母开头，8-16位包含数字和字母'
            returnKeyType='done'
            onChangeText={(text) => this.setState({passcode: text})}
            value={this.state.passcode}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder='再次重复输入'
            returnKeyType='done'
            onChangeText={(text) => this.setState({repetition: text})}
            value={this.state.repetition}
          />
        </View>
        <Button onPress={this._onSubmit.bind(this)} title='确定' buttonStyle={styles.action} containerStyle={styles.actionContainer} titleStyle={styles.actionTitle} />

      </SafeAreaView>

    );
  }

  _onSubmit() {
    let that = this;
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z]\S{7,15}$/;
    if (this.state.passcode !== this.state.repetition) {
      let toast = Toast.show("两次输入不一致.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else if (!reg.test(this.state.passcode)) {
      let toast = Toast.show("8-16 bits of numbers and letters, beginning with a letter.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      
      storeData = async () => {
        try {
          await AsyncStorage.setItem('@passcode', this.state.passcode)
        } catch (e) {

        }

        let toast = Toast.show("success.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });

        that.props.navigation.navigate('MnemonicGenerate');
      }

      storeData()
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