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
app.get("/api/notes", (req, res) => {
  try {
      const notes = db.prepare("SELECT * FROM route_notes ORDER BY created_at DESC").all(); 
      res.json(notes);
      } 
  catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", (req, res) => {
    const { title, latitude, longitude, catagory, description,time_of_day } = req.body;

    if(!title || !latitude || !longitude ||!catagory){
      return res.status(400).json({ error: "Missing required fields" });
    }

    try{
      const stmt = db.prepare(
        'INSERT INTO route_notes (title, latitude, longitude, category, description, time_of_day)
        VALUES (?, ?, ?, ?, ?, ?)'
      );
      const info = stmt.run(title, latitude, longitude, category, description || "", time_of_day || "");
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save note" });
    }
  });

  
      
    
  
  
