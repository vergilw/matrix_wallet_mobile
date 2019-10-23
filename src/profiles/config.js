import HttpProvider from '../utils/HttpProvider.js';

export const chainUrl = 'https://testnet.matrix.io'

global.httpProvider = new HttpProvider(chainUrl);