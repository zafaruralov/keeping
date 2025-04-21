<script setup lang="ts">
const router = useRouter();

defineProps({
  checklist: {
    type: Function,
    required: true
  },
  activeHistory: {
    type: Boolean,
    required: true
  }
});

onMounted(() => {
  userStore.loadUserFromStorage();
});

const card = useCardItemStore();
const userStore = useUserInfo();
const mutation = useMutate({});

const { currentItem, activeProductBarcode, showModal, updateModalValue, triggerModal, handleConfirm } = useModal();

const cartItems = computed(() => card.itemCard);
const frequentItems = computed(() => card.frequentItems);

const userName = computed(() => userStore.fullName);

const inputRefs = ref<(HTMLElement | null)[]>([]);
const showDiscountModal = ref<boolean>(false);
const showAll = ref<boolean>(false);
const discountPercent = ref<number>(0);
const togglePercentage = ref<number>(1);

const amount2 = ref<number>(0);
const amount3 = ref<number>(0);
const amount4 = ref<number>(0);
const isOpen = ref<boolean>(false);
const shatteringId = ref<number | null>(null);
const isLoadingPay = ref<boolean>(false);
const htmlCheckData = ref({});

const handleDiscount = () => {
  showDiscountModal.value = false;
};

function pay() {
  isLoadingPay.value = true;
  mutation.mutate(
    {
      method: "post",
      link: "/v4/save/retail/trade",
      data: {
        details: cartItems.value,
        parent: {
          final_sum: totalWithTax.value,
          return_sum: amount4.value,
          pc_sum: amount3.value,
          cash_sum: amount2.value
        }
      }
    },
    {
      onSuccess: (data) => {
        showAll.value = false;
        card.clearAllItem();
        htmlCheckData.value = data.data.html;
        checkList();
        window.location.reload();
      },
      onError: (error) => {
        alert(error);
      },
      onSettled: () => {
        isLoadingPay.value = false;
      }
    }
  );
}

async function checkList() {
  await $fetch("http://localhost:8090/print", {
    method: "POST",
    body: {
      content: htmlCheckData.value
    }
  });
}

function copyPrice(amountRef: number) {
  if (amountRef === 2) {
    amount2.value = totalWithTax.value;
    amount3.value = 0;
  } else if (amountRef === 3) {
    amount3.value = totalWithTax.value;
    amount2.value = 0;
  }
}

function addFrequentItemToBasket(item: FrequentItem) {
  if (item.is_marking) {
    triggerModal(item, false);
  } else {
    card.setItemCard(item);
  }
}

const updateQuantity = (id: number, change: number) => {
  const existingItem = cartItems.value.find((i) => i.id === id);
  if (existingItem && existingItem?.saldo > existingItem?.amount) {
    if (existingItem) {
      if (existingItem.is_marking) {
        triggerModal(existingItem, change > 0 ? false : true);
      } else {
        existingItem.amount = Math.max(1, existingItem.amount + change);
      }
    }
  }
};

function updateBarcode(barcode: string[]) {
  activeProductBarcode.value = barcode;
}

const focusInput = (index: number) => {
  if (inputRefs.value[index]) {
    inputRefs.value[index].focus();
  } else {
    console.error(`Input at index ${index} not found.`);
  }
};
const userProfile = {
  name: userName.value,
  kasaNumber: "1-kassa",
  branch: "Bodomzor masjidi"
};
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.amount, 0);
});

const totalWithTax = computed(() => totalPrice.value);

const deleteItem = async (id: number) => {
  shatteringId.value = id;
  await new Promise((resolve) => setTimeout(resolve, 600));
  card.removeItemCard(id);
  shatteringId.value = null;
};

function logoutHandler() {
  localStorage.removeItem("token");
  router.push("/login");
}

watch(amount2, () => {
  if (amount2.value || amount3.value) {
    if (!amount3.value) {
      amount4.value = amount2.value - totalWithTax.value;
    } else {
      amount4.value = amount3.value + amount2.value - totalWithTax.value;
    }
  }
});

watch(amount3, () => {
  if (amount2.value || amount3.value) {
    if (!amount2.value) {
      amount4.value = amount3.value - totalWithTax.value;
    } else {
      amount4.value = amount3.value + amount2.value - totalWithTax.value;
    }
  }
});

watch(showAll, () => {
  if (showAll.value === false) {
    amount2.value = 0;
    amount3.value = 0;
    amount4.value = 0;
    console.log(amount4.value);
  }
});
</script>

