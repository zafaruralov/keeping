<script setup lang="ts">
import type { Transaction, Receipt } from "~/types/type";
defineProps({
  toggle: {
    type: Function,
    required: true
  }
});
const { $api } = useApi();
const historyList = ref<Transaction[]>([]);

const selectedReceipt = ref<Receipt | null>(null);
const checkId = ref<number | null>(null);
const view = ref<"history" | "receipt">("history");

const backToHistory = () => {
  view.value = "history";
  selectedReceipt.value = null;
};

const { data, isFetching, isLoading, refetch, total } = useMoreData({
  key: ["allHistory"],
  link: `/v3/retail/trade/history`,
  elementId: "load-more-history",
  responseKey: "history",
  size: 12,
  params: {},
  refetchOnWindowFocus: false
});

const {
  data: checkValue,
  error,
  refresh: checkIdValue
} = await useAsyncData(
  "check-html-data",
  () =>
    $api("/v1/retail/html/data", {
      query: { id: checkId }
    }),
  {
    immediate: false
  }
);

const handleTransactionClick = async (transactionId: number | null) => {
  checkId.value = transactionId;
  await checkIdValue();
  checkList();
};

async function checkList() {
  await $fetch("http://localhost:8090/print", {
    method: "POST",
    body: {
      content: checkValue.value
    }
  });
}

