#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import chalk from 'chalk';

// Устанавливаем require для ES-модулей
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(chalk.blueBright('Доступные команды:'));
  console.log(chalk.green('--help') + '\t\tПоказать помощь');
  console.log(chalk.green('--version') + '\t\tПоказать версию приложения');
  console.log(chalk.green('--import <path>') + '\tИмпортировать данные из TSV-файла');
}

function showVersion() {
  console.log(chalk.yellow(`Версия приложения: ${packageJson.version}`));
}

function importData(filePath: string) {
  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(chalk.red(`Файл не найден: ${fullPath}`));
    process.exit(1);
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
  case '--import':
    const filePath = args[1];
    if (!filePath) {
      console.error(chalk.red('Укажите путь к TSV-файлу после --import'));
      process.exit(1);
    }
    importData(filePath);
    break;
  default:
    console.error(chalk.red(`Неизвестная команда: ${command}`));
    showHelp();
    process.exit(1);
}