import {Router} from "express";
import express from 'express';

import checkoutController from "../controllers/checkout.controller";
import {verifyToken} from "../middlewares/auth.middleware";


const checkoutRoute: Router = Router();

checkoutRoute.post("/create-checkout-session", verifyToken, checkoutController.createCheckoutSession);
checkoutRoute.post("/create-portal-session", checkoutController.createPortalSession);
checkoutRoute.post("/webhook", express.raw({type: 'application/json'}), checkoutController.webhook);


export default checkoutRoute;
