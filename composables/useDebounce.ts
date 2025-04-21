import { ref, watch } from "vue";

export function useDebounce(reactiveData: any, delay: number) {
  const debouncedValue = ref(reactiveData.value);

  let timeout: ReturnType<typeof setTimeout>;

  const trigger = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = reactiveData.value;
    }, delay);
  };

  watch(reactiveData, trigger);

  return { debouncedValue, trigger };
}
