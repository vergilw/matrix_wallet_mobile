import React from 'react';
import { Text, View, Image, StyleSheet, StatusBar } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthScreen extends React.Component {
  static navigationOptions = { header: null };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbbe07' }}>
        <StatusBar barStyle="light-content" backgroundColor="#fbbe07" />
        <View />
        <View style={styles.sloganView}>
          <Image source={require('../../resources/img/auth/auth_walletLogo.png')} ></Image>
          <Text style={styles.sloganTitle} >ManGo</Text>
          <Text style={styles.sloganDesc} >用简单的方法管理资金</Text>
        </View>
        <View style={styles.actionView}>
          <Button onPress={() => this.props.navigation.navigate('PinCode')} buttonStyle={{ backgroundColor: '#fff', height: 58, borderRadius: 4, }} containerStyle={{ marginHorizontal: 30, }} title='创建钱包' titleStyle={{ color: '#fbbe07', fontSize: 16 }} />
          <Button onPress={() => this.props.navigation.navigate('MnemonicSign')} buttonStyle={{ backgroundColor: 'transparent', height: 58 }} containerStyle={{ marginHorizontal: 30, marginTop: 20, borderRadius: 4, borderWidth: 0.5, borderColor: '#fff' }} title='导入钱包' titleStyle={{ color: '#fff', fontSize: 16 }} />
        </View>

      </View>

    );
  }

  componentDidMount() {

    asyncIO = async () => {
      try {
        let address = await AsyncStorage.getItem('@address');
        console.log('auth componentDidMount', address)
        if (address !== null) {
          this.props.navigation.navigate('App');
        }
      } catch (e) {
        console.log(e);
      }
    }

    asyncIO();
  }

}

const styles = StyleSheet.create({
  sloganView: {
    height: 160,
    width: '100%',
    paddingHorizontal: 30,
  },
  sloganTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
  },
  sloganDesc: {
    fontSize: 15,
    color: '#fff',
  },
  actionView: {
    position: "absolute",
    bottom: '0%',
    marginBottom: 68,
    width: '100%',
  }
});