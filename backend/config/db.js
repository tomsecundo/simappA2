// config/db.js
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
mongoose.set('strictQuery', true);

class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect() {
        if (this.connection) {
            return this.connection;
        }

        try {
            this.connection = await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("MongoDB connected successfully");
            return this.connection;
        } catch (error) {
            console.error("MongoDB connection error:", error.message);
            process.exit(1);
        }
    }

    getConnection() {
        if (!this.connection) {
            throw new Error("Database not connected. Call connect() first.");
        }
        return this.connection;
    }
}

module.exports = new Database();
