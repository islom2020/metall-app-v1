"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGroups = () => {
  return useQuery({
    queryKey: ["GROUPS"],
    queryFn: async () => {
      const { data } = await axios.get("/api/groups");

      return data as any;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useGroups;
