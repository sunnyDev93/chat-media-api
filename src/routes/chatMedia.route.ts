import { Router } from "express";

import chatMediaController from "../controllers/chatMedia.controller";


const chatMediaRoute: Router = Router();

chatMediaRoute.post("/chatbot", chatMediaController.chatBot);



export default chatMediaRoute;