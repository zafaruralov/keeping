<template>
  <div class="filter-list">
    <FilterCard
      v-for="filter in filters"
      :key="filter.id"
      :name="filter.name"
      :id="filter.id"
      :selectedFilter="selectedFilter"
      @update:selectedFilter="handleFilterUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import type { Filter } from "~/types/type";

defineProps<{
  selectedFilter: number | null;
  filters: Filter[];
}>();
const emit = defineEmits(["update:selectedFilter"]);

function handleFilterUpdate(filterId: number) {
  emit("update:selectedFilter", filterId);
}
</script>

<style scoped lang="scss">
.filter-list {
  overflow-x: auto;

  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 0 0;
  flex-shrink: 0;
  align-self: stretch;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-list::-webkit-scrollbar {
  height: 2px;
  display: none;
}
</style>
