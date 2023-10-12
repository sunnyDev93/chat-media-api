// import {Request, Response} from "express";
// import {StatusCodes} from "http-status-codes";
// import User from "../models/user";
// import {getAudioDurationPromise, reduceToken} from "../utils/reduceToken";
// import {transcribe} from "./file.controller";

// const upload = async (req : Request, res : Response) => {
//     try {

//         console.log("uid", req.body.uid);
//         const uid = req.body.uid;

//         const user = await User.findOne({uid: uid});
//         if (req.file == undefined) {
//             return res.status(400).send({message: "Please upload a file!"});
//         }
//         const filePath = `./public/data/uploads/` + req.file.originalname;
//         getAudioDurationPromise(req.file.originalname).then((duration) => {
//             const isUser = await reduceToken(duration, uid);
//         }).catch((error) => {
//             console.error('Error:', error);
//         });

//         const transcript = await transcribe(filePath);

//         res.status(200).send({
//             fileName: req.file.originalname,
//             transcript: transcript,
//             message: "Uploaded the file successfully: " + req.file.originalname
//         });
//     } catch (err) {
//         console.log("fileUploadControllerErr=> ", err);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//     }
// };
