<template>
  <div class="home">
    <Warehouse />
    <Basket />
    <div class="home-history">
      <History />
    </div>
  </div>
</template>
<script setup lang="ts">
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
