"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useNames = () => {
  return useQuery({
    queryKey: ["NAMES"],
    queryFn: async () => {
      const { data } = await axios.get("/api/names");

      return data as any;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useNames;
