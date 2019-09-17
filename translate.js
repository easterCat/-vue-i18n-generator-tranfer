const puppeteer = require("puppeteer");
const opencc = require("node-opencc");
const fs = require("fs-extra");
const writeFileSync = require("fs").writeFileSync;
const data = require("./zh_cn.js");
const config = require("./config");
const strHead = `${config.key === "" ? "default" : config.key}: {`;
const strEnd = "},";

const url =
  "https://translate.google.cn/#view=home&op=translate&sl=zh-CN&tl=en";

function handle() {
  try {
    translateZH(data);
    translateTW(data);
    translateEN(data);
  } catch (error) {
    console.log("生成资源文件出现错误", error);
  }
}

// 生成中文资源
function translateZH(obj) {
  var writeData = [];
  fs.ensureDirSync(config.zhLanguagePath);
  writeData.push(strHead);
  for (var [key, value] of Object.entries(data)) {
    writeData.push(`"${key}":"${value}",`);
  }
  writeData.push(strEnd);
  writeFileSync(config.zhLanguagePath + `/zh_CN.js`, writeData.join("\n"));
  console.log("简体中文资源生成完毕");
}

// 生成繁体中文资源
function translateTW(obj) {
  fs.ensureDirSync(config.twLanguagePath);
  var writeData = [];
  writeData.push(strHead);
  // https://www.npmjs.com/package/node-opencc
  for (var [key, value] of Object.entries(data)) {
    writeData.push(`"${key}":"${opencc.simplifiedToTraditional(value)}",`);
  }
  writeData.push(strEnd);
  writeFileSync(config.twLanguagePath + `/zh_TW.js`, writeData.join("\n"));
  console.log("繁体中文资源生成完毕");
}

// 生成英文资源
async function translateEN(obj) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  var writeData = [];
  fs.ensureDirSync(config.enLanguagePath);
  await page.goto(url);
  writeData.push(strHead);
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
    writeData.push(`"${key}":"${transOutput}",`);
    await page.click(".tlid-clear-source-text");
    await page.waitFor(500);
  }
  writeData.push(strEnd);
  writeFileSync(config.enLanguagePath + `/en.js`, writeData.join("\n"));
  await page.waitFor(1000);
  browser.close();
  console.log("英文资源文件生成完毕");
}

module.exports = handle;
