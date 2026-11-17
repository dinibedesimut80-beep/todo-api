const mongoose = require("mongoose");
const dns = require("dns");

// Paksa Node.js menggunakan Google DNS untuk resolving SRV record MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
  try {
    // Sesuaikan variabel env (di kodinganmu process.env.MONGODB, pastikan di .env namanya sama)
    const uri = process.env.MONGODB || "mongodb+srv://dinibedesimut80_db_user:dini0000@gamelab-mongodb.drzfutd.mongodb.net/?appName=gamelab-mongodb";

    if (!uri) {
      throw new Error("MONGODB connection string is not defined in .env file");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // Timeout ditingkatkan jadi 15 detik
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;