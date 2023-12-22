import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import { IServicePayload, ProductPayload, SuccessResponseProp } from "~/types";

class ServicesAPI extends ServiceCommon {
  postFormData = async (data: IServicePayload) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IServicePayload;

      if (key === "photo_public") {
        formData.append(`${key}`, data[key] as string);
      } else if (key === "units") {
        formData.append(`${key}`, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<IServicePayload> = await axios.post(
      this.getPrefix,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };

  patchFormData = async (id: string, data: IServicePayload) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IServicePayload;

      if (key === "photo_public") {
        formData.append(`${key}`, data[key] as string);
      } else if (key === "units") {
        formData.append(`${key}`, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<IServicePayload> = await axios.patch(
      `${this.getPrefix}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };

  postFormDataProduct = async (data: ProductPayload) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ProductPayload;

      if (key === "photo_public") {
        formData.append(`${key}`, data[key] as string);
      } else if (key === "units" || key === "attributes") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<number> = await axios.post(
      `${this.getPrefix}/AddProduct`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };

  patchFormDataProduct = async (id: string, data: ProductPayload) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ProductPayload;

      if (key === "photo_public") {
        formData.append(`${key}`, data[key] as string);
      } else if (key === "units" || key === "attributes") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<number> = await axios.patch(
      `${this.getPrefix}/UpdateProduct/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };
}

export default new ServicesAPI("/Services");
