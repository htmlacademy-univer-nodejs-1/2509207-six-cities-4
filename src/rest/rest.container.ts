import { Logger, PinoLogger } from '../core/logger/index.js';
import { Config, RestConfig, RestSchema } from '../core/config/index.js';
import { Container } from 'inversify';
import { Application } from './application.js';
import { Component } from '../types/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../core/database-client/index.js';
import { AppExceptionFilter, ExceptionFilter, ValidationExceptionFilter } from '../core/rest/index.js';
import { HttpErrorExceptionFilter } from '../core/rest/exception-filter/http-error.exception-filter.js';
import { PathTransformer } from '../core/rest/transform/path-transformer.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();
  restApplicationContainer.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();
  return restApplicationContainer;
}
