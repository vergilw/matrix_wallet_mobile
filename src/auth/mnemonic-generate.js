import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import WalletUtil from '../utils/WalletUtil.js';
import Utils from '../utils/utils.js';
import md5 from '../utils/md5.js';
import { updateLoading } from '../store/actions/index.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class MnemonicGenerateScreen extends React.Component {
  static navigationOptions = { headerTitle: '助记词' };

  constructor(props) {
    super(props);

    // let mnemonic = props.navigation.getParam('mnemonic', ['']);

    this.state = {
      actionDisabled: false,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.topView}>
          <Image source={require('../../resources/img/auth/auth_mnenonicBg.png')} style={styles.image} ></Image>
          <Text style={styles.captionText} >如果您的手机丢失、被盗、损失或升级助记词是恢复ManGo账户的唯一方法</Text>
          <Text style={styles.footerText} >即将向您显示助记词单词表，请将其写在纸上并保存在安全地方</Text>
        </View>
        <Button
          loading={this.state.actionDisabled}
          disabled={this.state.actionDisabled}
          onPress={this._onSubmit.bind(this)}
          title='书写助记词'
          buttonStyle={styles.action}
          containerStyle={styles.actionContainer}
          titleStyle={styles.actionTitle} />

      </SafeAreaView>
    );
  }

  _generateMnemonic() {

    let that = this;

    asyncIO = async () => {

      let mnemonic = WalletUtil.createMnemonic();
      let privateKey = WalletUtil.mnemonicToPrivateKey(mnemonic).toString("hex");

      let mnemonicList = mnemonic.split(" ");
      let wallet = WalletUtil.privateKeyToWallet(privateKey);
      let pashadterss = wallet.signingKey.publicKey.split('').reverse().join("");

      try {
        const passcode = await AsyncStorage.getItem('@passcode');
        let newPasscode = md5(pashadterss + passcode);
        let keyStore = Utils.encrypt(privateKey, newPasscode);
        let encrypt = Utils.encrypt(mnemonic, newPasscode);

        await AsyncStorage.setItem('@pashadterss', pashadterss);
        await AsyncStorage.setItem('@address', wallet.address);
        await AsyncStorage.setItem('@keyStore', keyStore);
        await AsyncStorage.setItem('@encrypt', encrypt);

      } catch (e) {
        console.log(e);
      }

      this.setState({
        actionDisabled: false,
      })
      // this.props.updateLoading(false);


      that.props.navigation.navigate('MnemonicDisplay', { mnemonic: mnemonicList });
    }

    asyncIO();
  }

  _onSubmit() {
    this.setState({
      actionDisabled: true,
    })

    // this.props.updateLoading(true);

    setTimeout(() => {
      this._generateMnemonic();
    }, 1);
    
  }
}

MnemonicGenerateScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state.mnemonicGenerate.isLoading);
  return {
    isLoading: state.mnemonicGenerate.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoading: (boolean) => dispatch(updateLoading(boolean)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MnemonicGenerateScreen);

const styles = StyleSheet.create({
  topView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 188,
    height: 250,
  },
  captionText: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 50,
    marginHorizontal: 65,
    lineHeight: 22,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 12,
    marginHorizontal: 75,
    lineHeight: 21,
    textAlign: 'center',
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
    marginBottom: 80,
    height: 58,
    paddingHorizontal: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  }
});