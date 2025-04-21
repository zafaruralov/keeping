<script setup>
import iconEyeClose from "~/public/img/login/icon-eyeclose.svg";
import iconEye from "~/public/img/login/icon-eye.svg";

definePageMeta({
  middleware: "guest"
});

const router = useRouter();
const { login } = useAuth();
const userStore = useUserInfo();
const mutation = useMutate("v1/receipt/check-commitent", "post");

async function checkCommitent() {
  const data = await mutation.mutateAsync({});
  return data.data;
}

const data = reactive({
  username: "",
  password: ""
});

const errors = reactive({
  username: "",
  password: "",
  message: ""
});

const passwordOptions = reactive({
  status: iconEyeClose,
  type: "password"
});

const isLoading = ref(false);

async function dynamicLoginSubmit() {
  errors.username = !data.username;
  errors.password = !data.password;

  if (!errors.username && !errors.password) {
    loginSubmit();
  }
}

const togglePassword = () => {
  if (passwordOptions.type === "password") {
    passwordOptions.type = "text";
    passwordOptions.status = iconEye;
  } else {
    passwordOptions.type = "password";
    passwordOptions.status = iconEyeClose;
  }
};

const loginSubmit = async () => {
  isLoading.value = true;
  try {
    await login({ username: data.username, password: data.password });

    const commitment = await checkCommitent();
    if (!commitment) {
      alert("Please pay bills");
    } else {
      //   await getUserInfo();
      router.push("/");
    }
  } catch (e) {
    if (e.status === 401) {
      errors.message = "Bunday foydalanuvchi topilmadi";
    }

    throw new Error("Error with login submission", e);
  } finally {
    isLoading.value = false;
  }
};

// const getUserInfo = ({ token }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { data } = await http.get("/user-info", {
//         headers: { Authorization: "Bearer " + token }
//       });
//       userStore.setUserInfo(data.data);
//       localStorage.setItem("user-info", JSON.stringify(data.data));

//       resolve(data.data);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
</script>

