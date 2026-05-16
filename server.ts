import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { fileURLToPAth } from "url";

const __filename = fileURLToPath(import.meta.url);
comst __dirname = path.dirname(__filename);
