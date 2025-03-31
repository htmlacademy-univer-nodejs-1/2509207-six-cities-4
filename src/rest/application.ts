import { inject, injectable } from 'inversify';
import { Logger } from '../core/logger/index.js';
import { Config, RestSchema } from '../core/config/index.js';
import { Component } from '../types/component.js';

@injectable()
export class Application {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.Config) private readonly config: Config<RestSchema>,
  ){ }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
