// Import necessary modules
import express from 'express';
import * as dotenv from 'dotenv';
import { createError } from '../error.js';

import OpenAI from "openai";


const openai = new OpenAI();
// Configure dotenv to load environment variables from .env file
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
// Create an instance of express app
const app = express();

// Configure the app to parse JSON request bodies
app.use(express.json());

// Create a configuration object for the OpenAI API



// Define the route handler for generating an image
export const generateImage = async (req, res, next) => {
    try {
        req.headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`
        // Extract the prompt from the request body
        const { prompt } = req.body;
        console.log(prompt);
        // Call the OpenAI API to create an image
        const response = await openai.images.generate({ model: "dall-e-3", prompt: prompt,n: 1,size: "1024x1024",});
        console.log(response.data);
        
        if (response.data && response.data.length > 0 ) {
            // Send the generated image as a response
            return res.status(200).json({ response: response.data });
        } else {
            throw new Error("Failed to generate image. Response data format incorrect.");
        }
       
       
       
        // Send the generated image as a response

    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(
            createError(
                error.status,
                error?.response?.data?.error?.message || error?.message
            )
        );
    }
};

// Define the route for generating an image
// This should be done outside of the generateImage function
app.post('/api/generateImage', generateImage);

// Start the express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




