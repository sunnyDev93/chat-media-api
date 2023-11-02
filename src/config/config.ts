import {configDotenv} from 'dotenv';

configDotenv();

export const port = process.env.PORT;
export const mongoURI = process.env.MONGODB_URI || "mongodb+srv://maciej093:Jack%250903@cluster0.vez4rru.mongodb.net/chat-media";

export const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
export const deepgramApiKey = "0ac7231fddf155f31045b5dfd01a1b6da43aa1b5"
// config.ts
export const stripeSecretKey = 'sk_test_51NpHpxHJdllnV1b3Jy4dI1jPGYKq3nKmfjAAS2Ir39VNKAy0HJpRyCvSBUgAHiD6IbSEmSQhS4JchXqm4NihDKnR00UG878lHZ';
export const stripePublicKey = 'pk_test_51NpHpxHJdllnV1b3FFnbwAt5sT9IuN6GWO7FroVocK3VCKgBKiaO98Y4f6GcoFPGbRLAEIuAJpqDF0muwEAhThQr00ryUFe6SA';
export const webhookKey = 'whsec_15ae919e42abe3e23db05dccac7a3643a372d24328018a8f7cca5cca8e58d250';
