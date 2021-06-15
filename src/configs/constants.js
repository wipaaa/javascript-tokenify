const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  accountAddress: process.env.ACCOUNT_ADDRESS,
  accountKey: process.env.ACCOUNT_KEY,
  serverPort: process.env.SERVER_PORT || '5000',
  uriLocalProvider: process.env.URI_LOCAL_PROVIDER,
  uriRemoteProvider: process.env.URI_REMOTE_PROVIDER,
};
