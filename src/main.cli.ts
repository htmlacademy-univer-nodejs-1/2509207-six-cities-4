#!/usr/bin/env node

import 'reflect-metadata';
import { CLIApplication, HelpCommand, VersionCommand, ImportCommand, GenerateCommand} from './cli/index.js';

const cliApp = new CLIApplication('--help');

cliApp.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
  new GenerateCommand()
]);

cliApp.processCommand(process.argv.slice(2));
