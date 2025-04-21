<script setup lang="ts">
const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const barcodeData = ref<string>("");
let scanning = false;
let timer: ReturnType<typeof setTimeout> | undefined = undefined;

const isNonLatinKeyboardLayout = (event: KeyboardEvent): boolean => {
  const cyrillicRegex = /[\u0400-\u04FF]/;
  return cyrillicRegex.test(event.key);
};

const alertNonLatinKeyboard = () => {
  alert("Iltimos, klaviaturani lotin yozuviga o‘tkazing.");
};

const handleBarcodeInput = (event: KeyboardEvent) => {
  if (!scanning) {
    scanning = true;
    barcodeData.value = "";
  }

  if (isNonLatinKeyboardLayout(event)) {
    alertNonLatinKeyboard();
    scanning = false;
    barcodeData.value = "";
    return;
  }

  if (timer !== undefined) {
    clearTimeout(timer);
  }

  if (event.key === "Enter") {
    scanning = false;
    emit("search", barcodeData.value);
    barcodeData.value = "";
    return;
  }

  if (event.key !== "Shift") {
    barcodeData.value += event.key;
  }

  timer = setTimeout(() => {
    scanning = false;
    barcodeData.value = "";
  }, 300);
};

const addListener = () => {
  window.addEventListener("keydown", handleBarcodeInput);
};

const removeListener = () => {
  window.removeEventListener("keydown", handleBarcodeInput);
};

onMounted(() => {
  addListener();
});

onUnmounted(() => {
  removeListener();
});
</script>
