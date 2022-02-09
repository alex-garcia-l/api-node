const APP_SERVER = process.env.APP_SERVER || 'localhost';
const APP_PORT = process.env.PORT || process.env.APP_PORT;
const APP_VERSION = process.env.APP_VERSION || 'v1';

const SERVER_PATH = `http://${APP_SERVER}:${APP_PORT}`;
const RELATIVE_API_PATH = `/api/${APP_VERSION}`;
const SERVER_API_PATH = `${SERVER_PATH}${RELATIVE_API_PATH}`;

module.exports = {
  APP_VERSION,
  APP_SERVER,
  APP_PORT,
  SERVER_PATH,
  RELATIVE_API_PATH,
  SERVER_API_PATH
}
