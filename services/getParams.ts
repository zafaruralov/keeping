export const getParams = (data: Record<string, any> = {}): Record<string, any> => {
  const params: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if ((value && value.value && value.value !== "all") || value.value === 0) {
      params[key] = value.value;
    } else if (value !== undefined && value !== "all") {
      params[key] = value.value;
    }
  }
  return params;
};
