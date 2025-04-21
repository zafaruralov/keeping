<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" data-testid="modal-overlay" @click="closeOnOverlay">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <img :src="Close" alt="x-icon" />
            </button>
          </div>

          <div class="modal-content">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" @click="$emit('update:modelValue', false)">
              {{ cancelText }}
            </button>
            <button class="modal-btn modal-btn-primary" @click="$emit('confirm')">
              <p class="modal-btn__text" v-if="!loading">
                {{ confirmText }}
              </p>
              <div class="spinner" v-else></div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Close from "/img/modal/close.svg";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  loading: {
    required: false,
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  cancelText: {
    type: String,
    default: "Chiqish"
  },
  confirmText: {
    type: String,
    default: "Confirm"
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const closeOnOverlay = (e: MouseEvent) => {
  if (props.closeOnOutsideClick) {
    emit("update:modelValue", false);
  }
};
const closeOnEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("update:modelValue", false);
  }
};

onMounted(() => {
  document.addEventListener("keydown", closeOnEsc);
});

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEsc);
});
</script>

<style lang="scss" scoped>
$primary-color: #10b981;
$transition-duration: 0.2s;

.modal {
  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 8;
  }

  &-container {
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 24px;
    border: 1px solid #e0e5f2;
    background: #fff;

    max-width: 500px;
    // max-height: 90vh;
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &-title {
    margin: 0;
    color: #010101;
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
  }

  &-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #6b7280;
    transition: color $transition-duration;

    &:hover {
      color: #374151;
    }
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 0 0 0;
  }

  &-btn {
    display: flex;
    padding: 16px 32px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: all $transition-duration;
    cursor: pointer;
    border: none;
    width: 120px;

    &__text {
      margin: 0;
    }
    &-primary {
      border-radius: 24px;
      background: #00b241;
      color: #fff;

      &:hover {
        background-color: darken($primary-color, 5%);
      }
    }

    &-secondary {
      border-radius: 24px;
      border: 1px solid #e0e5f2;
      &:hover {
        background-color: #f3f4f6;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-duration;

  .modal-container {
    transition: transform $transition-duration;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9);
  }
}
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #226bd2;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin: 0;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
