import {Request, Response, Router} from 'express';
import multer from 'multer';
import fileController from '../controllers/file.controller';
import excelController from '../controllers/excel.controller';
import csvController from "../controllers/csv.controller";
import {verifyToken} from '../middlewares/auth.middleware';

// const maxSize = 20 * 1024 * 1024;

// let storage = multer.diskStorage({
// destination: (req, file, cb) => {
//     cb(null, "./public/data/uploads/");
// },
// filename: (req, file, cb) => {
//     cb(null, file.originalname);
// },
// });

// let uploadFile = multer({
// storage: storage,
// // limits: { fileSize: maxSize },
// }).single("file");

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

filesRoute.post("/csv", csvController.exportCsvFile);

filesRoute.post("/excel", excelController.exportExcelFile);

filesRoute.delete("/:name", async (req : Request, res : Response) => {
    await fileController.remove(req, res);
})


export default filesRoute;
