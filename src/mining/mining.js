import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Icon, Dimensions, ImageBackground, StatusBar, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
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
  tabBarOptions: {
    // activeTintColor: 'orange',
    // inactiveTintColor: 'grey',
    labelStyle: {
      color: '#2d2d2d',
      fontSize: 15,
    },
    style: {
      backgroundColor: '#fff',
    },
    indicatorStyle: {
      marginHorizontal: (Dimensions.get('window').width / 2 - 48) / 2,
      borderBottomColor: '#fbbe07',
      width: 48,
    },
  },
  lazy: true,
  tabBarComponent: SafeAreaMaterialTopTabBar,
});

const MiningRoot = createAppContainer(MaterialTopTabNavigator);

export default class MiningScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MiningRoot />
        <TouchableOpacity style={styles.postBtn} onPress={() =>  {
          this.props.navigation.navigate('StakePost');
        }}>
          <LinearGradient colors={['#fde011', '#fbbe07']} locations={[0, 0.7]} style={styles.linear}>
            <Text>+</Text>
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
    alignItems:  'center',
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

