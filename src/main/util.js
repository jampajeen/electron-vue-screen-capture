import { app } from 'electron';
const os = require('os');
const interfaces = os.networkInterfaces();
const fs = require('fs');
import { isDev } from '../global/libs/tools';
/**
 * 返回文件后缀名
 */
export function getSuffix (name) {
  let suffixStr = name.split('.');
  return suffixStr[suffixStr.length - 1].toLocaleLowerCase();
}

/**
 * 读取json文件
 * @param {string} filePath 
 */
export function readJsonFile (filePath){
  try {
    let json= fs.readFileSync(`${filePath}`, 'utf-8');
    return JSON.parse(json);
  } catch (error) {
    console.log(error);
    return {};
  }
}

/**
 * 判断是否为mac
 */
export function isMac () {
  return os.type().toLowerCase().indexOf('darwin') !== -1;
}

/**
 * 获取本地的文件链接
 * @param {string} fileName
 */
export function getStaticFilePath (fileName) {
  const path = require('path');
  let filePath = '';
  if(isDev) {
    filePath = path.join(__dirname, `../static/${fileName}`);
  } else {
    if(isMac()) {
      filePath = path.join(path.dirname(app.getPath('exe')), `../Resources/${fileName}`);
    } else {
      filePath = path.join(path.dirname(app.getPath('exe')), `/resources/${fileName}`);
    }
  }
  return filePath;
}

/**
 * 获取MAC地址
 */
export function getMac () {
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.mac !== "00:00:00:00:00:00") {
        return alias.mac;
      }
    }
  }
  return 'mac is null';
}

/**
 * 获取本地配置
 * @param {Array} keyArr 
 * @param {String} renderer 
 */
export function getLocalConfig (keyArr){
  const filePath = getStaticFilePath('config.json');
  const localConfig = readJsonFile(filePath);
  let config = {};
  for (const val of keyArr) {
    if(localConfig[val] !== undefined) {
      config[val] = localConfig[val];
    }
  }
  return config;
}
