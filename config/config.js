require('dotenv').config(); // this is important!

module.exports = {
  "development": {
    "username": process.env.DEV_USERNAME,
    "password": process.env.DEV_PASSWORD,
    "database": process.env.DEV_DATABASE,
    "host":     process.env.DEV_HOST,
    "dialect":  process.env.DEV_DIALECT,
    "protocol": process.env.PROTOCOL,
    "ssl":      process.env.SSL,
    "keepDefaultTimezone": process.env.KEEPDEFAULTTIMEZONE,
    "logging": (process.env.DEV_LOGGING == "1" ? true : false)
  },
  "test": {
    "username": process.env.TEST_USERNAME,
    "password": process.env.TEST_PASSWORD,
    "database": process.env.TEST_DATABASE,
    "host":     process.env.TEST_HOST,
    "dialect":  process.env.TEST_DIALECT,
    "protocol": process.env.PROTOCOL,
    "ssl":      process.env.SSL,
    "keepDefaultTimezone": process.env.KEEPDEFAULTTIMEZONE,
    "logging": (process.env.TEST_LOGGING == "1" ? true : false)
  },
  "production": {
    "username": process.env.PRO_USERNAME,
    "password": process.env.PRO_PASSWORD,
    "database": process.env.PRO_DATABASE,
    "host":     process.env.PRO_HOST,
    "dialect":  process.env.PRO_DIALECT,
    "protocol": process.env.PROTOCOL,
    "ssl":      process.env.SSL,
    "keepDefaultTimezone": process.env.KEEPDEFAULTTIMEZONE,
    "logging": (process.env.PRO_LOGGING == "1" ? true : false)
  }
};