import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import path from 'path';
import * as fs from "fs";
import axios from "axios";
import User, {IUser} from "../models/user";
import {getAudioDurationPromise, reduceToken} from "../utils/reduceToken";
import {deepgramApiKey} from "../config";
import {Deepgram} from "@deepgram/sdk";
import FormData from "form-data";


const upload = async (req : Request, res : Response) => {
    try {
        const uid = req.body.uid;
        const lang = req.body.lang;
        const user = await User.findOne({uid: uid});

        if (req.file === undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }


        const fileName = req.file.originalname;
        // Get the audio duration
        getAudioDurationPromise(fileName).then((duration) => { // Call reduceToken first
            return reduceToken(duration, uid);
        }).then((isTokenReduced) => { // Check if isTokenReduced is true before proceeding
            if (isTokenReduced) { // If reduceToken is true, proceed to transcribe and other actions
                return transcribe(fileName, user, lang); // Assuming transcribe returns a Promise
            } else { // If reduceToken is false, return an error message
                throw new Error("Token reduction failed");
            }
        }).then((transcript) => { // You have the transcript, continue with the response
            if (transcript) {
                if (req.file) {
                    res.status(200).send({
                        fileName: req.file.originalname,
                        transcript: transcript,
                        message: "Uploaded the file successfully: " + req.file.originalname,
                        token: user ?. token
                    });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
                }
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
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

const transcribe = async (fileName : any, user : IUser | null, lang : any) => {
    console.log(user);

    if (user ?. plan === "advanced" || user ?. plan === "pro" || user ?. plan === "Avanzato") 
        try {
            const apiKey = deepgramApiKey;
            const filePath = path.join(__dirname, '../../public/data/uploads', fileName);

            const mimetype = "audio/*";
            const audioFileBuffer = fs.readFileSync(filePath);
            const audioBase64 = audioFileBuffer.toString('base64');
            const deepgram = new Deepgram(apiKey);
            const formData = new FormData();

            const file = fs.createReadStream(filePath);
            formData.append('audio', fs.createReadStream(filePath));
            const url = 'https://api.deepgram.com/v1/listen?detect_language=true&punctuate=true';
            // const headers = { // 'Authorization': `Token ${apiKey}`,
            // "Content-Type": "multipart/form-data"
            // };

            // axios.defaults.headers.common['Authorization'] = `Token ${apiKey}`;
            // axios.defaults.headers.common['Content-Type'] = "audio/*";

            const response = await axios.post(url, audioFileBuffer, {
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'audio/mp3'
                }
            });
            if (response.data) {

                const transcript = response.data.results.channels[0].alternatives[0].transcript;
                console.log("transcript", transcript);
                return transcript
            } else 
                return "none"


            


            // fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         ... formData.getHeaders(),
            //         ... headers
            //     },
            //     body: formData
            // }).then((response : {
            //     json: () => any;
            // }) => response.json()).then((data : any) => {
            //     console.log("dfdfd", data);
            // }).catch((error : any) => {
            //     console.error(error);
            // });
            // let source: {
            //     url?: string;
            //     buffer: Buffer;
            //     mimetype: string;
            //     language: any;
            // };

            // // Set the source
            // source = {
            //     buffer: fs.readFileSync(filePath),
            //     mimetype: mimetype,
            //     language: "it-IT"
            // };

            // const response = await deepgram.transcription.preRecorded(source, {
            //     smart_format: true,
            //     model: "nova"
            // });

            // if (response.results ?. channels[0] ?. alternatives[0] ?. transcript) {
            //     const transcript = response.results.channels[0].alternatives[0].transcript;
            //     console.log(transcript);
            //     return transcript;
            // } else {
            //     throw new Error("Transcription failed");
            // }
        }
     catch (error) {
        console.error('Error:', error);
        // Handle the error appropriately
    } else {
        try {
            const apiKey = process.env.OPENAIAPI_KEY;
            console.log("apiKey", apiKey);

            const filePath = `./public/data/uploads/` + fileName;
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
} /**
 * Calls the Speech-to-Text API on a demo audio file.
 */
const fileController = {
    upload,
    remove,
    transcribe
}
export default fileController;
