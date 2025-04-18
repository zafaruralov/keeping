import { ref } from "vue";
import { defineStore } from "pinia";

export const useCardItemStore = defineStore("cardItem", () => {
  let storedItemCard: FrequentItem[];
  try {
    storedItemCard = JSON.parse(localStorage.getItem("itemCard") || "[]");
  } catch (error) {
    storedItemCard = [];
  }

  const itemCard = ref<FrequentItem[]>(groupedItems(storedItemCard));
  const frequentItems = ref<FrequentItem[]>([]);

  function setFrequentItem(items: FrequentItem[]): void {
    frequentItems.value = items;
    localStorage.setItem("frequentItems", JSON.stringify(frequentItems.value));
  }

  function getActiveProductBarcode(id: number): FrequentItem | {} {
    const lStorage = JSON.parse(localStorage.getItem("itemCard") || "[]");
    if (Array.isArray(lStorage)) {
      return lStorage.find((el) => el.id === id) || {};
    }
    return {};
  }

  function setItemCard(item: FrequentItem): void {
    const existingItemIndex = itemCard.value.findIndex((i: FrequentItem) => i.id === item.id);
    const barcodeLength = item.marking_code ? item.marking_code.length : 0;
    if (existingItemIndex !== -1) {
      const existingItem = itemCard.value[existingItemIndex];
      if (barcodeLength === 0 && existingItem.is_marking) {
        return removeItemCard(existingItem.id);
      }
      itemCard.value[existingItemIndex] = {
        ...existingItem,
        ...item,
        amount: barcodeLength > 0 ? barcodeLength : existingItem.amount + 1
      };
    } else {
      itemCard.value.push({
        ...item,
        amount: barcodeLength > 0 ? barcodeLength : 1
      });
    }

    localStorage.setItem("itemCard", JSON.stringify(itemCard.value));
  }

  function removeItemCard(id: number): void {
    const itemIndex = itemCard.value.findIndex((i: FrequentItem) => i.id === id);
    if (itemIndex !== -1) {
      const item = itemCard.value[itemIndex];
      if (item.marking_code) item.marking_code.splice(0, item.marking_code.length);
      itemCard.value.splice(itemIndex, 1);
      localStorage.setItem("itemCard", JSON.stringify(itemCard.value));
    }
  }

  function clearAllItem() {
    itemCard.value = [];
    localStorage.setItem("itemCard", JSON.stringify(itemCard.value));
  }

  function groupedItems(items: FrequentItem[]): FrequentItem[] {
    return items.map((item) => ({
      ...item,
      amount: item.amount > 1 ? item.amount + 1 : 1
    }));
  }

  function setBarcodeToItem(item: FrequentItem, marking_code: string[]) {
    setItemCard({ ...item, marking_code });
  }

  return {
    itemCard,
    setItemCard,
    removeItemCard,
    setFrequentItem,
    frequentItems,
    setBarcodeToItem,
    getActiveProductBarcode,
    clearAllItem
  };
});
