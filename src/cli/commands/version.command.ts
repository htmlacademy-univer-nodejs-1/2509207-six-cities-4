import chalk from 'chalk';
import { Command } from './command.interface.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJson = require('../../../package.json');

export class VersionCommand implements Command {
  public execute(): void {
    console.log(chalk.yellow(`Версия приложения: ${packageJson.version}`));
  }

  public getName(): string {
    return '--version';
  }
}