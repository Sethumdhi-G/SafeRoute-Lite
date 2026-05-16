import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setting up express
async function startServer(){ 
  const app =express();
  const PORT = 3000;

//Initializing SQLite database
const db = new Database("saferoute.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS route_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    time_of_day TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

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
    const { title, latitude, longitude, category, description,time_of_day } = req.body;

    if(!title || !latitude || !longitude ||!category){
      return res.status(400).json({ error: "Missing required fields" });
    }

    try{
      const stmt = db.prepare(`
        INSERT INTO route_notes (title, latitude, longitude, category, description, time_of_day)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title, latitude, longitude, category, description || "", time_of_day || "");
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save note" });
    }
  });

  //Using Vite only for development
  if (process.env.NODE_ENV !== "production"){
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  else{
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

}
//if error during startup
  startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

      
    
  
  
