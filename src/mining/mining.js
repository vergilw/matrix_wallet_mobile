import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Icon, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const BigNumber = require('bignumber.js');
import filters from '../utils/filters.js';
import MyStakesScreen from './my-stakes.js';
import AllStakesScreen from './all-stakes.js';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const MaterialTopTabNavigator = createMaterialTopTabNavigator({
  MyStakes: {
    screen: MyStakesScreen,
    navigationOptions: {
      tabBarLabel: '我的节点',
      // tabBarIcon: ({ tintColor }) => (
      //   <Icon name='ios-home' color={tintColor} size={24} />
      // ),
    }
  },
  AllStakes: {
    screen: AllStakesScreen,
    navigationOptions: {
      tabBarLabel: '所有节点',
      // tabBarIcon: ({ tintColor }) => (
      //   <Icon name='ios-settings' color={tintColor} size={24} />
      // ),
    }
  },
}, {
  initialRouteName: 'MyStakes',
  tabBarOptions: {
    activeTintColor: 'orange',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: '#fff',
    },
    indicatorStyle: {
      // height: 3,
      // marginHorizontal: 20,
      // backgroundColor: '#fbbe07',
      borderBottomColor: '#fbbe07',
      borderBottomWidth: 2,
    },
    showLabel: true,
  },
  tabBarComponent: SafeAreaMaterialTopTabBar,
});

const MiningRoot = createAppContainer(MaterialTopTabNavigator);

export default class MiningScreen extends React.Component {
  render() {
    return (
      <MiningRoot />
    )
  }
}

