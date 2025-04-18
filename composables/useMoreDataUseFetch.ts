import { ref, computed, onMounted, onUnmounted } from "vue";
import { useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/vue-query";
import { getParams } from "~/services/getParams";

interface PageData<T> {
  data: T[];
  nextPage?: number;
}

// T is the type of each item in response array
export function useMoreData<T>({
  key,
  link,
  size,
  elementId,
  params,
  responseKey,
  ...rest
}: {
  key: any;
  link: string;
  size: number;
  elementId: string;
  params?: any;
  responseKey: string;
} & Partial<UseInfiniteQueryOptions<PageData<T>, Error>>) {
  const total = ref(0);
  const observer = ref<IntersectionObserver | null>(null);

  const { $api } = useApi();
  const allParams = computed(() => params && { ...getParams(params) });

  const query = useInfiniteQuery<PageData<T>, Error>({
    queryKey: key,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const data = await $api<any>(link, {
          method: "GET",
          query: { page: pageParam, size: size, ...allParams.value }
        });

        const productsTotal = data.data?.total ?? 0;
        const resData: T[] = data.data ? data.data[responseKey] : [];

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
    getNextPageParam: (lastPage) => lastPage.nextPage,
    ...rest
  });

  const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && query.hasNextPage.value && !query.isFetchingNextPage.value) {
      query.fetchNextPage();
    }
  };

  const initIntersectionObserver = () => {
    observer.value = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0.5
    });

    const triggerElement = document.querySelector(`#${elementId}`);
    if (!triggerElement) {
      console.error(`❌ Element with id "${elementId}" not found!`);
      return;
    }
    observer.value.observe(triggerElement);
  };

  onMounted(() => {
    setTimeout(initIntersectionObserver, 3000);
  });
  onUnmounted(() => observer.value?.disconnect());

  return { ...query, total };
}
