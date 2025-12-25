import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTeam() {
  return useQuery({
    queryKey: [api.team.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.team.list.path);
        if (!res.ok) throw new Error(`Failed to fetch team members: ${res.status}`);
        const data = await res.json();
        console.log("Team data fetched:", data);
        return api.team.list.responses[200].parse(data);
      } catch (error) {
        console.error("Team fetch error:", error);
        throw error;
      }
    },
  });
}
