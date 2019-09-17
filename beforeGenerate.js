const path = require("path");
const config = require("./config");
const fs = require("fs-extra");

function beforeGenerate() {
  console.log(
    "获取的路径是===>",
    path.join(process.cwd(), config.translatePath)
  );
  fs.ensureDirSync(path.join(process.cwd(), config.translatePath));
  fs.ensureDirSync(path.join(process.cwd(), config.cachePath));
  fs.removeSync(path.join(process.cwd(), "./translate/cache/zh_cn.js")); // 删除之前的generate文件zh_cn
  fs.removeSync(path.join(config.projectPath, "./zh_cn.js")); // 删除之前的generate文件zh_cn
}

module.exports = beforeGenerate;
