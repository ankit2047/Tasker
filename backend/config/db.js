
// Handles MongoDB Atlas connection using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect uses the MONGODB_URI from environment variables
    // MongoDB Atlas connection string format:
    // mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
