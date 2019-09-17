#!/usr/bin/env node
const { execSync } = require("child_process");
const program = require("commander");
const beforeGenerate = require("../beforeGenerate");
const afterGenerate = require("../afterGenerate");
const packageInfo = require("../package.json");
const config = require("../config");

try {
  program.version(packageInfo.version, "-v, --version");
  program
    .command("generate [src]")
    .description("对src文件国际化后的生成文件进行繁体翻译和英文翻译")
    .option(
      "-p, --path <path>",
      "设置生成文件的路径，默认为运行目录（请设置已经存在的目录！！！）"
    )
    .action(async (src = "src", { path }) => {
      beforeGenerate();
      i18nGenerate(src);
      require("../translate")();
    });

  program
    .command("revert [src]")
    .description("对src文件国际化后的生成文件进行复原")
    .option(
      "-p, --path <path>",
      "设置生成文件的路径，默认为运行目录（请设置已经存在的目录！！！）"
    )
    .action(async (src = "src", { path }) => {
      i18nRevert(path);
    });

  program.parse(process.argv);
} catch (error) {
  throw error;
}

function i18nGenerate(path) {
  let command = `i18n generate ${path ? path : config.scanPath}`;
  if (config.cachePath) {
    command = command + ` --path ${config.cachePath}`;
  }
  execSync(command);
  afterGenerate();
}

function i18nRevert(path) {
  let command = `i18n revert ${path ? path : config.scanPath}`;
  if (config.cachePath) {
    command = command + ` --path ${config.cachePath}`;
  }
  execSync(command);
}
