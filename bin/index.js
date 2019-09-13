const { execSync } = require("child_process");
const commander = require("commander");
const config = require("../config");
const fs = require("fs-extra");
const path = require("path");

commander
  .command("generate [src]")
  .description("对国际化生成文件进行翻译繁体")
  .option(
    "-p, --path <path>",
    "设置生成文件的路径，默认为运行目录（请设置已经存在的目录！！！）"
  )
  .action((src = "src", { path }) => {
    require("../beforeGenerate")();
    i18nGenerate(path);
    require("../handle")();
    // i18nRevert(path);
  });

function i18nGenerate(path) {
  let command = `i18n generate ${path ? path : config.scanPath}`;

  // if (config.key !== "") {
  //   command = command + ` --key ${config.key}`;
  // }

  if (config.cachePath) {
    command = command + ` --path ${config.cachePath}`;
  }

  execSync(command);

  fs.copySync(
    path.join(process.cwd(), "./tranfer/cache/zh_cn.js"),
    path.join(config.projectPath, "./zh_cn.js")
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
