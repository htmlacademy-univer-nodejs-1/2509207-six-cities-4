#!/usr/bin/env node

import { createRequire } from 'node:module';
import chalk from 'chalk';
import { generateOffers } from './cli/generate.js';
import { importOffers } from './cli/import.js';


const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(chalk.blueBright('Доступные команды:'));
  console.log(`${chalk.green('--help')}\t\tПоказать помощь`);
  console.log(`${chalk.green('--version')}\t\tПоказать версию приложения`);
  console.log(`${chalk.green('--import <path>')}\tИмпортировать данные из TSV-файла`);
  console.log(`${chalk.green('--generate <n> <path> <url>')}\tСгенерировать n предложений в .tsv из JSON-сервера`);
}

function showVersion() {
  console.log(chalk.yellow(`Версия приложения: ${packageJson.version}`));
}

switch (command) {
  case '--help':
  case undefined:
    showHelp();
    break;
  case '--version':
    showVersion();
    break;
  case '--import': {
    const filePath = args[1];
    if (!filePath) {
      throw new Error('Укажите путь к TSV-файлу после --import');
    }
    importOffers(filePath);
    break;
  }
  case '--generate': {
    const count = Number(args[1]);
    const filepath = args[2];
    const url = args[3];

    if (!count || !filepath || !url) {
      throw new Error('Использование: --generate <кол-во> <путь к .tsv> <url>');
    }

    generateOffers(count, filepath, url).catch(console.error);
    break;
  }
  default:
    throw new Error(`Неизвестная команда: ${command}`);
    showHelp();
}
