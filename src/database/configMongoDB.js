const mongoose = require('mongoose');

const DATABASE_MONGO_ATLAS = process.env.DATABASE_MONGO_ATLAS;
const DATABASE_SERVER = process.env.DATABASE_SERVER;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME_DB = process.env.DATABASE_NAME_DB;

const userDB = DATABASE_USERNAME !== '' ? `${DATABASE_USERNAME}:${DATABASE_PASSWORD}@` : ''
const path_db = DATABASE_MONGO_ATLAS !== '' ? DATABASE_MONGO_ATLAS : `mongodb://${userDB}${DATABASE_SERVER}:${DATABASE_PORT}/${DATABASE_NAME_DB}`;

const connectDB = async () => {
  try {
    await mongoose.connect(path_db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connection database success!');
  } catch (error) {
    throw new Error('Error to connect database');
  }
}

module.exports = {
  connectDB
};
