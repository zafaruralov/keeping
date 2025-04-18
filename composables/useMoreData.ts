import { ref, onMounted, onUnmounted, computed } from "vue";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { getParams } from "../services/getParams";

export function useMoreData({ key, link, size, elementId, params = null, responseKey, ...rest }) {
  const total = ref(0);
  const observer = ref<IntersectionObserver | null>(null);
  const $api = useApi();

  const allParams = computed(() => (params ? { ...getParams(params) } : {}));

  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const data = await $api(link, {
          query: {
            page: pageParam,
            size,
            ...allParams.value
          }
        });

        const productsTotal = data.data?.total ?? 0;
        const resData = data.data?.[responseKey] ?? [];

        total.value = productsTotal;

        const totalFetched = (pageParam - 1) * size + resData.length;
        const hasMorePages = totalFetched < productsTotal;

        return {
          data: resData,
          nextPage: hasMorePages ? pageParam + 1 : undefined
        };
      } catch (e) {
        console.error("❌ Error fetching data:", e);
        return { data: [], nextPage: undefined };
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    ...rest
  });

  const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && query.hasNextPage.value && !query.isFetchingNextPage.value) {
      query.fetchNextPage();
    }
  };

  const initIntersectionObserver = () => {
    const el = document.getElementById(elementId);
    if (!el) {
      console.error(`❌ Element with id "${elementId}" not found!`);
      return;
    }

    observer.value = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0.5
    });

    observer.value.observe(el);
  };

  onMounted(() => {
    setTimeout(initIntersectionObserver, 3000);
  });

  onUnmounted(() => observer.value?.disconnect());

  return {
    ...query,
    total
  };
}