watch(
  () => isFetching.value,
  () => {
    if (data.value) {
      historyList.value = data.value.pages.map((el: any) => el.data as Transaction[]).flat();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="history" v-if="!isLoading">
    <Transition name="fade" mode="out-in">
      <div v-if="view === 'history'" key="history" class="view-container">
        <div class="history-header">
          <div class="history-header__subtitle">
            <h1 class="history-header__subtitle-title">Savatlar tarixi</h1>
            <p class="history-header__subtitle-desc">100 ta savat</p>
          </div>
          <div class="history-header__close" @click="toggle()" />
          <div class="history-header__height" />
        </div>
        <div class="history-body">
          <div
            class="history-container"
            v-for="item in historyList"
            :key="item.num"
            @click="handleTransactionClick(item.id)"
          >
            <div class="history-container__header">
              <h1 class="history-container__header-title">Savat raqami {{ item.num }}</h1>
              <img src="/img/basket/right.svg" alt="move on" />
            </div>
            <div class="history-container__subtitle">
              <p class="history-container__subtitle-title">{{ item.date }}</p>
              <p class="history-container__subtitle-title">/</p>
              <p class="history-container__subtitle-title">{{ item.time }}</p>
            </div>
            <div class="history-container__sum">
              <div class="history-container__sum-wrapper">
                <p class="history-container__subtitle-title">Summa: {{ item.final_sum }}:</p>
                <p class="history-container__subtitle-title">{{ item.price }}</p>
              </div>
              <p class="history-container__subtitle-title">UZS</p>
            </div>
          </div>
          <div id="load-more-history">Loader</div>
        </div>
      </div>

      <div v-else-if="view === 'receipt'" key="receipt" class="view-container">
        <div class="history-header">
          <div class="history-header__subtitle">
            <h1 class="history-header__subtitle-title">Chek</h1>
            <p class="history-header__subtitle-desc">Savat raqami #001</p>
          </div>
          <div class="history-header__close" @click="backToHistory" />
          <div class="history-header__height" />
        </div>

        <div class="receipt-content" v-if="selectedReceipt">
          <div class="receipt-header">
            <h2>{{ selectedReceipt.storeName }}</h2>
            <p class="receipt-header__address">{{ selectedReceipt.storeAddress }}</p>
            <div class="receipt-header__number">
              <p>Raqami:</p>
              <p>{{ selectedReceipt.phoneNumber }}</p>
            </div>
          </div>

          <div class="receipt-barcode">
            <div class="barcode-placeholder"></div>
          </div>

          <div class="receipt-info">
            <div class="info-row">
              <span>Savat #:</span>
              <span>{{ selectedReceipt.receiptNumber }}</span>
            </div>
            <div class="info-row">
              <span>Sotuv sanasi:</span>
              <span>{{ selectedReceipt.date }}</span>
            </div>
            <div class="info-row">
              <span>Sotuv vaqti:</span>
              <span>{{ selectedReceipt.time }}</span>
            </div>
            <div class="info-row">
              <span>Sotuv hodimi:</span>
              <span>{{ selectedReceipt.cashier }}</span>
            </div>
          </div>

          <div class="receipt-items">
            <div v-for="item in selectedReceipt.items" :key="item.name" class="item-row">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-details">
                <span>x{{ item.quantity }}</span>
                <span>{{ item.price }}</span>
              </div>
            </div>
          </div>

          <div class="receipt-totals">
            <div class="total-row">
              <span>Oraliq summa</span>
              <span>{{ selectedReceipt.subtotal }}</span>
            </div>
            <div class="total-row">
              <span>Soliq</span>
              <span>{{ selectedReceipt.tax }}</span>
            </div>
            <div class="total-row final">
              <span>Yakuniy</span>
              <span>{{ selectedReceipt.total }}</span>
            </div>
          </div>
          <div class="receipt-totals">
            <div class="total-sum">
              <span>Berilgan summa</span>
              <span>{{ selectedReceipt.amountPaid }}</span>
            </div>
            <div class="total-row final">
              <span>Qaytim</span>
              <span>{{ selectedReceipt.change }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <SkeletonHistory v-else />
</template>

<style lang="scss">
.history {
  min-width: 234px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;

  overflow: hidden;
  border-radius: 24px;
  background-color: #fff;
  height: calc(100vh - 96px);

  &-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 8px;
    position: relative;
    padding: 0 0 20px 0;

    &__height {
      position: absolute;
      bottom: 0;
      left: -10%;
      height: 1px;
      width: 120%;
      background: #e0e5f2;
    }

    &__close {
      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;

      width: 40px;
      height: 40px;
      gap: 8px;

      border-radius: 24px;
      border: 1px solid #e0e5f2;

      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      &::before,
      &::after {
        content: "";
        position: absolute;
        background: #010101;
        transition: 0.2s;
      }

      &::before {
        width: 1px;
        height: 14px;
        transform: rotate(45deg);
      }

      &::after {
        width: 14px;
        height: 1px;
        transform: rotate(45deg);
      }

      &:hover {
        background: #f1f5fe;
      }
    }
    &__subtitle {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1 0 0;

      &-title {
        color: #010101;
        font-size: 20px;
        font-weight: 500;
        line-height: 26px;
        margin: 0;
      }
      &-desc {
        color: #71899e;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
        margin: 0;
      }
    }
  }
  &-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-container {
    display: flex;
    width: 202px;
    padding: 8px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    border-radius: 16px;
    border: 1px solid #e0e5f2;
    transform: all 0.2s;

    &:hover {
      background: #f1f5fe;
    }

    &__header {
      display: flex;
      gap: 8px;
      width: 100%;
      justify-content: space-between;

      &-title {
        margin: 0;
        color: #010101;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.56px;
      }
    }
    &__subtitle {
      display: flex;
      align-items: center;
      gap: 8px;

      &-title {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #71899e;

        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
      }
    }
    &__sum {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      &-wrapper {
        display: flex;
        justify-content: center;
        gap: 8px;
      }
    }
  }
}
.receipt {
  &-content {
    display: flex;
    width: 200px;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;

    border-radius: 16px;
    border: 1px solid #e0e5f2;
    background: #fff;
  }

  &-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;

    h2 {
      width: 100%;
      margin: 0;
      color: #010101;
      text-align: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: 14.4px;
    }

    &__address {
      width: 100%;
      margin: 0;
      color: #010101;
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 14.4px;
    }
    &__number {
      width: 100%;
      margin: 0;
      display: flex;
      justify-content: space-between;
      p {
        gap: 8px;
        text-align: right;
        font-size: 12px;
        font-weight: 400;
        line-height: 14.4px;
      }
    }
  }

  &-barcode {
    display: flex;
    justify-content: center;

    .barcode-placeholder {
      width: 100%;
      height: 60px;
      background: repeating-linear-gradient(to right, #000 0, #000 2px, transparent 2px, transparent 4px);
    }
  }

  &-info {
    width: 100%;
    border-bottom: 1px solid #010101;
    padding-bottom: 16px;
  }
}

.info-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #010101;
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    margin: 0;
  }
}

.receipt-items {
  border-bottom: 1px solid #010101;
  padding: 1rem;
  width: 100%;

  .item-row {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
    justify-content: space-between;
  }

  .item-name {
    flex: 1;
    color: #010101;
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
    max-width: 79px;
  }

  .item-details {
    display: flex;
    gap: 16px;
    color: #010101;

    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  }
}

.receipt-totals {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  .total {
    &-sum {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      align-self: stretch;
      span {
        color: #010101;
        font-size: 10px;
        font-weight: 400;
        line-height: 12px;
      }
    }
    &-row {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 20px;
      align-self: stretch;

      span {
        color: #010101;
        text-align: right;
        font-size: 10px;
        font-weight: 400;
        line-height: 12px;
        max-width: 40px;

        &:last-child {
          flex: 1 0 0;
        }
      }

      &.final {
        span {
          color: #010101;
          font-weight: 700;
          font-size: 10px;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