<template>
  <!-- TODO when skeleton appear -->
  <skeletonBasket v-if="false" />
  <div class="basket container" v-else>
    <header class="basket-header">
      <div class="basket-header__title">
        <h1>Savat</h1>
      </div>
      <div class="basket-actions">
        <button class="basket-actions__button" @click="card.clearAllItem()">
          <img src="/img/basket/delete-2.svg" alt="trash-icon" />
          <span>Tozalash</span>
        </button>
        <button class="basket-actions__button" :class="{ checklist: activeHistory }" @click="checklist()">
          <img src="/img/basket/document.svg" alt="trash-icon" />
        </button>
        <div class="basket-actions__avatar" :class="isOpen && 'active'" @click="isOpen = !isOpen">
          <img src="/img/basket/profile-photo.png" alt="User avatar" />
        </div>

        <Transition name="fade">
          <div v-if="isOpen" class="basket-modal__backdrop" @click="isOpen = false"></div>
        </Transition>

        <Transition name="slide-up">
          <div v-if="isOpen" class="basket-modal">
            <div class="basket-modal__header">
              <img
                src="/img/basket/profile-photo.png"
                alt="basket-modal__header-icon"
                class="basket-modal__header-icon"
              />
              <div class="basket-modal__header-wrapper">
                <h2 class="basket-modal__header-name">
                  {{ userProfile.name }}
                </h2>
                <div class="basket-modal__header-list">
                  <p class="basket-modal__header-title">Kassa raqami:</p>
                  <p class="basket-modal__header-desc">
                    {{ userProfile.kasaNumber }}
                  </p>
                </div>
                <div class="basket-modal__header-list">
                  <p class="basket-modal__header-title">Fillial:</p>
                  <p class="basket-modal__header-desc">
                    {{ userProfile.branch }}
                  </p>
                </div>
              </div>
              <div class="basket-modal__header-close" @click="isOpen = false" />
            </div>
            <div class="basket-modal__height" />
            <div class="basket-modal__action">
              <img src="/img/basket/setting.svg" alt="action-icon" />
              <p class="basket-modal__action-title">Xisob sozlamalari</p>
            </div>
            <div class="basket-modal__action danger" @click="logoutHandler">
              <img src="/img/basket/logout.svg" alt="action-icon" />
              <p class="basket-modal__action-title">Tizimdan chiqish</p>
            </div>
          </div>
        </Transition>
      </div>
      <div class="basket-header__height" />
    </header>

    <div class="basket-items">
      <div
        v-if="cartItems.length"
        v-for="(item, index) in cartItems"
        :key="index"
        class="basket-item"
        :class="{ deleting: shatteringId === item.id }"
      >
        <div class="basket-item__image">
          <img :src="item.image" alt="Bread product" />
        </div>
        <div class="basket-item__details">
          <h3 class="basket-item__details-title">{{ item.name }}</h3>
          <div class="basket-item__details-wrapper">
            <div class="basket-item__details-codes">
              <img src="/img/basket/barcode.svg" alt="code image" class="basket-item__details-image" />
              <span class="basket-item__details-code">{{ item.barcode }}</span>
              <img src="/img/basket/copy.svg" alt="copy icon" class="basket-item__details-copy" />
            </div>
            <div class="basket-item__details-height" />
            <div class="basket-item__details-codes">
              <span class="basket-item__details-code">"МЖК 03004093001057001"</span>
              <img src="/img/basket/copy.svg" alt="copy icon" class="basket-item__details-copy" />
            </div>
          </div>
          <div class="basket-item__details-controls">
            <button class="basket-item__details-button">
              <input
                class="basket-item__details-subtitle"
                type="number"
                :ref="(el) => (inputRefs[index] = el as HTMLInputElement | null)"
                v-model="item.price"
              />
              <img
                src="/img/basket/edit-pen.svg"
                alt="pen"
                class="basket-item__details-icon"
                @click="focusInput(index)"
              />
            </button>
            <button class="basket-item__details-button">
              <span class="basket-item__details-subtitle">Narxi Chegirma</span>
              <img
                src="/img/basket/add.svg"
                alt=""
                class="basket-item__details-icon"
                @click="showDiscountModal = true"
              />
            </button>
            <button class="basket-item__details-button">
              <div
                class="basket-item__details-minus"
                @click="updateQuantity(item.id, -1)"
                :disabled="item.amount <= 1"
              />
              <span class="basket-item__details-subtitle">{{ item.amount }}</span>
              <div class="basket-item__details-plus" @click="updateQuantity(item.id, 1)" />
            </button>
          </div>
        </div>
        <div class="basket-item__delete" @click="deleteItem(item.id)" aria-label="Delete item">
          <img src="/img/basket/delete.svg" alt="delete product" />
        </div>
      </div>
      <div class="basket-empty" v-else>Mahsulot belgilanmagan</div>
    </div>

    <div class="basket-summary">
      <div class="basket-summary__actions">
        <div
          class="basket-summary__action"
          v-for="item in frequentItems"
          :key="item.id"
          @click="addFrequentItemToBasket(item)"
        >
          <div class="basket-summary__action-wrapper">
            <p class="basket-summary__action-title">
              {{ item.name }}
            </p>
            <h2 class="basket-summary__action-price">{{ item.price }} UZS</h2>
          </div>
          <div class="basket-summary__action-plus" />
        </div>
      </div>
      <div class="basket-summary__height" />
      <div class="basket-summary__financial">
        <div class="basket-summary__row total">
          <span class="basket-summary__row-label">Yakuniy summa</span>
          <div class="basket-summary__container">
            <span class="basket-summary__container-amount"> {{ totalWithTax }}</span>
            <span class="basket-summary__container-currency">UZS</span>
          </div>
        </div>
      </div>
    </div>
    <button class="basket-summary__button" @click="showAll = true">Yakunlash</button>
  </div>
  <Modal v-model="showDiscountModal" title="Chegirma qo‘shish" confirm-text="Confirm" @confirm="handleDiscount">
    <div class="form-calc">
      <button class="form-calc__percantage" :class="togglePercentage === 1 && 'active'" @click="togglePercentage = 1">
        Foizda
      </button>
      <button class="form-calc__percantage" :class="togglePercentage === 2 && 'active'" @click="togglePercentage = 2">
        Narxda
      </button>
    </div>
    <div class="form-group">
      <input v-model="discountPercent" type="number" class="form-group__input" placeholder="Enter discount %" />
      <img src="/img/basket/edit-pen.svg" alt="edit-pen" class="form-group__icon" />
    </div>
  </Modal>

  <Modal
    v-model="showAll"
    title="Yakunlash"
    confirm-text="Yakunlash"
    cancel-text="Chiqish"
    @confirm="pay"
    :loading="isLoadingPay"
  >
    <div class="form-groups">
      <div class="floating-input">
        <input type="number" v-model="totalWithTax" id="amount1" placeholder=" " disabled />
        <label for="amount1">To'lash uchun</label>
      </div>

      <div class="floating-input">
        <input type="number" v-model="amount2" id="amount2" placeholder=" " />
        <label for="amount2">Naqd to'lov miqdori</label>
        <img src="/img/basket/metal.svg" alt="icon" class="floating-input__icon" @click="copyPrice(2)" />
      </div>

      <div class="floating-input">
        <input type="number" v-model="amount3" id="amount3" placeholder=" " />
        <label for="amount3">Karta to'lov miqdori</label>
        <img src="/img/basket/metal.svg" alt="icon" class="floating-input__icon" @click="copyPrice(3)" />
      </div>

      <div class="floating-input">
        <input type="number" v-model="amount4" id="amount4" placeholder=" " disabled />
        <label for="amount4">Qaytim</label>
      </div>
    </div>
  </Modal>

  <MarkingModal
    :isDanger="updateModalValue"
    v-model:show="showModal"
    :item="currentItem ?? {}"
    @confirm="handleConfirm"
    :activeProductBarcode="activeProductBarcode"
    @update:activeProductBarcode="updateBarcode"
  />
