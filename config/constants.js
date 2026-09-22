import dotenv from "dotenv";
dotenv.config();

export const DATA_DIR = process.env.DATA_FOLDER;
export const PORT = process.env.PORT;