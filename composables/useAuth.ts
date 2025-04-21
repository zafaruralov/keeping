export const useAuth = () => {
  const token = useCookie("token", { maxAge: 60 * 60 * 24 * 7 });

  const login = async ({ username, password }: { username: string; password: string }) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const { $api } = useApi();

    const res = await $api<{ data: { access_token: string } }>("/login", {
      method: "POST",
      body: params,
      headers: {
        "device-id": navigator.userAgent
      }
    });

    token.value = res.data.access_token;
  };

  const logout = () => {
    token.value = null;
    navigateTo("/");
  };

  const isLoggedIn = computed(() => !!token.value);

  return {
    token,
    login,
    logout,
    isLoggedIn
  };
};
