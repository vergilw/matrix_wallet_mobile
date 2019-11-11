import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from "../utils/WalletUtil.js";
import utils from '../utils/utils.js';
import md5 from '../utils/md5.js';

export default class MeBackupWalletScreen extends React.Component {
  static navigationOptions = { headerTitle: '登录' };

  state = {
    mnemonic1: null,
    mnemonic2: null,
    mnemonic3: null,
    mnemonic4: null,
    mnemonic5: null,
    mnemonic6: null,
    mnemonic7: null,
    mnemonic8: null,
    mnemonic9: null,
    mnemonic10: null,
    mnemonic11: null,
    mnemonic12: null,
    secretKey: null,
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.title} >请按顺序写下助记词</Text>

        <View style={styles.inputView}>

          <TextInput
            editable={false}
            style={styles.input}
            placeholder='01'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic1: text })}
            value={this.state.mnemonic1}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='02'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic2: text })}
            value={this.state.mnemonic2}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='03'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic3: text })}
            value={this.state.mnemonic3}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='04'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic4: text })}
            value={this.state.mnemonic4}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='05'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic5: text })}
            value={this.state.mnemonic5}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='06'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic6: text })}
            value={this.state.mnemonic6}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='07'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic7: text })}
            value={this.state.mnemonic7}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='08'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic8: text })}
            value={this.state.mnemonic8}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='09'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic9: text })}
            value={this.state.mnemonic9}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='10'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic10: text })}
            value={this.state.mnemonic10}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='11'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic11: text })}
            value={this.state.mnemonic11}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder='12'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic12: text })}
            value={this.state.mnemonic12}
          />
        </View>

        <Text style={styles.title} >私钥</Text>
        <Text style={styles.footerText} >{this.state.secretKey}</Text>

      </SafeAreaView>

    );
  }

  componentDidMount() {
    this._fetchData();
  }

  async _fetchData() {
    let passcode;
    let keyStore;
    let pashadterss;
    let encrypt;
    try {
      passcode = await AsyncStorage.getItem('@passcode');
      keyStore = await AsyncStorage.getItem('@keyStore');
      pashadterss = await AsyncStorage.getItem('@pashadterss');
      encrypt = await AsyncStorage.getItem('@encrypt');

    } catch (e) {
      console.log(e);
    }

    let newPin = md5(pashadterss + passcode);
    let secretKey = utils.decrypt(keyStore, newPin);

    let decrypt = utils.decrypt(encrypt, newPin);
    let mnemonic = decrypt.split(' ');


    this.setState({
      mnemonic1: mnemonic[0],
      mnemonic2: mnemonic[1],
      mnemonic3: mnemonic[2],
      mnemonic4: mnemonic[3],
      mnemonic5: mnemonic[4],
      mnemonic6: mnemonic[5],
      mnemonic7: mnemonic[6],
      mnemonic8: mnemonic[7],
      mnemonic9: mnemonic[8],
      mnemonic10: mnemonic[9],
      mnemonic11: mnemonic[10],
      mnemonic12: mnemonic[11],
      secretKey: secretKey,
    })
  }


}

const styles = StyleSheet.create({
  inputView: {
    marginTop: 14,
    paddingHorizontal: 30,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderRadius: 6,
    textAlign: 'center',
    width: '30%',
    height: 38,
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    color: '#8f92a1',
    marginTop: 58,
  },
  footerText: {
    fontSize: 14,
    color: "#2d2d2d",
    marginHorizontal: 30,
    marginTop: 12,
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
    marginTop: 100,
    height: 58,
    paddingHorizontal: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  }
});