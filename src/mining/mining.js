import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Icon, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const BigNumber = require('bignumber.js');
import filters from '../utils/filters.js';
import StakeMyScreen from './stake-my.js';
import StakeAllScreen from './stake-all.js';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

function SafeAreaMaterialTopTabBar(props) {
  return (
    <SafeAreaView>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const MaterialTopTabNavigator = createMaterialTopTabNavigator({
  MyStakes: {
    screen: StakeMyScreen,
    navigationOptions: {
      tabBarLabel: '我的节点',
      // tabBarIcon: ({ tintColor }) => (
      //   <Icon name='ios-home' color={tintColor} size={24} />
      // ),
    }
  },
  AllStakes: {
    screen: StakeAllScreen,
    navigationOptions: {
      tabBarLabel: '所有节点',
      // tabBarIcon: ({ tintColor }) => (
      //   <Icon name='ios-settings' color={tintColor} size={24} />
      // ),
    }
  },
}, {
  initialRouteName: 'MyStakes',
  // initialLayout: {
  //   width: Dimensions.get('window').width,
  //   height: Dimensions.get('window').height,
  // },
  tabBarOptions: {
    labelStyle: {
      color: '#2d2d2d',
      fontSize: 15,
    },
    style: {
      backgroundColor: '#fff',
      // width: Dimensions.get('window').width,
    },
    indicatorStyle: {
      // paddingHorizontal: (Dimensions.get('window').width / 2 - 80) / 2,
      borderBottomColor: '#fbbe07',
      // width: 80,
    },
    tabStyle: {
      // width: Dimensions.get('window').width/2,
      borderColor: 'transparent',
      borderBottomColor: '#f7f7f7',
      borderWidth: 1,
    }
  },
  lazy: true,
  tabBarComponent: SafeAreaMaterialTopTabBar,
});

const MiningRoot = createAppContainer(MaterialTopTabNavigator);

export default class MiningScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MiningRoot screenProps={{ parentNavigation: this.props.navigation }} />
        <TouchableOpacity style={styles.postBtn} onPress={() => {
          this.props.navigation.navigate('StakePost');
        }}>
          <LinearGradient colors={['#fde011', '#fbbe07']} locations={[0, 0.7]} style={styles.linear}>
            <Image source={require('../../resources/img/mining/stake_post.png')} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linear: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  postBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,

    // backgroundColor
  }
});

