import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

export default class MeAboutScreen extends React.Component {

  ActionType = Object.freeze({
    backup: Symbol("1"),
    delete: Symbol("2"),
  });

  constructor(props) {
    super(props);

    this.state = {
      balance: null,
      address: null,
      listData: [
        {
          title: '备份钱包',
        },
        {
          title: '删除钱包',
        },
        {
          title: '联系我们',
        }
      ],
      actionType: null,
      myNonceNum: 0,
      passcode: 'Vergilw123',
      isModalVisible: false,
      isLoading: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      </View>
    );
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => (
    <MeItem
      onPressItem={(index) => {
        if (index === 0) {
          this.setState({
            isModalVisible: true,
            actionType: this.ActionType.backup,
          });
        } else if (index === 1) {
          this.setState({
            isModalVisible: true,
            actionType: this.ActionType.delete,
          });
        } else if (index === 2) {
          this.props.navigation.navigate('');
        }
      }}
      index={index}
      title={item.title}
    />
  );

  _onSubmitPasscode() {
    if (this.state.actionType === this.ActionType.backup) {
      this._backupWallet();
    } else if (this.state.actionType === this.ActionType.delete) {
      this._deleteWallet();
    }
  }

  async _backupWallet() {

  }

  async _deleteWallet() {

  }
}

class MeItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  };

  render() {
    return (
      <TouchableHighlight activeOpacity={0.2} underlayColor='#f6f7fb' onPress={this._onPress}>
        <View style={styles.itemView}>
          <Text style={styles.itemTitleText}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  itemView: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 58,
  },
});
