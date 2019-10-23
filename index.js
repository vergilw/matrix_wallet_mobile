/**
 * @format
 */

import 'react-native-gesture-handler';
import React, {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './shim.js';
import './src/profiles/config.js';

AppRegistry.registerComponent(appName, () => App);
