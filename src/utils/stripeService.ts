import Stripe from "stripe";
import {stripeSecretKey} from "../config";


const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-08-16', // Use the latest API version
});

export default stripe;
