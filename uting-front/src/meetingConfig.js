import { LogLevel } from "amazon-chime-sdk-js";
import baseurl from "./utils/baseurl";

const SDK_LOG_LEVELS = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  off: LogLevel.OFF,
};

const urlParams = new URLSearchParams(window.location.search);

const queryLogLevel = urlParams.get("logLevel") || "warn";
const logLevel = SDK_LOG_LEVELS[queryLogLevel] || SDK_LOG_LEVELS.warn;
//  const logLevel = LogLevel.OFF; // 이걸 활성화해서 post 없앨수도 있음.
console.log(logLevel);
const postLogConfig = {
  name: "SDK_LOGS",
  batchSize: 85,
  intervalMs: 2000,
  url: `${baseurl.baseBack}/meetings/logs`,
  logLevel,
};

const config = {
  logLevel,
  postLogConfig,
};
console.log(postLogConfig.url);
export default config;
