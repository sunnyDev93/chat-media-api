import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import * as fs from "fs";
import axios from "axios";
import User from "../models/user";
import {getAudioDurationPromise, reduceToken} from "../utils/reduceToken";

const upload = async (req : Request, res : Response) => {
    try {
        console.log("uid", req.body.uid);
        const uid = req.body.uid;
        const user = await User.findOne({uid: uid});

        if (req.file === undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }

        const filePath = `./public/data/uploads/` + req.file.originalname;
        const fileName = req.file.originalname;
        // Get the audio duration
        getAudioDurationPromise(fileName).then((duration) => { // Call reduceToken first
            return reduceToken(duration, uid);
        }).then((isTokenReduced) => { // Check if isTokenReduced is true before proceeding
            if (isTokenReduced) { // If reduceToken is true, proceed to transcribe and other actions
                return transcribe(filePath); // Assuming transcribe returns a Promise
            } else { // If reduceToken is false, return an error message
                throw new Error("Token reduction failed");
            }
        }).then((transcript) => { // You have the transcript, continue with the response
            if (req.file) {
                res.status(200).send({
                    fileName: req.file.originalname,
                    transcript: transcript,
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    token: user ?. token
                });
            }
        }).catch((error) => {
            console.error("Error:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        });
    } catch (err) {
        console.error("fileUploadControllerErr=> ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
};

// Your getDuration function remains the same

// Handle promise rejection and error here
// upload(req, res).catch((err) => {
//     console.error("Unhandled Promise Rejection: " + err);
// });

const transcribe = async (filePath : any) => {
    console.log("transcribe part");

    try {
        const apiKey = process.env.OPENAIAPI_KEY;
        console.log("apiKey", apiKey);


        // Create a readable stream from the file
        const file = fs.createReadStream(filePath);

        // Log request data for debugging
        // console.log('Request Data:', {
        //     file: filePath, // Log the file path or any other relevant request data
        //     model: 'whisper-1'
        // });

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', {
            file,
            model: 'whisper-1'
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${
                    apiKey
                }`
            }
        });
        return response.data.text;
    } catch (error) {
        console.error('Error:', error);
        // res.status(500).json({error: 'An error occurred'});
    }
};


const remove = async (req : Request, res : Response) => {

    const directoryPath = "./public/data/uploads/";
    const fileName = req.params.name;

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err
            });
        }

        res.status(200).send({message: "File is deleted."});
    });
}


/**
 * Calls the Speech-to-Text API on a demo audio file.
 */


const fileController = {
    upload,
    remove,
    transcribe
}

export default fileController;
