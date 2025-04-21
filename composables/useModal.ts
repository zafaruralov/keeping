export function useModal() {
  const card = useCardItemStore();
  const currentItem = ref<FrequentItem | null>(null);
  const activeProductBarcode = ref<string[]>([]);
  const showModal = ref(false);
  const updateModalValue = ref(false);

  function isFrequentItem(obj: any): obj is FrequentItem {
    return obj && typeof obj === "object" && "id" in obj && "marking_code" in obj;
  }

  function triggerModal(item: FrequentItem, change: boolean = false) {
    updateModalValue.value = change;
    currentItem.value = item;
    const product = card.getActiveProductBarcode(item.id);

    if (isFrequentItem(product) && product.marking_code) {
      activeProductBarcode.value = product.marking_code;
    } else {
      activeProductBarcode.value = [];
    }

    showModal.value = true;
    openModal();
  }

  function handleConfirm() {
    if (currentItem.value) {
      if (currentItem.value.is_marking && !activeProductBarcode.value.length && !updateModalValue.value) {
        alert("where is barcode stupid");
        return;
      }
      card.setBarcodeToItem(currentItem.value, activeProductBarcode.value);
    }
  }

  return {
    currentItem,
    activeProductBarcode,
    showModal,
    updateModalValue,
    triggerModal,
    handleConfirm
  };
}
