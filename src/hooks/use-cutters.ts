"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCutters = () => {
  return useQuery({
    queryKey: ["CUTTERS"],
    queryFn: async () => {
      const { data } = await axios.get("/api/cutters");

      return data as any;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useCutters;
