import { useState } from "react";
import { Client } from "@gradio/client";
import { useToast } from "@/hooks/use-toast";

interface TryOnResult {
  image: string; // Base64 or URL
}

export function useVirtualTryOn() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const { toast } = useToast();

  const tryOn = async (personImage: File | string, garmentImage: File | string) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const client = await Client.connect("dmc98/VirtualTryOn_from_scratch");
      
      // Convert images to Blob objects
      let personBlob: Blob;
      let garmentBlob: Blob;
      
      // Handle person image
      if (personImage instanceof File) {
        personBlob = personImage;
      } else {
        const response = await fetch(personImage);
        personBlob = await response.blob();
      }
      
      // Handle garment image
      if (garmentImage instanceof File) {
        garmentBlob = garmentImage;
      } else {
        const response = await fetch(garmentImage);
        garmentBlob = await response.blob();
      }

      // Call the /process_images endpoint with Blob objects
      const result_data = await client.predict("/process_images", {
        person_img: personBlob,
        cloth_img: garmentBlob,
      });

      // Handle the response
      const data = (result_data as any).data || result_data;
      
      // Extract image URL from response
      let imageUrl = '';
      
      if (Array.isArray(data) && data.length > 0) {
        const resultItem = data[0];
        if (typeof resultItem === 'string') {
          imageUrl = resultItem;
        } else if (resultItem && typeof resultItem === 'object') {
          imageUrl = resultItem.url || resultItem.name || '';
        }
      } else if (typeof data === 'string') {
        imageUrl = data;
      } else if (data && typeof data === 'object') {
        imageUrl = data.url || data.name || '';
      }
      
      if (!imageUrl) {
        throw new Error("No image in response from API");
      }
      
      setResult({ image: imageUrl });
      toast({
        title: "Try-On Complete",
        description: "Your virtual look is ready!",
      });
    } catch (error) {
      console.error("Virtual Try-On Error:", error);
      toast({
        title: "Try-On Failed",
        description: error instanceof Error ? error.message : "Could not process the images. Please try again with different images.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { tryOn, isProcessing, result };
}
