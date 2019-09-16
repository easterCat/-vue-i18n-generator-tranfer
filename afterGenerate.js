const fs = require("fs-extra");
const nodePath = require("path");
const config = require("./config");

function afterGenerate() {
  fs.copySync(
    nodePath.join(process.cwd(), "./tranfer/cache/zh_cn.js"),
    nodePath.join(config.projectPath, "./zh_cn.js")
  );
}

module.exports = afterGenerate;
