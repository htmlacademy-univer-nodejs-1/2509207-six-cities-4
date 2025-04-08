import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(): void {
    console.log(chalk.blueBright('Доступные команды:'));
    console.log(`${chalk.green('--help')}\t\tПоказать помощь`);
    console.log(`${chalk.green('--version')}\t\tПоказать версию приложения`);
    console.log(`${chalk.green('--import <path>')}\tИмпортировать данные из TSV-файла`);
    console.log(`${chalk.green('--generate <n> <path> <url>')}\tСгенерировать n предложений в .tsv из JSON-сервера`);
  }
}
