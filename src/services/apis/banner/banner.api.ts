import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import { SuccessResponseProp } from "~/types";

class BannerAPI extends ServiceCommon {
  postForm = async (files: FileList) => {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append(`images`, file);
    });

    const response: SuccessResponseProp<boolean> = await axios.post(`${this.getPrefix}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
    });

    return response.metadata;
  };
}

export default new BannerAPI("/Banners");
