const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": "reactjs",
    "database": process.env.DB_PASSWORD,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": "reactjs",
    "database": process.env.DB_PASSWORD,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": "reactjs",
    "database": process.env.DB_PASSWORD,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
