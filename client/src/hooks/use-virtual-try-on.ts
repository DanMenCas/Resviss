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
      
      // Handle both File objects and string URLs
      let personInput = personImage;
      let garmentInput = garmentImage;
      
      if (personImage instanceof File) {
        personInput = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(personImage);
        });
      }
      
      if (garmentImage instanceof File) {
        garmentInput = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(garmentImage);
        });
      }

      // Use the correct Gradio API endpoint - function index 0
      const result_data = await client.predict(0, [personInput, garmentInput]);

      // Handle the response - Gradio returns data array
      const data = (result_data as any).data || result_data;
      if (Array.isArray(data) && data.length > 0) {
        const resultItem = data[0];
        // Handle different response formats
        let imageUrl = '';
        if (typeof resultItem === 'string') {
          imageUrl = resultItem;
        } else if (resultItem && typeof resultItem === 'object' && resultItem.url) {
          imageUrl = resultItem.url;
        } else if (resultItem && typeof resultItem === 'object' && resultItem.name) {
          imageUrl = resultItem.name;
        }
        
        if (!imageUrl) {
          throw new Error("No image URL in response");
        }
        
        setResult({ image: imageUrl });
        toast({
          title: "Try-On Complete",
          description: "Your virtual look is ready!",
        });
      } else {
        throw new Error("Unexpected response format");
      }
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
