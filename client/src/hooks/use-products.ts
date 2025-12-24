import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.products.list.path);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data = await res.json();
        console.log("Products data fetched:", data);
        return api.products.list.responses[200].parse(data);
      } catch (error) {
        console.error("Products fetch error:", error);
        throw error;
      }
    },
  });
}
