/**
 * @format
 */

import 'react-native-gesture-handler';
import React, {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './shim.js';
import './src/profiles/config.js';
import EthProvider from './src/utils/EthProvider.js';

//FIXME: DEBUG
console.disableYellowBox = true;

global.ethProvider = new EthProvider();

AppRegistry.registerComponent(appName, () => App);
