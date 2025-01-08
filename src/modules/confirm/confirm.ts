import { ToastMessage } from "@/app/_components/listItem";
import axios from "axios";

interface ConfirmProps {
  data: any;
  names: any;
  groups: any;
  cutters: any;
  currentOrderId: string;
  collection: {
    name: string;
    group: string;
    cutter: string;
  };
  comments: any;
  order: any;
  selectedProducts: any;

  setToastMessage: (e: ToastMessage) => void;
  toastMessage: ToastMessage;
}

export const onConfirm = async ({
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
}: ConfirmProps) => {
  setToastMessage({
    ...toastMessage,
    disabled: true,
  });
  const currentOrder = data.filter(
    (order: any) => order.id === currentOrderId
  )?.[0];

  const entityObj = names.rows.filter(
    (en: any) => en.id === collection.name
  )[0];
  const entityObj2 = groups.rows.filter(
    (en: any) => en.id === collection.group
  )[0];
  const entityObj3 = cutters.rows.filter(
    (en: any) => en.id === collection.cutter
  )[0];

  const putPayload: any = {
    id: currentOrder.id,
    name: currentOrder.code,
    externalCode: currentOrder.externalCode,
    moment: currentOrder.moment,
    code: currentOrder.mainCode,
    applicable: currentOrder.applicable,
    vatEnabled: currentOrder.vatEnabled,
    vatIncluded: currentOrder.vatIncluded,
    agent: { meta: currentOrder.agent_meta },
    // agentAccount: currentOrder.agentAccount_meta,
    state: { meta: currentOrder.state_meta },
    description: comments[currentOrder.id],
  };

  const attributes = [];
  const attributesDemand = [];

  // Add the first attribute if entityObj is not empty
  if (entityObj && Object.keys(entityObj).length > 0) {
    attributes.push({
      meta: {
        href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/bf6c8db4-4807-11ef-0a80-037f00392b45",
        type: "attributemetadata",
        mediaType: "application/json",
      },
      id: "bf6c8db4-4807-11ef-0a80-037f00392b45",
      name: "Кто отгрузил",
      type: "customentity",
      value: {
        meta: entityObj.meta,
        name: entityObj.name,
      },
    });
    attributesDemand.push({
      meta: {
        href: "https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/attributes/fd17e1fe-ab2d-11ef-0a80-02cc003a75b0",
        type: "attributemetadata",
        mediaType: "application/json",
      },
      id: "fd17e1fe-ab2d-11ef-0a80-02cc003a75b0",
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
        href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/cc481563-4807-11ef-0a80-0bea00359633",
        type: "attributemetadata",
        mediaType: "application/json",
      },
      id: "cc481563-4807-11ef-0a80-0bea00359633",
      name: "Бригада",
      type: "customentity",
      value: {
        meta: entityObj2.meta,
        name: entityObj2.name,
      },
    });
    attributesDemand.push({
      meta: {
        href: "https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/attributes/0a025ac2-ab2e-11ef-0a80-163f003cca55",
        type: "attributemetadata",
        mediaType: "application/json",
      },
      id: "0a025ac2-ab2e-11ef-0a80-163f003cca55",
      name: "Бригада",
      type: "customentity",
      value: {
        meta: entityObj2.meta,
        name: entityObj2.name,
      },
    });
  }

  const positions = [
    ...order.products
      .filter((item: any) => selectedProducts.includes(item.id))
      .map((product: any) => {
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
  ].filter((item) => item !== null);

  // Only add the attributes key if there are attributes to add
  if (attributes.length > 0) {
    putPayload.attributes = attributes;
  }

  const payload = {
    orderId: currentOrder.id,
    organization: { meta: currentOrder.organization_meta },
    agent: { meta: currentOrder.agent_meta },
    store: currentOrder.store,
    rate: currentOrder.rate,
    customerOrder: {
      meta: {
        href: currentOrder.meta.href,
        type: currentOrder.meta.type,
        mediaType: currentOrder.meta.mediaType,
        uuidHref: currentOrder.meta.uuidHref,
      },
    },
    attributes: attributesDemand,
    positions,
  };

  console.log("payload ===", putPayload);
  try {
    const data = Promise.all([
      await axios.post("/api/orders", {
        ...payload,
      }),
      await axios.put("/api/orders", putPayload),
    ]);

    setToastMessage({
      ...toastMessage,
      open: false,
      success: !toastMessage.success,
    });
    console.log("data: ", data);
  } catch (err: any) {
    console.log("error: ", err);
    setToastMessage({
      ...toastMessage,
      error: !toastMessage.error,
    });
  } finally {
    setToastMessage({
      ...toastMessage,
      disabled: false,
      open: !toastMessage.open,
    });
  }
};
