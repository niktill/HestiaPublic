// Script to clear all collections in local mongodb database
const keys = require('../config/keys.js');
async function clearDatabase() {
  const mongoose = require('mongoose');
  try {
    const conn = mongoose.createConnection(keys.mongoURI);
    await conn.dropDatabase();
    conn.close();
  } catch (error) {
    console.log(error);
  }
}

clearDatabase();
