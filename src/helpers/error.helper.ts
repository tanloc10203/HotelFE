export const isErrorAxios = (error: any) => {
  return Boolean(error?.response?.data?.message);
};

export const messageAxios = (error: any): string => error.response.data.message;

export const messageErrorAxios = (error: any): string => {
  let message = error?.message;
  if (isErrorAxios(error)) message = messageAxios(error);
  return message;
};
