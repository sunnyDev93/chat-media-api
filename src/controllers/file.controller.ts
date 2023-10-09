import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import * as fs from "fs";
import axios from "axios";

const upload = async (req : Request, res : Response) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }
        const filePath = `./public/data/uploads/` + req.file.originalname
        const transcript = await transcribe(filePath);
        res.status(200).send({
            fileName: req.file.originalname,
            transcript: transcript,
            message: "Uploaded the file successfully: " + req.file.originalname
        });
    } catch (err) {
        console.log("fileUploadControllerErr=> ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }


}

const transcribe = async (filePath : any) => {
    console.log("transcribe part");

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        // const apiKey = "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";


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
