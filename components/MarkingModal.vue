<template>
  <Modal
    :modelValue="props.show"
    title="Markirovkali mahsulot qo‘shish"
    confirm-text="Yakunlash"
    cancel-text="Chiqish"
    @confirm="handleConfirm"
    @update:modelValue="(value: boolean) => {
    emit('update:show', value);
    if (!value) closeModal();
  }"
  >
    <div class="warehouse-modal" v-if="item">
      <div class="warehouse-modal__subtitle" :class="isDanger && 'danger'">
        <p class="warehouse-modal__subtitle-title">
          Xurmatli mijoz, Mahsulotini {{ !isDanger ? "savatga qo‘shishingiz" : "savatdan olishingiz" }} uchun QR
          markirovkani skaner qiling
        </p>
        <p class="warehouse-modal__subtitle-desc">{{ item.name }} {{ item.unit_name }} {{ item.barcode }}</p>
      </div>
      <div class="warehouse-modal__wrapper">
        <div class="warehouse-modal__input" v-for="(n, index) in activeProductBarcode" :key="index">
          <input type="text" class="warehouse-modal__input-text" :value="n" readonly />
          <img src="/img/modal/scan.svg" alt="scan icon" class="warehouse-modal__input-img" />
        </div>
      </div>
      <BarcodeScanner @search="handleBarcodeSearch" />
    </div>
    <div v-else>no Item</div>
  </Modal>
</template>
<script setup lang="ts">
const props = defineProps({
  item: Object,
  show: Boolean,
  activeProductBarcode: Array,
  isDanger: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(["update:show", "confirm", "update:activeProductBarcode"]);

const handleBarcodeSearch = (barcode: string) => {
  if (props.isDanger) {
    if (props.activeProductBarcode && props.activeProductBarcode.includes(barcode)) {
      const updatedBarcodes = props.activeProductBarcode.filter((item) => item !== barcode);
      emit("update:activeProductBarcode", updatedBarcodes);
    }
  } else if (props.activeProductBarcode && !props.activeProductBarcode.includes(barcode)) {
    emit("update:activeProductBarcode", [...props.activeProductBarcode, barcode]);
  }
};

const handleConfirm = () => {
  emit("update:show", false);
  emit("confirm", props.activeProductBarcode);
};
</script>
