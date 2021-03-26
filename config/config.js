require('dotenv').config(); // this is important!

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "waysfood_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": process.env.DATABASE_URL,
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": true
    }
  }
};
