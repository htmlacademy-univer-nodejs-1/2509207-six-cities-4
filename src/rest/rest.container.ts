import { Logger, PinoLogger } from '../core/logger/index.js';
import { Config, RestConfig, RestSchema } from '../core/config/index.js';
import { Container } from 'inversify';
import { Application } from './application.js';
import { Component } from '../types/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../core/database-client/index.js';
import {AppExceptionFilter, ExceptionFilter} from '../core/rest/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();
  restApplicationContainer.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  return restApplicationContainer;
}
