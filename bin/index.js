#!/usr/bin/env node

const { execSync } = require("child_process");
const packageInfo = require("../package.json");
const program = require("commander");
const config = require("../config");
const fs = require("fs-extra");
const nodePath = require("path");

try {
  program.version(packageInfo.version, "-v, --version");
  program
    .command("generate [src]")
    .description("对src文件国际化后的生成文件进行繁体翻译和英文翻译")
    .option(
      "-p, --path <path>",
      "设置生成文件的路径，默认为运行目录（请设置已经存在的目录！！！）"
    )
    .action((src = "src", { path }) => {
      require("../beforeGenerate")();
      i18nGenerate(src);
      setTimeout(() => {
        require("../handle")();
      });
      // i18nRevert(path);
    });

  program.parse(process.argv);
} catch (error) {
  throw error;
}

function i18nGenerate(path) {
  console.log("需要抽离中文的文件夹=====>", path);
  let command = `i18n generate ${path ? path : config.scanPath}`;

  // if (config.key !== "") {
  //   command = command + ` --key ${config.key}`;
  // }

  if (config.cachePath) {
    command = command + ` --path ${config.cachePath}`;
  }

  execSync(command);

  fs.copySync(
    nodePath.join(process.cwd(), "./tranfer/cache/zh_cn.js"),
    nodePath.join(config.projectPath, "./zh_cn.js")
  );
}

function i18nRevert(path) {
  if (config.status === "test") {
    let command = `i18n revert ${path ? path : config.scanPath}`;

    if (config.cachePath) {
      command = command + ` --path ${config.cachePath}`;
    }
    execSync(command);
  }
}
