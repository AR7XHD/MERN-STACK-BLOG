import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGO_URL environment variable inside .env'
    );
}

// Connection config
const connection = {};

/**
 * Creates a new database connection if one doesn't exist,
 * or returns the existing connection if it's already established.
 */
async function dbConnect() {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        // Connect to MongoDB
        const db = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds
        });

        connection.isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default dbConnect;
