import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
   HOST: string;
   PORT: number;
   SALT: string;
 }

export const configRestSchema = convict<RestSchema>({
  HOST: {
    doc: 'Host for incoming connections',
    format: 'ipaddress',
    env: 'HOST',
    default: '127.0.0.1'
  },
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
});
