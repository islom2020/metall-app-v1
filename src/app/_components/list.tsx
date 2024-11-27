"use client";

import { useGetOrders } from "@/hooks/use-get-orders";
import { useGetOrdersWithDemand } from "@/hooks/use-get-orders-with-demand";
import { TableDemo } from "./table";
import Image from "next/image";
import { StringParam, useQueryParams, withDefault } from "use-query-params";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const List = () => {
  const [filterData, setFilterData] = useState<Order[]>();
  const { data, isLoading } = useGetOrders();
  const [query] = useQueryParams({
    name: withDefault(StringParam, "all", true),
    warehouse: withDefault(StringParam, "all", true),
  });
  const client = useQueryClient();

  const { data: ordersWithDemand, isLoading: ordersWithDemandLoading } =
    useGetOrdersWithDemand();

  useEffect(() => {
    const warehouses: any = client.getQueryData(["WAREHOUSES"]);
    const warehousesData = warehouses?.rows.filter(
      (item: any) => item.name === query.warehouse
    );

    if (query.name === "all" && query.warehouse === "all") {
      setFilterData(data);
      return;
    }
    if (data) {
      let filterName: any = [];
      let filterName2: any = [];
      if (query.name !== "all") {
        data.forEach((order) => {
          order.attributes.forEach((item: any) => {
            if (item.id === "bf6c8db4-4807-11ef-0a80-037f00392b45") {
              filterName.push(order);
            }
          });
        });
        filterName?.forEach((order: any) => {
          order.attributes.forEach((item: any) => {
            if (item.value.name === query.name) {
              filterName2.push(order);
            }
          });
        });
      } else {
        filterName2 = data;
      }

      if (query.warehouse !== "all") {
        filterName2 = filterName2?.filter(
          (item: any) => item?.store.meta.href === warehousesData[0]?.meta.href
        );
      }
      setFilterData(filterName2);
    }
  }, [query, isLoading]);

  if (isLoading || ordersWithDemandLoading)
    return <div className='loader'></div>;

  return (
    <div className='container'>
      <div className='mt-5'>
        {filterData && filterData?.length > 0 ? (
          <TableDemo
            data={filterData!.sort((a, b) => Number(a.code) - Number(b.code))}
            ordersWithDemands={ordersWithDemand}
          />
        ) : (
          <div className='flex flex-col items-center justify-center mt-10'>
            <Image
              src={"/not-found.png"}
              width={100}
              height={100}
              alt='Data not found'
            />
            <p className='text-lg text-white'>Data Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
