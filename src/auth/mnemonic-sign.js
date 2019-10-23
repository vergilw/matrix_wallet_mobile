import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from "../utils/WalletUtil.js";

export default class MnemonicSignScreen extends React.Component {
  static navigationOptions = { headerTitle: '登录' };
  // const [value, onChangeText] = React.useState('Useless Placeholder');
  state = {
    // mnemonic1: null,
    // mnemonic2: null,
    // mnemonic3: null,
    // mnemonic4: null,
    // mnemonic5: null,
    // mnemonic6: null,
    // mnemonic7: null,
    // mnemonic8: null,
    // mnemonic9: null,
    // mnemonic10: null,
    // mnemonic11: null,
    // mnemonic12: null,
    mnemonic1: 'loop',
    mnemonic2: 'credit',
    mnemonic3: 'master',
    mnemonic4: 'north',
    mnemonic5: 'brand',
    mnemonic6: 'poem',
    mnemonic7: 'diet',
    mnemonic8: 'deny',
    mnemonic9: 'link',
    mnemonic10: 'develop',
    mnemonic11: 'wear',
    mnemonic12: 'like',
  }

  // inputPlaceholderArr = [];

  constructor(props) {
    super(props);

    // for (var i=0; i<12; i++) {
    //   let int = i + 1;
    //   this.inputPlaceholderArr.push({index: i, text: (int < 10) ? '0' + int.toString() : int.toString()});
    // }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <Text style={styles.title} >请按顺序写下助记词</Text>

        <View style={styles.inputView}>

          <TextInput
            style={styles.input}
            placeholder='01'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic1: text })}
            value={this.state.mnemonic1}
          />
          <TextInput
            style={styles.input}
            placeholder='02'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic2: text })}
            value={this.state.mnemonic2}
          />
          <TextInput
            style={styles.input}
            placeholder='03'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic3: text })}
            value={this.state.mnemonic3}
          />
          <TextInput
            style={styles.input}
            placeholder='04'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic4: text })}
            value={this.state.mnemonic4}
          />
          <TextInput
            style={styles.input}
            placeholder='05'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic5: text })}
            value={this.state.mnemonic5}
          />
          <TextInput
            style={styles.input}
            placeholder='06'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic6: text })}
            value={this.state.mnemonic6}
          />
          <TextInput
            style={styles.input}
            placeholder='07'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic7: text })}
            value={this.state.mnemonic7}
          />
          <TextInput
            style={styles.input}
            placeholder='08'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic8: text })}
            value={this.state.mnemonic8}
          />
          <TextInput
            style={styles.input}
            placeholder='09'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic9: text })}
            value={this.state.mnemonic9}
          />
          <TextInput
            style={styles.input}
            placeholder='10'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic10: text })}
            value={this.state.mnemonic10}
          />
          <TextInput
            style={styles.input}
            placeholder='11'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic11: text })}
            value={this.state.mnemonic11}
          />
          <TextInput
            style={styles.input}
            placeholder='12'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ mnemonic12: text })}
            value={this.state.mnemonic12}
          />
        </View>
        <Button onPress={this._onSubmit.bind(this)} title='进入钱包' buttonStyle={styles.action} containerStyle={styles.actionContainer} titleStyle={styles.actionTitle} />

      </SafeAreaView>

    );
  }

  // const inputPlaceholders = [{text: }]
  // inputListComponent = inputs.map()

  _onSubmit() {
    let arr = [];
    arr.push(this.state.mnemonic1.trim());
    arr.push(this.state.mnemonic2.trim());
    arr.push(this.state.mnemonic3.trim());
    arr.push(this.state.mnemonic4.trim());
    arr.push(this.state.mnemonic5.trim());
    arr.push(this.state.mnemonic6.trim());
    arr.push(this.state.mnemonic7.trim());
    arr.push(this.state.mnemonic8.trim());
    arr.push(this.state.mnemonic9.trim());
    arr.push(this.state.mnemonic10.trim());
    arr.push(this.state.mnemonic11.trim());
    arr.push(this.state.mnemonic12.trim());
    let wallet = WalletUtil.privateKeyToWallet(
      WalletUtil.mnemonicToPrivateKey(arr).toString("hex")
    );
    let pashadterss = wallet.signingKey.publicKey.split('').reverse().join("");
    let privateKey = wallet.privateKey.slice(2);

    this.props.navigation.navigate('PinCode', { 'pashadterss': pashadterss, 'address': wallet.address, 'mnemonic': arr, 'privateKey': privateKey, 'isSign': true });
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