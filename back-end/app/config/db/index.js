// Path: back-end/app/config/db/index.js
const mongoose = require('mongoose');
const uri = "mongodb+srv://lehoangkhang:sNiSws0rSOG4R1uQ@iamkhang.qzqm0qy.mongodb.net/blog?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

module.exports = connectDB;