<template>
  <div class="loginp">
    <div class="loginp__body">
      <div class="loginp__body-content">
        <div class="loginp__titling">
          <p class="loginp__titling-desc">Kirish</p>
        </div>

        <div class="loginp__form">
          <div class="loginp__otp active">
            <div class="loginp__input" :class="{ error: errors.username }">
              <label>
                <img class="loginp__input-icon" src="/img/login/icon-user.svg" alt="login" />
                <input
                  v-model="data.username"
                  class="loginp__input-input"
                  type="text"
                  v-on:keyup.enter="dynamicLoginSubmit"
                />
                <span :class="{ filled: data.username }" class="loginp__input-placeholder"> username </span>
              </label>
            </div>
            <div class="loginp__input" :class="{ error: errors.password }">
              <label>
                <input
                  v-model="data.password"
                  class="loginp__input-input"
                  :type="passwordOptions.type"
                  v-on:keyup.enter="dynamicLoginSubmit"
                />
                <img class="loginp__input-icon" src="/img/login/icon-password.svg" alt="login" />
                <span class="loginp__input-placeholder" :class="{ filled: data.password }"> password </span>
                <button @click="togglePassword" class="loginp__input-eye">
                  <img class="loginp__input-eyeicon" :src="passwordOptions.status" alt="login" />
                </button>
              </label>
            </div>

            <button @click="dynamicLoginSubmit" class="cbutton">
              <p v-if="!isLoading" class="cbutton__text">enter</p>
              <p v-else class="cbutton__text">Loading...</p>
            </button>

            <div class="loginp__alert error" v-if="errors.message">
              <p class="loginp__alert--text">{{ errors.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$duration: 0.3s;
$stagger: 0.5s;
$interval: calc(($duration) - ($stagger));

.fade {
  animation-name: fadeInDown;
  animation-duration: $duration;
  animation-fill-mode: forwards;
  animation-delay: calc(($interval) * var(--i));
}

.loginp {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-direction: column;
  overflow: hidden;
  transition: 0.3s;

  &__form {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  &__otp {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    display: flex;
    gap: 15px;
    flex-direction: column;
    align-items: center;
  }

  &::after {
    animation: bganimate 3s linear infinite;
    background: linear-gradient(311.76deg, #489aff -20.24%, #ffffff 65%);
    position: absolute;
    z-index: -1;
    content: "";
    top: calc(50% - 125vh);
    left: calc(50% - 125vw);
    width: 250vw;
    height: 250vh;
    transform: scale(1.5);
  }

  &__body {
    background: #ffffff;
    box-shadow: 0px 36px 81px -37px rgba(33, 123, 244, 0.36);
    border-radius: 6px;
    padding: 0 35px 30px;
    width: 450px;

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
  }

  &__logo {
    width: 180px;
    display: flex;
    object-fit: contain;
  }

  &__titling {
    width: 100%;
    padding-bottom: 12px;
    margin-bottom: 12px;
    text-transform: capitalize;
    border-bottom: 1px solid rgba(214, 214, 214, 0.5);

    // &-title {
    //   font-weight: 450;
    //   font-size: 18px;
    //   line-height: 120%;
    //   color: $text-color;
    //   text-align: center;
    // }

    &-desc {
      font-weight: 500;
      font-size: 28px;
      color: #212121;
      text-align: center;
    }
  }

  &__input {
    width: 100%;
    position: relative;
    height: 50px;
    border: 1px solid #ececec;
    border-radius: 3.5px;
    transition: 0.3s;

    &:has(input:focus) {
      border-color: #217bf4;

      .loginp__input-placeholder {
        top: 0;
        left: 50px;
        font-size: 12px;
        color: #217bf4;
      }

      .loginp__input-icon,
      .loginp__input-eye {
        filter: revert;
      }

      &::after {
        background: #217bf4;
      }
    }

    &:has(input:-webkit-autofill) {
      .loginp__input-placeholder {
        left: 50px;
        top: 0;
        background: #ffffff;
        font-size: 12px;
      }
    }

    &.error {
      border-color: #e31919;

      .loginp__input-placeholder {
        color: #e31919;
      }

      .loginp__input-icon,
      .loginp__input-eye {
        filter: hue-rotate(140deg);
      }

      &::after {
        background: #e31919;
      }
    }

    &.success {
      border-color: #04ba00;

      .loginp__input-placeholder {
        color: #04ba00;
      }

      .loginp__input-icon,
      .loginp__input-eye {
        filter: hue-rotate(263deg);
      }

      &::after {
        background: #04ba00;
      }
    }

    &-icon {
      position: absolute;
      width: 20px;
      height: 20px;
      display: flex;
      object-fit: contain;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
      filter: grayscale(1);
      // transition: 0.3s;
    }

    &-input {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      right: 0;
      left: 60px;
      background: none;
      outline: none;
      border: 0;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      color: #212121;

      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      }
    }

    &-placeholder {
      padding: 5px 10px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      color: #d2d2d2;
      border-radius: 3.5px;
      position: absolute;
      z-index: 2;
      background: #ffffff;
      top: 50%;
      transform: translateY(-50%);
      left: 50px;
      transition: 0.3s;

      &.filled {
        left: 50px;
        top: 0;
        font-size: 12px;
      }
    }

    &-eye {
      position: absolute;
      z-index: 2;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 5px;
      bottom: 5px;
      width: 40px;
      right: 0;
      // background: none;
      border: 0;
      outline: none;
      cursor: pointer;
      border-radius: 50px;
      transition: 0.3s;
      filter: grayscale(1);

      &:hover {
        opacity: 0.7;
      }

      img {
        width: 20px;
        height: 20px;
        display: flex;
        object-fit: contain;
      }
    }

    &::after {
      height: 20px;
      width: 1px;
      display: flex;
      transition: 0.3s;
      content: "";
      position: absolute;
      z-index: 3;
      top: 50%;
      transform: translateY(-50%);
      left: 50px;
      background: #ececec;
    }

    &:has(:last-child) {
      margin-top: 0.5rem;
    }
  }

  &__separator {
    font-weight: 400;
    font-size: 14px;
    text-transform: capitalize;
    text-align: center;
  }

  &__alert {
    width: 100%;
    border-radius: 3.5px;
    padding: 12px 0;
    height: fit-content;

    &.error {
      color: rgba(227, 25, 25);
      border-color: rgba(227, 25, 25);
      background-color: rgba(227, 25, 25, 0.1);
      text-align: center;
    }

    &--text {
      //#alert
      padding: 0 10px;
    }
  }
}

.providers {
  width: 100%;
  margin-top: 25px;
}

.provider {
  width: 100%;
  gap: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.cbox {
  // padding: 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 3.5px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: 0.3s;

  .cbutton__handle {
    position: relative;
  }

  &:hover {
    transition: all 0.2s;
    background: #ececec;
  }

  &.google {
    overflow: hidden;
    position: relative;
    // background: url("/auth/src/assets/icon/providers-icon/google.svg") no-repeat center center/contain;

    & > div {
      filter: opacity(0%);
    }

    & img {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    &:hover {
      background-color: #ececec;
    }
  }
}

.provider__icon {
  width: 30px;
  height: 30px;
  display: flex;
  object-fit: contain;
  transition: 0.3s;
}

.cbutton {
  outline: none;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  position: relative;
  background: #217bf4;
  border-radius: 3.5px;
  transition: 0.3s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: transparent;
    border: 1px solid #217bf4;

    .cbutton__text {
      color: #217bf4;
    }
  }

  &__text {
    font-weight: 400;
    font-size: 15px;
    line-height: 100%;
    transition: 0.3s;
    color: #ffffff;
  }

  &__icon {
    width: 50px;
    height: 50px;
    display: flex;
    object-fit: contain;
    transition: 0.3s;
  }
}

@media (max-width: 576px) {
  .loginp {
    &__logo {
      width: 120px;
    }

    &__body {
      width: calc(100% - 60px);
      padding: 40px;
    }

    &__titling {
      // &-title {
      //   font-size: 12px;
      // }

      &-desc {
        font-size: 20px;
      }
    }

    &__input {
      height: 45px;

      &-icon {
        width: 20px;
        height: 20px;
        left: 10px;
      }

      &-input {
        left: 50px;
      }

      &-eye {
        width: 30px;
        right: 5px;

        img {
          width: 20px;
          height: 20px;
        }
      }

      &-placeholder {
        left: 40px;

        &.filled {
          left: 40px;
          top: 0;
          font-size: 12px;
        }
      }

      &::after {
        left: 40px;
      }

      &:has(input:focus) {
        .loginp__input-placeholder {
          left: 40px;
        }
      }

      &:has(input:-webkit-autofill) {
        .loginp__input-placeholder {
          left: 40px;
        }
      }
    }
  }
}
</style>
