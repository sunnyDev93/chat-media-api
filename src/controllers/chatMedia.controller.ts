import axios from 'axios';
import {Request, Response} from 'express';


const chatBot = async (req : Request, res : Response) => {

    const {question} = req.body;
    const apiKey = process.env.OPENAIAPI_KEY;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Translate the following code: "${question}"`,
            max_tokens: 50
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const answer = response.data.choices[0].text;
        res.json({answer});

    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const chatMediaController = {
    chatBot
}

export default chatMediaController;
