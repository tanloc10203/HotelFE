export const isUnauthorizedError = (error: any) => error?.response?.status === 401;

export const isAuthOwner = (config: any): boolean => {
  const { url } = config;
  return url?.toLowerCase()?.includes("owner");
};

export const dayNow = () => {
  const date = new Date();
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
