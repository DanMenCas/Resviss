import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TryOnResult {
  image: string;
}

export function useVirtualTryOn() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const { toast } = useToast();

  const tryOn = async (personImage: File | string, garmentImage: File | string) => {
    setIsProcessing(true);
    setResult(null);

    try {
      // Convert images to Blobs using FormData
      const formData = new FormData();
      
      // Handle person image
      if (personImage instanceof File) {
        formData.append("personImage", personImage);
      } else {
        const response = await fetch(personImage);
        const blob = await response.blob();
        formData.append("personImage", blob, "person.jpg");
      }
      
      // Handle garment image
      if (garmentImage instanceof File) {
        formData.append("garmentImage", garmentImage);
      } else {
        const response = await fetch(garmentImage);
        const blob = await response.blob();
        formData.append("garmentImage", blob, "garment.jpg");
      }

      // Send to backend API
      const response = await fetch("/api/virtual-tryon", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process images");
      }

      const result_data = await response.json();

      if (!result_data.image) {
        throw new Error("No image in response from API");
      }

      setResult({ image: result_data.image });
      toast({
        title: "Try-On Complete",
        description: "Your virtual look is ready!",
      });
    } catch (error) {
      console.error("Virtual Try-On Error:", error);
      toast({
        title: "Try-On Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not process the images. Please try again with different images.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { tryOn, isProcessing, result };
}