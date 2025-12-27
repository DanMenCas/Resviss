import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { Client } from "@gradio/client";
import multer from "multer";
import 'dotenv/config';

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.team.list.path, async (req, res) => {
    const team = await storage.getTeamMembers();
    res.json(team);
  });

  app.post(
    "/api/virtual-tryon",
    upload.fields([
      { name: "personImage", maxCount: 1 },
      { name: "garmentImage", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (!files.personImage || !files.garmentImage) {
          return res.status(400).json({ error: "Missing image data" });
        }

        const personBuffer = files.personImage[0].buffer;
        const garmentBuffer = files.garmentImage[0].buffer;

        console.log(
          "[Virtual Try-On] Processing images, buffer sizes:",
          personBuffer.length,
          garmentBuffer.length
        );

        // Convert buffers to Blobs
        const personBlob = new Blob([personBuffer], {
          type: "image/jpeg",
        });
        const garmentBlob = new Blob([garmentBuffer], {
          type: "image/jpeg",
        });

        console.log("[Virtual Try-On] Connecting to Hugging Face...");
        // Connect to Hugging Face Gradio client with token
        const client = await Client.connect(
          "dmc98/VirtualTryOn_from_scratch",
          {
            token: process.env.HUGGINGFACE_TOKEN as `hf_${string}`,
          }
        );

        console.log("[Virtual Try-On] Connected. Calling /process_images...");
        // Call the /process_images endpoint with Blob objects
        const result = await client.predict("/process_images", {
          person_img: personBlob,
          cloth_img: garmentBlob,
        });

        console.log("[Virtual Try-On] Response received:", result);

        // Extract image from response
        const data = (result as any).data || result;
        let imageUrl = "";

        if (Array.isArray(data) && data.length > 0) {
          const resultItem = data[0];
          if (typeof resultItem === "string") {
            imageUrl = resultItem;
          } else if (resultItem && typeof resultItem === "object") {
            imageUrl = resultItem.url || resultItem.name || "";
          }
        } else if (typeof data === "string") {
          imageUrl = data;
        } else if (data && typeof data === "object") {
          imageUrl = data.url || data.name || "";
        }

        if (!imageUrl) {
          console.error("[Virtual Try-On] No image in response:", data);
          return res.status(500).json({ error: "No image in response" });
        }

        console.log("[Virtual Try-On] Success! Image URL:", imageUrl);
        res.json({ image: imageUrl });
      } catch (error) {
        console.error("[Virtual Try-On] Error:", error);
        res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Failed to process images",
        });
      }
    }
  );

  return httpServer;
}