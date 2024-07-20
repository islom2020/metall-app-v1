/* eslint-disable @next/next/no-img-element */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useGetCustomEntity} from "@/hooks/use-get-custom-entity";
import {useGetCustomEntity2} from "@/hooks/use-get-custom-entity-2";
import {AlertDialogCancel} from "@radix-ui/react-alert-dialog";
import axios from "axios";
import React, {useEffect} from "react";

interface TableProps {
  data: Order[];
  ordersWithDemands: {[key: string]: Array<string>};
}

type Comments = {
  [key: string]: string;
};

export const TableDemo: React.FC<TableProps> = ({data, ordersWithDemands}) => {
  const {data: customEntityData, isLoading} = useGetCustomEntity();
  const {data: customEntityData2, isLoading: isLoading2} =
    useGetCustomEntity2();

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [currentOrderId, setCurrentOrderId] = React.useState("");

  const [entityId, setEntityId] = React.useState("");
  const [entityId2, setEntityId2] = React.useState("");
  const [comments, setComments] = React.useState<Comments>({});

  const [selectedProducts, setSelectedProducts] = React.useState<{
    [key: string]: string[];
  }>(
    localStorage.getItem("selectedProducts")
      ? JSON.parse(localStorage.getItem("selectedProducts") || "{}")
      : {}
  );

  const handleSelect = (orderId: string, productId: string) => {
    if (selectedProducts[orderId]?.includes(productId)) {
      setSelectedProducts({
        ...selectedProducts,
        [orderId]: selectedProducts[orderId].filter(
          (product) => product !== productId
        ),
      });
    } else {
      const newSelectedProducts = {
        ...selectedProducts,
        [orderId]: selectedProducts[orderId]
          ? [...selectedProducts[orderId], productId]
          : [productId],
      };
      setSelectedProducts(newSelectedProducts);
    }
  };

  useEffect(() => {
    if (ordersWithDemands) mergeDemands(ordersWithDemands);
  }, [ordersWithDemands]);

  useEffect(() => {
    console.log("selectedProducts", selectedProducts);
  }, [selectedProducts]);

  const handleOpenModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setOpen(true);
  };

  const onConfirm = async () => {
    const currentOrder = data.filter(
      (order) => order.id === currentOrderId
    )?.[0];

    // {
    //   "name": "000039",
    //   "externalCode": "championCode",
    //   "code": "codeOfChampion",
    //   "moment": "2013-04-19 13:50:24",
    //   "applicable": true,
    //   "vatEnabled": true,
    //   "vatIncluded": true,
    //   "agent": {
    //     "meta": {
    //         "href": "https://api.moysklad.ru/api/remap/1.2/entity/counterparty/71d48933-fd85-11e5-9464-e4de00000005",
    //         "type": "counterparty",
    //         "mediaType": "application/json"
    //     }
    //   },
    //   "agentAccount": {
    //     "meta": {
    //                 "href": "https://api.moysklad.ru/api/remap/1.2/entity/counterparty/71d48933-fd85-11e5-9464-e4de00000005/accounts/71d4cfdb-fd85-11e5-9464-e4de00000006",
    //                 "type": "account",
    //                 "mediaType": "application/json"
    //             }
    //   },
    //   "state": {
    //     "meta": {
    //       "href": "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/fb56c504-2e58-11e6-8a84-bae500000069",
    //       "type": "state",
    //       "mediaType": "application/json"
    //     }
    //   },
    //   "attributes": [
    //     {
    //       "meta": {
    //         "href": "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/0cd74e1e-2e59-11e6-8a84-bae50000008a",
    //         "type": "attributemetadata",
    //         "mediaType": "application/json"
    //       },
    //       "value": "Обновленный Атрибут заказа",
    //     }
    //   ]
    // }

    const entityObj = customEntityData.rows.filter(
      (en: any) => en.id === entityId
    )[0];
    const entityObj2 = customEntityData2.rows.filter(
      (en: any) => en.id === entityId2
    )[0];

    // const putPayload = {
    //   id: currentOrder.id,
    //   name: currentOrder.code,
    //   externalCode: currentOrder.externalCode,
    //   moment: currentOrder.moment,
    //   code: currentOrder.mainCode,
    //   applicable: currentOrder.applicable,
    //   vatEnabled: currentOrder.vatEnabled,
    //   vatIncluded: currentOrder.vatIncluded,
    //   agent: { meta: currentOrder.agent_meta },
    //   // agentAccount: currentOrder.agentAccount_meta,
    //   state: { meta: currentOrder.state_meta },
    //   attributes: [
    //     {
    //       meta: {
    //         href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/c85dd91c-4366-11ef-0a80-0bdf0011533b",
    //         type: "attributemetadata",
    //         mediaType: "application/json",
    //       },
    //       id: "c85dd91c-4366-11ef-0a80-0bdf0011533b",
    //       name: "Кто отгрузил",
    //       type: "customentity",
    //       value: {
    //         meta: entityObj.meta,
    //         name: entityObj.name,
    //       },
    //     },
    //     {
    //       meta: {
    //         href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/09e8f85b-467f-11ef-0a80-0c0c001e0805",
    //         type: "attributemetadata",
    //         mediaType: "application/json",
    //       },
    //       id: "09e8f85b-467f-11ef-0a80-0c0c001e0805",
    //       name: "Brigada",
    //       type: "customentity",
    //       value: {
    //         meta: entityObj2.meta,
    //         name: entityObj2.name,
    //       },
    //     },
    //   ],
    // };

    const putPayload: any = {
      id: currentOrder.id,
      name: currentOrder.code,
      externalCode: currentOrder.externalCode,
      moment: currentOrder.moment,
      code: currentOrder.mainCode,
      applicable: currentOrder.applicable,
      vatEnabled: currentOrder.vatEnabled,
      vatIncluded: currentOrder.vatIncluded,
      agent: {meta: currentOrder.agent_meta},
      // agentAccount: currentOrder.agentAccount_meta,
      state: {meta: currentOrder.state_meta},
      description: comments[currentOrder.id],
    };

    const attributes = [];

    // Add the first attribute if entityObj is not empty
    if (entityObj && Object.keys(entityObj).length > 0) {
      attributes.push({
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/c85dd91c-4366-11ef-0a80-0bdf0011533b",
          type: "attributemetadata",
          mediaType: "application/json",
        },
        id: "c85dd91c-4366-11ef-0a80-0bdf0011533b",
        name: "Кто отгрузил",
        type: "customentity",
        value: {
          meta: entityObj.meta,
          name: entityObj.name,
        },
      });
    }

    // Add the second attribute if entityObj2 is not empty
    if (entityObj2 && Object.keys(entityObj2).length > 0) {
      attributes.push({
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/09e8f85b-467f-11ef-0a80-0c0c001e0805",
          type: "attributemetadata",
          mediaType: "application/json",
        },
        id: "09e8f85b-467f-11ef-0a80-0c0c001e0805",
        name: "Brigada",
        type: "customentity",
        value: {
          meta: entityObj2.meta,
          name: entityObj2.name,
        },
      });
    }

    // Only add the attributes key if there are attributes to add
    if (attributes.length > 0) {
      putPayload.attributes = attributes;
    }

    console.log("putPayload: ", JSON.stringify(putPayload, null, 2));

    console.log("putPayload: ", JSON.stringify(putPayload, null, 2));

    const payload = {
      orderId: currentOrder.id,
      organization: {meta: currentOrder.organization_meta},
      agent: {meta: currentOrder.agent_meta},
      store: currentOrder.store,
      customerOrder: {
        meta: {
          href: currentOrder.meta.href,
          type: currentOrder.meta.type,
          mediaType: currentOrder.meta.mediaType,
          uuidHref: currentOrder.meta.uuidHref,
        },
      },
      positions: currentOrder.products
        .filter((product) =>
          selectedProducts?.[currentOrder?.id]?.includes(product?.id)
        )
        .map((product) => {
          return {
            quantity: product.quantity,
            price: product.price,
            discount: product.discount,
            vat: product.vat,
            assortment: {
              meta: product.assortment.meta,
            },
          };
        }),
    };

    try {
      const data = Promise.all([
        await axios.post("/api/orders", {
          ...payload,
        }),
        await axios.put("/api/orders", putPayload),
      ]);

      setOpen(false);

      console.log("data: ", data);
    } catch (err: any) {
      console.log("error: ", err);
    }

    console.log("payload: ", payload);
  };

  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const mergeDemands = (demands: {[key: string]: string[]}) => {
    setSelectedProducts((prevSelectedProducts) => {
      const merged = {...prevSelectedProducts};

      Object.entries(demands).forEach(([key, value]) => {
        if (!merged[key]) {
          merged[key] = [];
        }
        merged[key] = Array.from(new Set([...merged[key], ...value]));
      });

      return merged;
    });

    console.log(selectedProducts);
  };

  // useEffect(() => {
  //   if (customEntityData && customEntityData2) {
  //     setEntityId(customEntityData.rows?.[0].id);
  //     setEntityId2(customEntityData2.rows?.[0].id);
  //   }
  // }, [customEntityData, customEntityData2]);

  return (
    <div>
      <Dialog open={open} setOpen={setOpen} onConfirm={onConfirm} />
      {data.map((order) => {
        return (
          <div key={order.id} className="my-5 rounded-md border p-y">
            <div className="flex flex-col w-full gap-2 mb-5">
              <div className="flex items-center gap-2 p-5">
                <Badge variant="secondary">{order.code}</Badge>
                <h4 className="text-sm">{order.agent_name}</h4>
                <p className="text-xs ml-auto">{order.phone}</p>
              </div>
              <div className="w-full px-5 flex gap-5">
                <Select
                  // defaultValue={
                  // customEntityData?.rows?.[0].filter(
                  //   (entity: any) =>
                  //     entity.name === order.attributes[0].value.name
                  // )[0]?.id
                  // }
                  value={
                    entityId ||
                    customEntityData?.rows?.filter(
                      (entity: any) =>
                        entity?.name === order?.attributes?.[0]?.value?.name
                    )[0]?.id
                  }
                  onValueChange={(e) => setEntityId(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={isLoading ? "Loading..." : `Select Loader 1`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customEntityData?.rows?.map((entity: any) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  // defaultValue={
                  // customEntityData?.rows?.[0].filter(
                  //   (entity: any) =>
                  //     entity.name === order.attributes[0].value.name
                  // )[0]?.id
                  // }

                  value={
                    entityId2 ||
                    customEntityData2?.rows?.filter(
                      (entity: any) =>
                        entity?.name === order?.attributes?.[1]?.value?.name
                    )[0]?.id
                  }
                  onValueChange={(e) => setEntityId2(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoading2 ? "Loading..." : `Select Loader 2`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customEntityData2?.rows?.map((entity: any) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Table className="rounded-xl border-zinc-100">
                <TableHeader>
                  <TableRow className="border border-t">
                    <TableHead className="w-[150px]">Tovar Nomi</TableHead>
                    <TableHead>Soni</TableHead>
                    <TableHead>Yuklandi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Checkbox
                          className="block ml-5"
                          checked={selectedProducts?.[order.id]?.includes(
                            product.id
                          )}
                          onClick={() => handleSelect(order.id, product.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <textarea
                        value={
                          comments[order.id] !== undefined
                            ? comments[order.id]
                            : order.description
                            ? order.description
                            : ""
                        }
                        className="w-full p-2 resize-none"
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
                    <TableCell className="text-right">
                      <Button
                        size="sm"
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
      })}
    </div>
  );
};
const Dialog = ({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ma&apos;lumotlar yuborishni tasdiqlaysizmi?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Tasdiqlayman
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};