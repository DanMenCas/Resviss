import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // process.cwd() starts at the root of your project
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const localPath = path.resolve(process.cwd(), "public");

  // Determine which path to use
  const finalPath = fs.existsSync(distPath) ? distPath : localPath;

  console.log(`[Static] Serving files from: ${finalPath}`);

  app.use(express.static(finalPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    const indexPath = path.resolve(finalPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please run build script.");
    }
  });
}