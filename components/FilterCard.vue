<template>
  <div class="filter-card" @click="toggleFilter" :class="selectedFilter === id && 'active'">
    <span class="filter-card-label">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  id: number;
  selectedFilter: number | null;
}>();

const emit = defineEmits(["update:selectedFilter"]);

function toggleFilter() {
  if (props.id === props.selectedFilter) {
    emit("update:selectedFilter", null);
  } else {
    emit("update:selectedFilter", props.id);
  }
}
</script>

<style scoped>
.filter-card {
  min-height: 92px;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e0e5f2;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-card.active,
.filter-card:hover {
  border: 1px solid #00b241;
  border-color: #00b241;
}

.filter-card img {
  margin-right: 8px;
}

.filter-card span {
  font-weight: 500;
  color: #333;
}

.filter-card-label {
  color: #010101;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.56px;
}
</style>
