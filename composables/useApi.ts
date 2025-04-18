export const useApi = () => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const { token } = useAuth();

  const coreApi = config.public.coreApi;
  const authApi = config.public.authApi;

  const authUrls = ["/login", "/user-info"];

  const getBaseURL = (url: string) => (authUrls.some((authUrl) => url.startsWith(authUrl)) ? authApi : coreApi);

  const $api = async <T = any>(
    url: string,
    options: {
      method?: string;
      body?: any;
      query?: Record<string, any>;
      headers?: HeadersInit;
    } = {}
  ): Promise<T> => {
    const baseURL = getBaseURL(url);

    try {
      return await $fetch<T>(url, {
        baseURL,
        method: options.method ?? "GET",
        body: options.body,
        query: options.query,
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token.value}` } : {})
        }
      });
    } catch (error: any) {
      if (error?.status === 401) {
        // localStorage.removeItem("token");
        // router.push("/"); // change it to login
      } else if (error?.status === 500) {
        router.push("/network");
      }

      throw error;
    }
  };

  return { $api };
};
