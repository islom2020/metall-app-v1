"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetOrders = () => {
  return useQuery({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      return data.data as Order[];
    },
  });
};
