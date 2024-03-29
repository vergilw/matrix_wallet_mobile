import React from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';
import NavigationService from '../utils/NavigationService.js';

export default class MeScreen extends React.Component {

  ActionType = Object.freeze({
    backup: Symbol("1"),
    delete: Symbol("2"),
  });

  constructor(props) {
    super(props);

    let versionNumber = DeviceInfo.getVersion();
    let buildNumber = DeviceInfo.getBuildNumber();

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
          title: '版本',
          value: versionNumber + '(' + buildNumber + ')'
        }
      ],
      actionType: null,
      myNonceNum: 0,
      passcode: null,
      isModalVisible: false,
      isLoading: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <FlatList
          style={styles.list}
          data={this.state.listData}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          getItemLayout={(data, index) => (
            { length: 58, offset: 59 * index, index }
          )}
          ItemSeparatorComponent={() => {
            return <View style={{ marginHorizontal: 16, height: 1, backgroundColor: '#f7f7f7' }}>
            </View>
          }}

        />

        <Modal
          style={{ margin: 0, justifyContent: 'flex-end', }}
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          swipeDirection={['down']}
        >
          <View style={styles.modal}>
            <View style={styles.modalHandle}></View>
            <View style={{ marginTop: 26, paddingHorizontal: 35, alignSelf: 'stretch', }}>
              <TextInput
                secureTextEntry={true}
                style={styles.modalInput}
                placeholder='请输入PIN码，以此验证你的身份'
                returnKeyType='done'
                onChangeText={(text) => this.setState({ passcode: text })}
                value={this.state.passcode}
              />
            </View>
            <Button
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              onPress={() => {
                this._onSubmitPasscode();
              }}
              title='确定'
              buttonStyle={styles.action}
              containerStyle={{
                width: '100%',
                marginTop: 26,
                height: 58,
                paddingHorizontal: 30,
                marginBottom: 50,
              }}
              titleStyle={styles.actionTitle}
            />
          </View>
        </Modal>
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
          // this.props.navigation.navigate('MeAbout');
        }
      }}
      index={index}
      title={item.title}
      value={item.value}
    />
  );

  async _onSubmitPasscode() {
    let passcode;
    let keyStore;
    let pashadterss;
    try {
      passcode = await AsyncStorage.getItem('@passcode');
      keyStore = await AsyncStorage.getItem('@keyStore');
      pashadterss = await AsyncStorage.getItem('@pashadterss');

    } catch (e) {
      console.log(e);
    }

    //validate passcode
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z]\S{7,15}$/;
    if (!reg.test(this.state.passcode) || this.state.passcode !== passcode) {
      Toast.show("PIN码输入有误，请重新输入", {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      return;
    }
    
    if (this.state.actionType === this.ActionType.backup) {
      this.setState({
        isModalVisible: false,
      }, () => {
        this.props.navigation.navigate('MeBackupWallet');
      });

    } else if (this.state.actionType === this.ActionType.delete) {
      this._deleteWallet();
    }
  }

  async _deleteWallet() {
    try {
      await AsyncStorage.clear();

    } catch (e) {
      console.log(e);
    }

    Toast.show("删除成功", {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });

    NavigationService.navigate('Auth');
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
          <Text style={styles.itemValueText}>{this.props.value}</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',

  },
  itemTitleText: {
    fontSize: 14,
    color: "#222222",
    fontWeight: 'bold',
  },
  itemValueText: {
    fontSize: 14,
    color: "#222222",
  },
  modal: {
    borderRadius: 16,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalHandle: {
    width: 38,
    height: 5,
    backgroundColor: 'rgba(45, 45, 45, 0.2)',
    borderRadius: 2.5,
    marginTop: 22,
  },
  modalInput: {
    textAlign: 'center',
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
  },
});
