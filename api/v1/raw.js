import express from "express";
import path from "path";
import { DATA_DIR } from "../../config/constants.js";

const router = express.Router();

router.get('/raw', async(req, res) => {

    const filePath = path.join(process.cwd(), DATA_DIR, 'actions.json');
  
    // Directly stream the file contents over HTTP
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: "File not found" });
    });
})

export default router;