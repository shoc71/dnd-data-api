import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import JSZip from "jszip";

import v1RouterRaw from './api/v1/raw.js' 
import { PORT, DATA_DIR } from "./config/constants.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// TODO ss - checksum for json-data files and display the latest one
// TODO ss - request to client to make sure they have the latest version

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // this

const API_FILEPATH = DATA_DIR;

// send raw file
app.use(API_FILEPATH, v1RouterRaw);

// send edited file
app.get(API_FILEPATH + '/edited', async(req, res) => {
    try {
        // // Construct the absolute path
        const filePath = path.join(__dirname, DATA_DIR, 'actions.json');

        // Read the raw file content
        const rawData = await fs.readFile(filePath, 'utf-8');

        // Parse JSON string to JS obj
        const jsonData = JSON.parse(rawData)

        res.json(jsonData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: "JSON file not found" });
        }
        res.status(500).json({ error: "Failed to read file" });
    }
});

app.get(API_FILEPATH + '/zip', async (req, res) => {
  try {
    const dataDir = path.join(__dirname, DATA_DIR);

    // Read target JSON files
    const booksData = await fs.readFile(path.join(dataDir, 'books.json'), 'utf-8');
    const decksData = await fs.readFile(path.join(dataDir, 'decks.json'), 'utf-8');

    // Create zip instance & add files
    const zip = new JSZip();
    zip.file('books.json', booksData);
    zip.file('decks.json', decksData);

    // Generate zip buffer
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Send buffer as zip file download
    res.setHeader('Content-Type', 'application/zip');
    res.attachment('data-bundle.zip');
    res.send(buffer);

  } catch (error) {
    console.error("Zip generation error:", error);
    res.status(500).json({ error: "Failed to create zip file" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})