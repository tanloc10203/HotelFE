export const appendArrayData = (formData: FormData, array: any[], key: string) => {
  const length = array.length;

  for (let index = 0; index < length; index++) {
    const element = array[index];
    // @ts-ignore
    formData.append(`${key}[${index}]`, element);
  }

  return formData;
};
