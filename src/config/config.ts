import { configDotenv } from 'dotenv';

configDotenv();

export const port = process.env.PORT;
export const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db";

export const secretKey = process.env.SECRET_KEY || "SECRET_KEY";