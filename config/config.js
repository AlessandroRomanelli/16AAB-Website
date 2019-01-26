const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';


const config = {
  development: {
    root: rootPath,
    app: {
      name: '16aab',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/16aab-development',
    salt: 10,
  },

  test: {
    root: rootPath,
    app: {
      name: '16aab',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/16aab-test',
    salt: 10,
  },

  production: {
    root: rootPath,
    app: {
      name: '16aab',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/16aab-production',
    salt: 10,
  },
};

module.exports = config[env];
