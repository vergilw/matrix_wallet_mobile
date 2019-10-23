import HttpProvider from '../utils/HttpProvider.js';

export const chainUrl = 'https://api85.matrix.io'

global.httpProvider = new HttpProvider(chainUrl);