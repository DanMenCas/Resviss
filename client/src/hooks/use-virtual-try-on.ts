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

  const tryOn = async (personImage: File, garmentImage: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const client = await Client.connect("dmc98/VirtualTryOn_from_scratch");
      
      // Convert Files to Blobs/Buffers as expected by Gradio client
      const personBlob = await fetch(URL.createObjectURL(personImage)).then(r => r.blob());
      const garmentBlob = await fetch(URL.createObjectURL(garmentImage)).then(r => r.blob());

      const prediction = await client.predict("/predict", { 
        param_0: personBlob, 
        param_1: garmentBlob 
      });

      // Gradio responses can vary, usually it returns an array of data
      // Checking structure dynamically for robustness
      const data = (prediction as any).data;
      if (Array.isArray(data) && data.length > 0) {
        // Assuming first element is the result image (often a URL or object with url)
        const resultItem = data[0];
        const imageUrl = typeof resultItem === 'object' && resultItem.url ? resultItem.url : resultItem;
        
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
        description: "Could not process the images. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { tryOn, isProcessing, result };
}
