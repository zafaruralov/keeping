import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "~/types/type";

export const useUserInfo = defineStore("user", () => {
  const userInfo = ref<User | any>({});

  function loadUserFromStorage() {
    const user = localStorage.getItem("user-info");
    if (user) {
      userInfo.value = JSON.parse(user);
    }
  }

  function setUserInfo(data: User) {
    userInfo.value = data;
    localStorage.setItem("user-info", JSON.stringify(data));
  }

  const fullName = computed(() => userInfo.value.fullName ?? "");

  return { userInfo, fullName, setUserInfo, loadUserFromStorage };
});
