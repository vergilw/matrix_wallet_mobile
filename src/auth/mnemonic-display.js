import React from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';


export default class MnemonicDisplayScreen extends React.Component {
  static navigationOptions = { headerTitle: '助记词' };

  constructor(props) {
    super(props);

    let mnemonic = props.navigation.getParam('mnemonic', ['']);

    this.state = {
      mnemonic: mnemonic,
      sequence: 0,
      displayedMnemonic: mnemonic[0],
      previousDisabled: true,
      nextTitle: '下一个',
    };

  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', }}>
        <StatusBar barStyle="default" backgroundColor="#fff" />

        <View style={styles.topView}>
          <View style={styles.wordsView}>
            <Text style={styles.wordsText} >{this.state.displayedMnemonic}</Text>
            <Text style={styles.wordsSequence} >{this.state.sequence + 1}/{this.state.mnemonic.length}</Text>
          </View>
          <Text style={styles.captionText} >请按顺序写下单词并保存在安全的地方</Text>
        </View>
        <View style={styles.actionView}>
          <Button
            disabled={this.state.previousDisabled}
            onPress={this._onPrevious.bind(this)}
            title='上一个'
            buttonStyle={styles.action}
            containerStyle={styles.actionPreviousContainer}
            titleStyle={styles.actionTitle}
            disabledStyle={styles.actionDisabled}
            disabledTitleStyle={styles.actionTitleDisabled} />
          <Button
            onPress={this._onNext.bind(this)}
            title={this.state.nextTitle}
            buttonStyle={styles.action}
            containerStyle={styles.actionNextContainer}
            titleStyle={styles.actionTitle}
            disabledStyle={styles.actionDisabled}
            disabledTitleStyle={styles.actionTitleDisabled} />
        </View>

      </SafeAreaView>
    );
  }

  _onPrevious() {
    if (this.state.sequence <= 0) {
      return;
    }

    if (this.state.sequence === 1) {
      this.setState({
        previousDisabled: true,
      })
    }

    this.setState({
      sequence: this.state.sequence - 1,
      nextTitle: '下一个',
      displayedMnemonic: this.state.mnemonic[this.state.sequence - 1],
    })
  }

  _onNext() {
    if (this.state.sequence > this.state.mnemonic.length - 1) {
      return;
    } else if (this.state.sequence === this.state.mnemonic.length - 1) {
      this._onDone();
      return;
    }

    if (this.state.sequence === this.state.mnemonic.length - 2) {
      this.setState({
        nextTitle: '完成',
      })
    }

    this.setState({
      sequence: this.state.sequence + 1,
      previousDisabled: false,
      displayedMnemonic: this.state.mnemonic[this.state.sequence + 1],
    })
  }

  _onDone() {
    this.props.navigation.navigate('App');
  }
}

const styles = StyleSheet.create({
  topView: {
    marginTop: 140,
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
  actionView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 58,
    marginBottom: 80,
  },
  action: {
    backgroundColor: '#fbbe07',
    height: 58,
    borderRadius: 4,
  },
  actionDisabled: {
    backgroundColor: 'rgba(251, 190, 7, 0.1)',
  },
  actionPreviousContainer: {
    flex: 1,
    paddingLeft: 30,
  },
  actionNextContainer: {
    flex: 2,
    paddingLeft: 10,
    paddingRight: 30,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
  },
  actionTitleDisabled: {
    color: '#fbbe07',
  }
});