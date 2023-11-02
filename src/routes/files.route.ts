import {Request, Response, Router} from 'express';
import multer from 'multer';
import fileController from '../controllers/file.controller';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/data/uploads/"); // Specify the directory to store uploads
    },
    filename: (req, file, cb) => { // const timestamp = Date.now();
        cb(null, file.originalname);
    }
});

let uploadFile = multer({
    storage: storage,
    // limits: { fileSize: maxSize },
});

// const upload = multer({ storage });

const filesRoute: Router = Router();

filesRoute.post("/upload", uploadFile.single("file"), fileController.upload);

filesRoute.delete("/:name", async (req : Request, res : Response) => {
    await fileController.remove(req, res);
})


export default filesRoute;
