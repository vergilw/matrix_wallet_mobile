import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from '../utils/WalletUtil.js';
import Utils from '../utils/utils.js';
import md5 from '../utils/md5.js';

export default class PinCodeScreen extends React.Component {
  // static navigationOptions = { headerTitle: 'Pin码' };

  constructor(props) {
    super(props);

    let isSign = props.navigation.getParam('isSign', false);

    this.state = {
      //FIXME: DEBUG
      // passcode: null,
      // repetition: 'Vergilw123',
      passcode: null,
      repetition: null,
      isSign: isSign,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.title} >设置解锁PIN码</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder='以字母开头，8-16位包含数字和字母'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ passcode: text })}
            value={this.state.passcode}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder='再次重复输入'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ repetition: text })}
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

      if (this.state.isSign === true) {
        let pashadterss = this.props.navigation.getParam('pashadterss');
        let address = this.props.navigation.getParam('address');
        let mnemonic = this.props.navigation.getParam('mnemonic');
        mnemonic = mnemonic.toString().replace(/,/g, " ");
        let privateKey = this.props.navigation.getParam('privateKey');

        let newPasscode = md5(pashadterss + this.state.passcode);
        let keyStore = Utils.encrypt(privateKey, newPasscode);
        let encrypt = Utils.encrypt(mnemonic, newPasscode);

        asyncIO = async () => {
          try {
            await AsyncStorage.setItem('@pashadterss', pashadterss);
            await AsyncStorage.setItem('@address', address);
            await AsyncStorage.setItem('@keyStore', keyStore);
            await AsyncStorage.setItem('@encrypt', encrypt);
            await AsyncStorage.setItem('@passcode', this.state.passcode);

          } catch (e) {
            console.log(e);
          }

          this.setState({
            actionDisabled: false,
          })

          that.props.navigation.navigate('App');
        }

        asyncIO()

      } else {
        storeData = async () => {
          try {
            await AsyncStorage.setItem('@passcode', this.state.passcode)
          } catch (e) {

          }

          let toast = Toast.show("PIN码设置成功", {
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