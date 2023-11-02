import {Request, Response, Router} from "express";
import priceController from './../controllers/price.controller';
import {verifyToken} from "../middlewares/auth.middleware";


const priceRoute: Router = Router();

priceRoute.post("/update", priceController.updatePlanPrice);
priceRoute.post("/delete", priceController.deletePlan);
priceRoute.post("/create", priceController.createPlan);
priceRoute.get("/all", priceController.fetchPrices);
priceRoute.get("/prices", priceController.fetchPrices);


export default priceRoute;
