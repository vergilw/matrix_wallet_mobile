import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class MnemonicDisplayScreen extends React.Component {
  static navigationOptions = { headerTitle: '助记词' };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />

        <View style={styles.topView}>
          <View style={styles.wordsView}>
            <Text style={styles.wordsText} >BitCoin</Text>
            <Text style={styles.wordsSequence} >1/12</Text>
          </View>
          <Text style={styles.captionText} >请按顺序写下单词并保存在安全的地方</Text>
        </View>
        <Button onPress={this._onSubmit.bind(this)} title='下一个' buttonStyle={styles.action} containerStyle={styles.actionContainer} titleStyle={styles.actionTitle} />

      </SafeAreaView>
    );
  }

  _onSubmit() {
  }
}

const styles = StyleSheet.create({
  topView: {
    marginTop: 90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 222,
    height: 222,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#f0f1f2',
    borderRadius: 7.5,
    shadowColor: 'rgba(134, 142, 155, 0.09)',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  wordsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 15,
  },
  wordsSequence: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 15,
  },
  captionText: {
    fontSize: 13,
    color: '#8f92a1',
    marginTop: 32,
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