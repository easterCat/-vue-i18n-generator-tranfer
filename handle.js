const puppeteer = require("puppeteer");
const opencc = require("node-opencc");
const data = require("./zh_cn.js");
const writeFile = require("./dealFiles").writeFile;
const mkdir = require("./dealFiles").mkdir;
const config = require("./config");
const strHead = `${config.key === "" ? "default" : config.key}: {`;
const strEnd = "},";

const url =
  "https://translate.google.cn/#view=home&op=translate&sl=zh-CN&tl=en";

function handle() {
  console.log(data);

  Promise.all([tranferEN(data), tranferZH(data), tranferTW(data)])
    .then(function() {
      console.log("生成资源文件完成！");
    })
    .catch(error => {
      console.log("生成资源文件出现错误", error);
    });
}

function tranferZH(obj) {
  return new Promise(function(resolve, reject) {
    // 生成中文资源
    mkdir(config.zhLanguagePath, async function() {
      var all = [];

      all.push(strHead);

      for (var [key, value] of Object.entries(data)) {
        all.push(`"${key}":"${value}",`);
      }

      all.push(strEnd);

      writeFile(
        config.zhLanguagePath +
          `/${config.key === "" ? "default" : config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );
    });
  });
}

function tranferTW(obj) {
  return new Promise(async function(resolve, reject) {
    // 生成繁体中文资源
    mkdir(config.twLanguagePath, async function() {
      var all = [];

      all.push(strHead);

      // https://www.npmjs.com/package/node-opencc
      for (var [key, value] of Object.entries(data)) {
        all.push(`"${key}":"${opencc.simplifiedToTraditional(value)}",`);
      }

      all.push(strEnd);

      writeFile(
        config.twLanguagePath +
          `/${config.key === "" ? "default" : config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );
    });
  });
}

function tranferEN(obj) {
  return new Promise(function(resolve, reject) {
    // 生成英文资源
    mkdir(config.enLanguagePath, async function() {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url);
      var all = [];

      all.push(strHead);

      for (var [key, value] of Object.entries(data)) {
        await page.type("#source", value, { delay: 10 });
        await page.waitFor(1500);
        var transOutput = await page.evaluate(() => {
          var text = "";
          var node = document.querySelector(".tlid-translation span");
          if (node) {
            text = node.innerText;
          }
          return text;
        });

        all.push(`"${key}":"${transOutput}",`);

        await page.click(".tlid-clear-source-text");
        await page.waitFor(500);
      }

      all.push(strEnd);

      writeFile(
        config.enLanguagePath +
          `/${config.key === "" ? "default" : config.key}_resource.js`,
        all.join("\n"),
        function() {
          resolve();
        }
      );

      await page.waitFor(1000);
      browser.close();
    });
  });
}

module.exports = handle;
