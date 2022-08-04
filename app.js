const express = require('express');
const config = require('config');
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/auth', require('./routes/auth'));

async function start () {
  try{
  console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`)
   await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`);
    app.listen(PORT, ()=>console.log(`App has been started at ${PORT}`));
  } catch (e){
    console.log(`Server error: ${e.message}`);
    process.exit(1);
  }
}

start();

