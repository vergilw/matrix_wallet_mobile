import React from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import WalletUtil from '../utils/WalletUtil.js';

class PinCodeModalScreen extends React.Component {

  state = {
    receiver: null,
    amount: null,
    remark: null,
    myNonceNum: 0,
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start',  }}>
        <View style={{ height: '50%', width: '100%', backgroundColor: '#fff'}}></View>
      </View>
    );
  }

  _onSubmit() {


    
  }
}

export default PinCodeModalScreen;

const styles = StyleSheet.create({
  receiverHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 150,
    marginLeft: 16,
  },
  receiverInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  amountHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 20,
    marginLeft: 16,
  },
  amountInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  remarkHeader: {
    fontSize: 14,
    color: '#2d2d2d',
    marginTop: 20,
    marginLeft: 16,
  },
  remarkInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
    width: '100%',
    fontSize: 15,
  },
  actionRight: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 6,
  },
  actionRightContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 56,
  },
  actionRightTitle: {
    color: '#fff',
    fontSize: 16,
  },
});

