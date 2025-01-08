import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHECK_NUMBER_ID, COMMENT_PRO_ID } from "@/lib/env";
import { useGetOrders } from "@/hooks/use-get-orders";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "./custom-select/custom-select";
import { onConfirm } from "@/modules/confirm/confirm";
import { NumberParam, useQueryParam } from "use-query-params";
import { useCutters, useGroups, useNames } from "@/hooks";
import { Dialog, ErrorPopup, InputPopup, SuccessPopup } from "./popup";

interface ListItemProps {
  order: Order;
  data: Order[];
}

type Comments = {
  [key: string]: string;
};

export interface ToastMessage {
  input: boolean;
  error: boolean;
  success: boolean;
  open: boolean;
  disabled: boolean;
}

const ListItem = ({ order, data }: ListItemProps) => {
  const [selectedProducts, setSelectedProducts] = useState<any>(
    order.products
      .filter((item) => item.quantity === item.shipped)
      .map((item) => item.id)
  );

  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    input: false,
    error: false,
    success: false,
    open: false,
    disabled: false,
  });
  const [warehouse, setWarehouse] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [query, setQuery] = useQueryParam("id", NumberParam);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
  const { refetch } = useGetOrders();
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [errors, setErrors] = useState({
    name: false,
    group: false,
    cutters: false,
  });
  const { data: names } = useNames();
  const { data: groups } = useGroups();
  const { data: cutters } = useCutters();
  const { data: warehousesData, isLoading: warehousesLoading } = useQuery({
    queryKey: ["WAREHOUSES"],
    queryFn: async () => {
      const res = await axios.get("/api/warehouses");
      return res.data;
    },
  });
  const [comments, setComments] = useState<Comments>({});

  const [collection, setCollection] = useState<any>({
    name: "",
    group: "",
    cutters: "",
  });

  const checkNumber = order.attributes.filter(
    (item: Attributes) => item.id === CHECK_NUMBER_ID
  )[0]?.value;
  const commentPro = order.attributes.filter(
    (item: Attributes) => item.id === COMMENT_PRO_ID
  )[0]?.value;

  useEffect(() => {
    const name = order.attributes.filter(
      (item: any) => item.id === "bf6c8db4-4807-11ef-0a80-037f00392b45"
    )[0]?.value?.name;
    const name2 = order.attributes.filter(
      (item: any) => item.id === "cc481563-4807-11ef-0a80-0bea00359633"
    )[0]?.value?.name;

    setCollection({
      name: names?.rows?.filter((item: any) => item.name === name)[0]?.id,
      group: groups?.rows?.filter((item: any) => item.name === name2)[0]?.id,
    });
    // setEntityId(names?.rows?.filter((item: any) => item.name === name)[0]?.id);
    // setEntityId2(
    //   groups?.rows?.filter((item: any) => item.name === name2)[0]?.id
    // );
  }, [names, order, groups]);

  useEffect(() => {
    if (warehousesData) {
      const warehouses: any = warehousesData?.rows?.filter(
        (item: any) => item?.meta.href === order.store.meta.href
      );

      setWarehouse(warehouses[0]?.name);
    }
  }, [warehousesLoading]);

  function oneWeekAway() {
    const now = new Date();
    const inOneWeek = now.setDate(now.getDate() + 7);
    return new Date(inOneWeek);
  }

  const handleOpenModal = (orderId: string) => {
    const { name, group, cutters } = collection;
    console.log("id ====", collection);
    // const newErrors = {
    //   name: !name || name === "0",
    //   group: !group || group === "0",
    //   cutters: !cutters || cutters === "0",
    // };
    // if (
    //   !name ||
    //   !group ||
    //   name === "0" ||
    //   group === "0" ||
    //   !cutters ||
    //   cutters === "0"
    // ) {
    //   setToastMessage({ ...toastMessage, input: false });
    //   window.clearTimeout(timerRef.current);
    //   timerRef.current = window.setTimeout(() => {
    //     eventDateRef.current = oneWeekAway();

    //     setToastMessage({ ...toastMessage, input: true });
    //   }, 100);
    //   setErrors(newErrors);
    // } else if (name && group && cutters) {
    //   setCurrentOrderId(orderId);
    //   setToastMessage({ ...toastMessage, open: true });
    //   refetch();
    //   setErrors({
    //     name: false,
    //     group: false,
    //     cutters: false,
    //   });
    // }
  };

  const formattedDate = format(new Date(order.moment), "dd.MM.yyyy");
  const toggleId = (id: string) => {
    setSelectedProducts((prev: string[]) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      id={checkNumber}
      className="my-5 rounded-md border border-primary p-y overflow-hidden"
    >
      <Dialog
        disabled={toastMessage.disabled}
        open={toastMessage.open}
        setOpen={() =>
          setToastMessage({ ...toastMessage, open: !toastMessage.open })
        }
        onConfirm={() =>
          onConfirm({
            data,
            names,
            groups,
            cutters,
            currentOrderId,
            collection,
            comments,
            order,
            selectedProducts,
            toastMessage,
            setToastMessage,
          })
        }
      />
      <InputPopup
        open={toastMessage.input}
        onOpen={() =>
          setToastMessage({ ...toastMessage, input: !toastMessage.input })
        }
      />
      <ErrorPopup
        open={toastMessage.error}
        onOpen={() =>
          setToastMessage({ ...toastMessage, error: !toastMessage.error })
        }
      />
      <SuccessPopup
        open={toastMessage.success}
        onOpen={() =>
          setToastMessage({ ...toastMessage, success: !toastMessage.success })
        }
      />

      <div className="flex flex-col w-full mb-5">
        {checkNumber && (
          <button
            onClick={() => setQuery(checkNumber)}
            className="px-5 py-2 text-center text-2xl bg-primary transition-all hover:bg-primary/90 text-white"
          >
            {checkNumber}
          </button>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs capitalize">{order.agent_name}</h4>
            {warehouse && <p className="text-xs ml-auto">{warehouse}</p>}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs">{order.code}</p>
            <p className="text-xs">{formattedDate}</p>
          </div>
        </div>
        <div className="w-full flex gap-5 md:flex-row flex-col">
          <div className="w-full px-5 flex gap-5">
            <CustomSelect
              value={collection.name}
              onValueChange={(value) =>
                setCollection({ ...collection, name: value })
              }
              error={errors.name}
              data={names}
              label="Кто отгрузил"
            />
            <CustomSelect
              value={collection.group}
              onValueChange={(value) =>
                setCollection({ ...collection, group: value })
              }
              error={errors.group}
              data={groups}
              label="Бригада"
            />
          </div>
          <div className="w-full px-5">
            <CustomSelect
              value={collection.cutters}
              onValueChange={(value) =>
                setCollection({ ...collection, cutters: value })
              }
              error={errors.cutters}
              data={cutters}
              label="Kim kesdi"
            />
          </div>
        </div>
      </div>

      <div>
        <Table className="rounded-xl border-zinc-100">
          <TableHeader>
            <TableRow className="border-t  font-bold">
              <TableHead className="w-1/2">Tovar Nomi</TableHead>
              <TableHead>Soni</TableHead>
              <TableHead>Yuklandi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span>{product.quantity}</span>
                </TableCell>
                <TableCell>
                  <Checkbox
                    className="block mx-auto"
                    // @ts-ignore
                    defaultValue={
                      product.quantity === product.shipped &&
                      selectedProducts.includes(product.id)
                    }
                    checked={selectedProducts.includes(product.id)}
                    onClick={() => toggleId(product.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {commentPro && (
              <TableRow>
                <TableCell className="text-xs pt-5" colSpan={3}>
                  {commentPro.split("\n").map((item: string) => (
                    <p key={item}>{item}</p>
                  ))}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3}>
                <textarea
                  value={
                    comments[order.id] !== undefined
                      ? comments[order.id]
                      : order.description
                      ? order.description
                      : ""
                  }
                  className="w-full p-2 resize-none bg-secondary rounded"
                  placeholder="Comment"
                  onChange={(e) => {
                    if (!order.description) {
                      setComments({
                        ...comments,
                        [order.id]: e.target.value,
                      });
                    } else {
                      setComments({
                        ...comments,
                        [order.id]: e.target.value,
                      });
                    }
                  }}
                ></textarea>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                <Button
                  size="sm"
                  className="w-full"
                  style={{ background: "#FF4B68", color: "white" }}
                  onClick={() => handleOpenModal(order.id)}
                >
                  Yuborish
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ListItem;
