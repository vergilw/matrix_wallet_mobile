import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class MnemonicGenerateScreen extends React.Component {
  static navigationOptions = { headerTitle: '助记词' };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />

        <View style={styles.topView}>
          <Image style={styles.image} ></Image>
          <Text style={styles.captionText} >如果您的手机丢失、被盗、损失或升级助记词是恢复ManGo账户的唯一方法</Text>
          <Text style={styles.footerText} >即将向您显示助记词单词表，请将其写在纸上并保存在安全地方</Text>
        </View>
        <Button onPress={this._onSubmit.bind(this)} title='书写助记词' buttonStyle={styles.action} containerStyle={styles.actionContainer} titleStyle={styles.actionTitle} />

      </SafeAreaView>
    );
  }

  _onSubmit() {
  }
}

const styles = StyleSheet.create({
  topView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  image: {
    width: 188,
    height: 250,
    backgroundColor: '#ccc',
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