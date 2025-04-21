<template>
  <div class="popular">
    <div v-for="n in filteredItems" :key="n.id" class="popular-card">
      <div class="popular-card__image">
        <span class="popular-card__image-badge"
          >32
          <img src="/img/popular/badge.svg" alt="badge product" />
        </span>
        <img :src="n.image" alt="Bread product" class="popular-card__image-icon" />
      </div>
      <div class="popular-info">
        <p class="popular-info__title">{{ n.name }}</p>
        <div class="popular-info__row">
          <div class="popular-info__row-wrapper">
            <span class="popular-info__row-price">{{ n.price }} сум</span>
            <span class="popular-info__row-label">{{ n.unit_name }}</span>
          </div>
          <button class="popular-info__row-add btn" @click="addFrequentItemToBasket(n)" @keydown.enter.prevent></button>
        </div>
      </div>
    </div>
    <div id="load-trigger"></div>
  </div>

  <MarkingModal
    v-model:show="showModal"
    :item="currentItem ?? {}"
    @confirm="handleConfirm"
    :activeProductBarcode="activeProductBarcode"
    @update:activeProductBarcode="updateBarcode"
  />
</template>

<script setup lang="ts">
const card = useCardItemStore();
const { currentItem, activeProductBarcode, showModal, triggerModal, handleConfirm } = useModal();

defineProps<{ filteredItems: FrequentItem[] }>();

function addFrequentItemToBasket(item: FrequentItem) {
  if (item.is_marking) {
    triggerModal(item, false);
  } else {
    card.setItemCard(item);
  }
}

function updateBarcode(barcode: string[]) {
  activeProductBarcode.value = barcode;
}
</script>

<style lang="scss">
.popular {
  display: flex;
  align-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  padding: 0 20px 20px 0;

  &-section {
    height: 85%;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 20px;

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

  &-card {
    display: flex;
    width: 216px;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    border-radius: 20px;
    border: 1px solid #e0e5f2;
    background: #fff;

    &__image {
      display: flex;
      justify-content: center;

      height: 119px;
      align-self: stretch;
      border-radius: 16px;
      border: 1px solid #e0e5f2;
      background: #f4f7fe;
      position: relative;

      &-icon {
        height: 119px;
        object-fit: contain;
      }

      &-badge {
        display: inline-flex;
        padding: 8px;
        align-items: center;
        gap: 2px;
        border-radius: 12px;
        background: #fff;
        position: absolute;
        bottom: 4%;
        left: 4%;

        color: #010101;
        font-size: 12px;
        font-weight: 500;
        line-height: 16.8px;
        letter-spacing: 0.48px;
      }
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    &__title {
      color: #010101;
      font-size: 14px;
      font-weight: 400;
      line-height: 19.6px;
      margin: 0;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      display: inline-block;
    }

    &__row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      justify-content: space-between;

      &-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      &-price {
        color: #010101;
        font-size: 16px;
        font-weight: 500;
        line-height: 22.4px;
        letter-spacing: 0.64px;
      }

      &-label {
        color: #71899e;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
      }

      &-add {
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
  }
}
.warehouse {
  width: 100%;
  &-modal {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    width: 345px;

    &__subtitle {
      display: flex;
      padding: 16px;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      align-self: stretch;
      border-radius: 10px;
      background: #f4f7fe;

      &.danger {
        background: #dc3545;
      }

      &-title {
        color: #010101;
        text-align: center;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 16.8px;
        margin: 0;
        align-self: stretch;
      }
      &-desc {
        color: #0087dd;
        text-align: center;
        font-size: 13px;
        font-style: normal;
        font-weight: 700;
        line-height: 16.8px;
        margin: 0;
        align-self: stretch;
      }
    }
    &__wrapper {
      gap: 12px;
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: scroll;
      height: 410px;

      &::-webkit-scrollbar {
        display: none;
      }
    }
    &__input {
      position: relative;
      width: 100%;
      display: flex;

      &-text {
        height: 56px;
        width: 100%;
        padding: 0px 16px 0 33px;

        border-radius: 16px;
        border: 1px solid #e0e5f2;
        background: #f4f7fe;
      }
      &-img {
        position: absolute;
        left: 3%;
        top: 33%;
      }
    }
  }
}

@media (max-width: 992px) {
  .popular {
    gap: 12px;

    &-section {
      height: 500px;
      gap: 16px;
    }

    &-card {
      width: 180px;
      padding: 10px;
      gap: 10px;

      &__image {
        height: 100px;

        &-badge {
          font-size: 10px;
        }
      }
    }

    &-info {
      gap: 3px;

      &__title {
        font-size: 12px;
      }

      &__row {
        gap: 12px;

        &-price {
          font-size: 14px;
        }

        &-label {
          font-size: 12px;
        }

        &-add {
          width: 16px;
          height: 16px;
          padding: 12px;

          &::before {
            height: 16px;
          }

          &::after {
            width: 16px;
          }
        }
      }
    }
  }
}
</style>
