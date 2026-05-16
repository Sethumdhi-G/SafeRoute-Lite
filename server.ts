import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { fileURLToPAth } from "url";

const __filename = fileURLToPath(import.meta.url);
comst __dirname = path.dirname(__filename);

//setting up express
async function startServer(){ 
  const app =express();
  const PORT = 3000;

//Initializing SQLite database
const db = new Database("saferoute.db");
db.exec(
  CREATE TABLE IF NOT EXISTS route_notes (
    id INTERGER PRIMARY KEY AUTOINCREMENTS,
    title TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    catagory TEXT NOT NULL,
    description TEXT,
    time_of_day TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
);

app.use(express.json()); //expect data to be in json format and automatically parse it 

//API Routes 