</template>
<style lang="scss">
.basket {
  // max-width: 528px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 16px;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;

  &-empty {
    color: #71899e;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 23.4px;
    letter-spacing: -0.36px;
    padding: 64px 0px;
  }

  &-modal {
    display: flex;
    width: 371px;
    padding: 16px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 18px 40px 0px rgba(112, 144, 176, 0.12);
    z-index: 5;
    position: absolute;
    top: 120%;
    right: 0;

    &__backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.64);
      z-index: 4;
    }
    &__header {
      display: flex;
      align-items: flex-start;
      gap: 19px;
      &-icon {
        border-radius: 50%;
      }
      &-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        flex: 1 0 0;
      }
      &-name {
        margin: 0;
        color: #010101;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0.64px;
      }
      &-list {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }
      &-title {
        margin: 0;
        color: #71899e;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.56px;
      }
      &-desc {
        margin: 0;
      }
      &-close {
        display: flex;
        width: 12px;
        height: 12px;
        padding: 12px;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        border: 1px solid #e0e5f2;
        border-radius: 50%;
        position: relative;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
          background: #f1f5fe;
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          background: #010101;
          transition: 0.2s;
        }

        &::before {
          width: 1px;
          height: 12px;
          transform: rotate(45deg);
        }

        &::after {
          width: 12px;
          transform: rotate(45deg);
          height: 1px;
        }
      }
    }
    &__height {
      width: 100%;
      height: 1px;
      background: #e0e5f2;
    }
    &__action {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s;

      &.danger {
        .basket-modal__action-title {
          color: #d32f2f;
        }
      }
      &:hover {
        transition: opacity 0.2s;
        opacity: 0.7;
      }

      &-title {
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        flex: 1 0 0;
        color: #010101;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
      }
    }
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 20px 0;

    margin-bottom: 16px;
    position: relative;

    &__height {
      position: absolute;
      bottom: 0;
      left: -10%;
      height: 1px;
      width: 120%;
      background: #e0e5f2;
    }

    &__title {
      h1 {
        color: #010101;
        font-size: 24px;
        font-weight: 700;
        line-height: 31.2px;
        margin: 0;
      }
      &-subtitle {
        color: #71899e;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
      }
    }
  }
  &-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;

    &__button {
      background: inherit;
      display: flex;
      padding: 12px 14px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      border-radius: 24px;
      border: 1px solid #e0e5f2;

      color: #010101;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      letter-spacing: 0.56px;

      transition: background 0.2s;

      &.green {
        background: #00b241;
        &:hover {
          background: #00b241b7;
        }
      }

      &.checklist {
        background: #00b241;

        img {
          filter: brightness(1.5) invert(1);
        }

        &:hover {
          background: #00b241b7;
        }
      }

      &:hover {
        background: #f8fafc;
      }
    }

    &__avatar {
      flex-shrink: 0;
      cursor: pointer;
      &.active {
        z-index: 5;
        border-radius: 100%;
        outline: 2px solid #fff;
      }
      img {
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
  &-items {
    height: 51%;
    max-height: 52%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    align-self: stretch;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      background-color: #f4f7fe;
    }

    &::-webkit-scrollbar:horizontal {
      height: 12px;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f4f7fe;
      height: 20px;
    }
    &::-webkit-scrollbar {
      height: 12px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 20px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #c6d0d8;
    }
  }
  &-item {
    display: flex;
    padding: 12px;
    align-items: center;
    gap: 12px;

    border-radius: 20px;
    background: #f4f7fe;

    &.deleting {
      opacity: 0;
      animation: slide-left 0.5s ease-in-out forwards;
    }

    &__image {
      width: 80px;
      height: 80px;
      border-radius: 8px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &__delete {
      display: flex;
      width: 40px;
      height: 35px;
      padding: 4px;
      justify-content: center;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      border-radius: 99px;
      border: 1px solid #e0e5f2;
      background: #fff;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.6;
      }

      img {
        display: flex;
        padding: 1.042px 2.708px;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }
    }

    &__details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
      flex: 1 0 0;

      &-title {
        margin: 0;
        color: #010101;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.56px;
      }
      &-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        align-self: stretch;
      }

      &-codes {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }

      &-code {
        color: #71899e;
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: 16.8px;
        cursor: pointer;
      }
      img {
        cursor: pointer;
      }

      &-height {
        width: 1px;
        height: 18px;
        background: #71899e;
      }

      &-controls {
        display: flex;
        gap: 4px;
      }

      &-price {
        font-weight: 600;
      }

      &-button {
        display: flex;
        height: 32px;
        padding: 0px 8px;
        justify-content: center;
        align-items: center;
        gap: 8px;

        border-radius: 16px;
        border: 1px solid #e0e5f2;
        background: #fff;

        &:first-child {
          .basket-item__details-subtitle {
            width: 35px;
          }
        }
        .blue-circle {
          color: #3b82f6;
        }
      }
      &-subtitle {
        color: #010101;
        font-size: 12px;
        font-weight: 400;
        line-height: 19.6px;

        white-space: nowrap;
        text-overflow: ellipsis;
        border: none;
        outline: none;

        &[type="number"]::-webkit-inner-spin-button,
        &[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }
      &-minus {
        display: flex;
        width: 12px;
        height: 12px;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;

        border-radius: 50%;
        position: relative;
        cursor: pointer;

        &::after {
          content: "";
          position: absolute;
          background: #010101;
          transition: 0.2s;
        }

        &::after {
          width: 12px;
          height: 1px;
        }
      }
      &-plus {
        display: flex;
        width: 12px;
        height: 12px;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;

        border-radius: 50%;
        position: relative;
        cursor: pointer;

        &::before,
        &::after {
          content: "";
          position: absolute;
          background: #010101;
          transition: 0.2s;
        }

        &::before {
          width: 1px;
          height: 12px;
        }

        &::after {
          width: 12px;
          height: 1px;
        }
      }

      &-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  &-summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    &__icon {
      position: absolute;
      bottom: 6%;
      left: 0;

      width: 100%;
      height: auto;
      pointer-events: none;
    }
    &__height {
      position: relative;
      width: 100%;
      height: 1px;
      background: #e0e5f2;
    }
    &__actions {
      display: flex;
      gap: 10px;
      position: relative;
      width: 100%;

      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    &__action {
      width: 160px;
      padding: 8px;
      display: flex;
      border-radius: 10px;
      background: #f1f5fe;
      align-items: flex-start;
      justify-content: space-between;
      transition: all 0.4s;
      gap: 8px;
      flex: 0 0 auto;

      &-title {
        margin: 0;
      }
      &-price {
        max-width: 105px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        color: #010101;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
      }
      &-wrapper {
        display: flex;
        flex-direction: column;
        gap: 2px;

        color: #010101;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
      }
      &-plus {
        display: flex;
        width: 18px;
        height: 18px;
        padding: 20px;
        justify-content: center;
        align-items: center;
        gap: 12px;
        border: none;
        outline: none;
        border-radius: 50%;
        background: #00b241;
        position: relative;
        cursor: pointer;

        &::before,
        &::after {
          content: "";
          position: absolute;
          background: #fff;
          transition: 0.2s;
        }

        &::before {
          width: 1.6px;
          height: 18px;
        }

        &::after {
          width: 18px;
          height: 1.6px;
        }

        &:hover {
          background: #16a34a;
        }
      }
    }

    &__wave {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    &__row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #64748b;
      font-size: 14px;

      &.total {
        color: #0f172a;
        font-weight: 600;
        font-size: 16px;
      }
    }

    &__button {
      width: 110%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      background: #22c55e;
      color: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      z-index: 1;

      position: absolute;
      bottom: 0;
      left: -3%;

      &:hover {
        background: #16a34a;
      }
    }

    &__financial {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      align-self: stretch;
      position: relative;
    }
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: 100%;

      &-label {
        color: #40566a;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.8px;
      }

      &.total {
        .basket-summary__row-label {
          color: #010101;
          font-size: 18px;
          font-weight: 600;
          line-height: 23.4px;
          letter-spacing: -0.36px;
        }

        .basket-summary__container-amount {
          color: #010101;
          font-size: 18px;
          font-weight: 600;
          line-height: 23.4px;
          letter-spacing: -0.36px;
        }
        .basket-summary__container-currency {
          color: #71899e;
          font-size: 18px;
          font-weight: 600;
          line-height: 23.4px;
          letter-spacing: -0.36px;
        }
      }
    }
    &__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      &-amount {
        color: #40566a;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.8px;
      }

      &-currency {
        color: #71899e;
        text-align: right;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.8px;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.form {
  &-group {
    position: relative;
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    &__input {
      display: flex;
      width: 345px;
      height: 56px;
      padding: 0px 45px 0 16px;
      justify-content: center;
      align-items: center;
      border-radius: 16px;
      border: 1px solid #e0e5f2;
      background: #fff;

      &:focus {
        outline: none;
        border-color: #10b981;
      }
      &[type="number"]::-webkit-inner-spin-button,
      &[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
      }
    }
    &__icon {
      position: absolute;
      right: 5%;
      top: 30%;
    }
  }
  &-calc {
    display: flex;
    padding: 4px;
    align-items: center;
    gap: 4px;
    border-radius: 99px;
    background: #f4f7fe;
    transition: all 0.2s;
    &__percantage {
      border: none;
      outline: none;
      border-radius: 24px;
      display: flex;
      padding: 16px 24px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      color: #010101;
      font-size: 12px;
      line-height: 16.8px;
      font-weight: 600;
      cursor: pointer;

      &.active {
        border-radius: 999px;
        outline: 1px solid #0087dd;
        color: #0087dd;
      }
    }
  }
}

.form-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.floating-input {
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;

  &__icon {
    position: absolute;
    top: 35%;
    right: 3%;
    cursor: pointer;
  }

  input {
    width: 345px;
    padding: 25px 16px 6px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: transparent;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;

    &:disabled {
      background: #cccccc36;
    }

    &:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }

  label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #6b7280;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    top: 4px;
    transform: translateY(0);
    font-size: 12px;
    color: #10b981;
  }

  input:focus:not(:focus-visible) {
    outline: none;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
