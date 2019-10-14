import CryptoJS from 'crypto-js'

let encrypt = function(word, keyStr){
    // keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    // var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    // var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(word, keyStr);
    encrypted = encrypted.toString();
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    console.log(encData)
    return encData;
}
let decrypt = function(word, keyStr){
    console.log(word,keyStr)
    //keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    //var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8);
    var decrypt = CryptoJS.AES.decrypt(decData, keyStr);
    console.log(CryptoJS.enc.Utf8.stringify(decrypt).toString())
    console.log(CryptoJS.enc.Utf8.stringify(decrypt).toString(CryptoJS.enc.Utf8))
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
export default {//加密
    encrypt,
    decrypt
//   encrypt(word, keyStr){ 
//     keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
//     var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
//     var srcs = CryptoJS.enc.Utf8.parse(word);
//     var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
//     return encrypted.toString();
//   },
//   //解密
//   decrypt(word, keyStr){  
//     keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
//     var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
//     var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
//     return CryptoJS.enc.Utf8.stringify(decrypt).toString();
//   }

}