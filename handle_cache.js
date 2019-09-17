/**
 * use translation.js to fill translater into EN/CN/TW
 * google/youdao/baidu will not allow our ip
 */
const opencc = require("node-opencc");
const data = require("../zh_cn.js");
const writeFile = require("./dealFiles").writeFile;
const mkdir = require("./dealFiles").mkdir;
const config = require("./config");
const { baidu } = require("translation.js");
// const { baidu, google, youdao } = require('translation.js')
const strHead = `${config.key}: {`;
const strEnd = "}";
const req = baidu;

function handle() {
  generateFiles(config.sourcePath, data);
}

function generateFiles(floderPath, obj, cb) {
  Promise.all([
    translateEN(floderPath, obj),
    translateZH(floderPath, obj),
    translateTW(floderPath, obj)
  ])
    .then(function() {
      console.log("生成资源文件完成！");
    })
    .catch(error => {
      console.log("生成资源文件出现错误", error);
    });
}

function translateZH(floderPath, obj) {
  return new Promise(function(resolve, reject) {
    // 生成中文资源
    mkdir(floderPath + "/zh", async function() {
      var all = [];

      all.push(strHead);

      for (var key in obj) {
        await req
          .translate({ text: obj[key], com: true })
          .then(res => {
            all.push(`"${key.split(".")[1]}":"${obj[key]}",`);
          })
          .catch(err => {
            console.log(err);
          });
      }

      all.push(strEnd);

      writeFile(
        floderPath + `/zh/${config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );
    });
  });
}

function translateTW(floderPath, obj) {
  return new Promise(async function(resolve, reject) {
    // 生成繁体中文资源
    mkdir(floderPath + "/tw", async function() {
      var all = [];

      all.push(strHead);

      // for (let key in obj) {
      // 	await req
      // 		.translate({
      // 			text: obj[key],
      // 			to: 'zh-TW',
      // 			com: true
      // 		})
      // 		.then((zw) => {
      // 			all.push(`"${key.split('.')[1]}":"${zw.result[0]}",`)
      // 		})
      // 		.catch((err) => {
      // 			console.log(err)
      // 		})
      // }

      // https://www.npmjs.com/package/node-opencc
      for (var key in obj) {
        all.push(
          `"${key.split(".")[1]}":"${opencc.simplifiedToTraditional(
            obj[key]
          )}",`
        );
      }

      all.push(strEnd);

      writeFile(
        floderPath + `/tw/${config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );
    });
  });
}

function translateEN(floderPath, obj) {
  return new Promise(function(resolve, reject) {
    // 生成英文资源
    mkdir(floderPath + "/en", async function() {
      var all = [];

      all.push(strHead);

      for (var key in obj) {
        await req
          .translate({ text: obj[key], com: true })
          .then(en => {
            all.push(`"${key.split(".")[1]}":"${en.result[0]}",`);
          })
          .catch(err => {
            console.log(err);
          });
      }

      all.push(strEnd);

      writeFile(
        floderPath + `/en/${config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );
    });
  });
}

module.exports = handle;
