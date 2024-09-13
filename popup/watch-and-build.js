const chokidar = require('chokidar');
const { exec } = require('child_process');
const debounce = require('lodash').debounce;
// 设定要监听的目录，这里以项目根目录为例
const watchedDirectory = './src';

// 初始化 chokidar 监听器
const watcher = chokidar.watch(watchedDirectory, {
    ignored: /(^|[\/\\])\../, // 忽略点文件，如 .git, .vscode 等
    persistent: true,
    ignoreInitial: true,
});

const log = debounce(build, 1000);
// 监听变化事件
watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', path => log(`File ${path} has been removed`))
    .on('ready', () => log('Initial scan complete. Ready for changes.'))
    .on('error', error => log(`Watcher error: ${error}`));

// 自定义的日志函数
function build(message) {
    exec('npx vite build', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
}

