import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './core/logger/index.js';
import { Application } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './core/config/index.js';
import { Component } from './types/index.js';


async function bootstrap() {
  const container = new Container();
  container.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<Application>(Component.RestApplication);
  await application.init();
}

bootstrap();
