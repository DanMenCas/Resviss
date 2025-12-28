import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
// --- YOU MUST ADD THIS SPECIFIC IMPORT ---
import { fileURLToPath } from "url";

// --- NOW DEFINE THESE GLOBALS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  // On Vercel, files are usually one level up from /server in /dist/public
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  // Safety check: if dist/public doesn't exist, try local public
  const finalPath = fs.existsSync(distPath) ? distPath : path.resolve(__dirname, "public");

  app.use(express.static(finalPath));

  // This ensures React routing works on refresh
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.resolve(finalPath, "index.html"));
  });
}