import { LogLevel } from 'amazon-chime-sdk-js'

const SDK_LOG_LEVELS = {
    'debug': LogLevel.DEBUG,
    'info': LogLevel.INFO,
    'warn': LogLevel.WARN,
    'error': LogLevel.ERROR,
    'off': LogLevel.OFF,
}

const urlParams = new URLSearchParams(window.location.search);
const queryLogLevel = urlParams.get('logLevel') || 'warn';
const logLevel = SDK_LOG_LEVELS[queryLogLevel] || SDK_LOG_LEVELS.warn;

const postLogConfig = {
  name: 'SDK_LOGS',
  batchSize: 85,
  intervalMs: 2000,
  url: '/logs',
  logLevel
};

const config = {
  logLevel,
  postLogConfig
};

export default config;
