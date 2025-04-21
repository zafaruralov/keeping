<template>
  <div class="search-bar">
    <img src="/img/search.svg" alt="logo" />
    <input type="text" placeholder="Izlash" v-model="searchQuery" />
    <div :class="searchQuery && 'search-bar__input'" @click="clearAllValues" />
    <BarcodeScanner @search="handleBarcodeSearch" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["search"]);
const isModal = useModalOpen();

const searchQuery = ref<string>("");
const { debouncedValue: debouncedQuery, trigger } = useDebounce(searchQuery, 1000);

watch(searchQuery, () => {
  trigger();
});

watch(debouncedQuery, (newQuery: string) => {
  emit("search", newQuery);
});
const handleBarcodeSearch = (barcode: string) => {
  if (!isModal.value) {
    searchQuery.value = barcode;
    trigger();
  }
};

const clearAllValues = () => {
  searchQuery.value = "";
  trigger();
};
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 12px 0 0;

  &__input {
    display: flex;
    width: 12px;
    height: 12px;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
    border-radius: 99px;
    background: #a6abae;
    padding: 10px;

    position: absolute;
    right: 25px;

    &::before,
    &::after {
      transition: all 2s;
      content: "";
      position: absolute;
      background: #fff;

      transition: 0.2s;
    }

    &::before {
      width: 1.3px;
      height: 10px;
      transform: rotate(45deg);
    }

    &::after {
      width: 10px;
      height: 1.3px;
      transform: rotate(45deg);
    }
  }
}

img {
  left: 18px;
  position: absolute;
}

input[type="text"] {
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
  padding: 14px 48px;
  color: #71899e;
  font-weight: 500;
  border-radius: 24px;
  border: 1px solid #e0e5f2;

  &:hover,
  &:focus {
    border-radius: 24px;
    border: 1px solid #00b241;
    box-shadow: 0px 0px 0px 2px rgba(0, 178, 65, 0.16);
  }
}
</style>
