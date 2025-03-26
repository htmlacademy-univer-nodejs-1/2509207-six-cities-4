#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import chalk from 'chalk';

// Устанавливаем require для ES-модулей
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(chalk.blueBright('Доступные команды:'));
  console.log(`${chalk.green('--help')}\t\tПоказать помощь`);
  console.log(`${chalk.green('--version')}\t\tПоказать версию приложения`);
  console.log(`${chalk.green('--import <path>')}\tИмпортировать данные из TSV-файла`);
}

function showVersion() {
  console.log(chalk.yellow(`Версия приложения: ${packageJson.version}`));
}

function importData(filePath: string) {
  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Файл не найден: ${fullPath}`);
  }

  const data = fs.readFileSync(fullPath, 'utf-8');
  console.log(chalk.green('Импорт завершён. Содержимое:'));
  console.log(data);
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
    importData(filePath);
    break;
  }
  default:
    throw new Error(`Неизвестная команда: ${command}`);
    showHelp();

}
