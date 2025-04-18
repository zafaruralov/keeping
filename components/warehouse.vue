<template>
  <div class="container warehouse">
    <Header />
    <div class="popular-section">
      <!-- <Search @search="handleSearch" />
      <div class="popular-warehouse" v-if="filteredItems.length > 0 || items.length > 0">
        <h1 class="popular-warehouse__title">Ommabop mahsulotlar</h1>
        <p class="popular-warehouse__subtitle">{{ total }} ta mahsulot</p>
      </div>
      <FilterList
        :filters="items"
        :selectedFilter="selectedFilter"
        @update:selectedFilter="setFilter"
        v-if="filteredItems.length > 0 || items.length > 0"
      />
      <ItemsList :filteredItems="filteredItems" v-if="filteredItems.length > 0" />
      <NoProducts v-else @refresh="refetchProducts" /> -->
    </div>
    <div class="home-loader" v-if="isFetching" />
    <div id="load-trigger"></div>
  </div>
</template>
<script lang="ts" setup>
import type { AllCategoryResponse, ApiResponse, Item } from "~/types/type";

const card = useCardItemStore();

const items = ref<Item[]>([]);
const searchQuery = ref<string>("");
const filteredItems: Ref<Item[]> = ref([]);
const selectedFilter = ref<number | null>(null);

const { $api } = useApi();

const {
  isFetching,
  data: paginatedProducts,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  total,
  refetch: refetchProducts
} = useMoreData({
  key: ["products"],
  link: "/v3/retail/trade/products",
  size: 20,
  elementId: "load-trigger",
  responseKey: "producs"
});

watchEffect(() => {
  if (paginatedProducts.value) {
    const allPages = paginatedProducts.value.pages.flatMap((page) => (page as { data: ApiResponse }).data);
    filteredItems.value = allPages;
  }
});

const { data: allCategory, error } = await useAsyncData(() => $api<AllCategoryResponse>("/v3/retail/trade/params"));

watch(
  () => allCategory.value,
  (newProducts) => {
    if (newProducts) {
      items.value = newProducts?.data.category;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (allCategory.value) {
    card.setFrequentItem(allCategory.value.data.frequent);
  }
});

function setFilter(filter: number | null) {
  selectedFilter.value = filter;
  refetchProducts();
}

function handleSearch(query: string) {
  searchQuery.value = query;
  refetchProducts();
}
</script>

<style lang="scss">
.popular {
  &-warehouse {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 0;
    &__title {
      color: #010101;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 26px;
    }
    &__subtitle {
      color: #71899e;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 19.6px;
    }
  }
}
.home {
  &-loader {
    width: 20px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 3px solid #514b82;
    animation: l20-1 0.8s infinite linear alternate, l20-2 1.6s infinite linear;
    @keyframes l20-1 {
      0% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
      }
      12.5% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
      }
      25% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
      }
      50% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
      }
      62.5% {
        clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
      }
      75% {
        clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
      }
      100% {
        clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
      }
    }
    @keyframes l20-2 {
      0% {
        transform: scaleY(1) rotate(0deg);
      }
      49.99% {
        transform: scaleY(1) rotate(135deg);
      }
      50% {
        transform: scaleY(-1) rotate(0deg);
      }
      100% {
        transform: scaleY(-1) rotate(-135deg);
      }
    }
  }
}
</style>
