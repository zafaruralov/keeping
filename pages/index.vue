<template>
  <div class="home">
    <Warehouse />
    <Basket :checklist="toggleHistory" :activeHistory="showHistory" />
    <div class="home-history">
      <History v-if="showHistory" :toggle="closeHistory" />
    </div>
  </div>
</template>
<script setup lang="ts">
useHead({
  title: "Kassa",
  meta: [
    { name: "description", content: "keeping kassa" },
    { name: "keywords", content: "point-of-sale, cash register, sales, basket, history, warehouse" },
    { property: "og:type", content: "website" },
    { name: "author", content: "Zafarjon Inc." }
  ],
  htmlAttrs: {
    lang: "en"
  }
});
const showHistory = ref<boolean>(false);

function closeHistory() {
  showHistory.value = false;
}
function toggleHistory() {
  showHistory.value = !showHistory.value;
}
</script>

<style lang="scss" scoped>
.home {
  gap: 16px;
  display: flex;
  justify-content: space-between;
  padding: 24px 40px;
}
</style>
