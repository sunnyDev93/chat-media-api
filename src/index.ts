import express from 'express';
import mongoose from 'mongoose';

import {json, urlencoded} from 'body-parser';
import cors from 'cors';

import {mongoURI, port} from "./config";
import router from "./routes";

mongoose.connect(mongoURI).then(() => console.log("Mongoose connected successfully")).catch((err) => {
    console.log("mongooseErr=> ", err);
})

const app = express();
app.use(json());
app.use(urlencoded({extended: true}));
app.use(cors())

const routes = router;

app.use("/api", routes);

app.use(express.static('public'));


const server = app.listen(port, () => {
    console.log(`server is listening on port:${port}`)
});

export default server;
