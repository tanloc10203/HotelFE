import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import { IRoomTypePayload, IRoomTypePayloadEdit, SuccessResponseProp } from "~/types";

class RoomTypeAPI extends ServiceCommon {
  public postAdd = async (data: IRoomTypePayload): Promise<IRoomTypePayload> => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IRoomTypePayload;

      if (key === "images") {
        const length = data[key]!.length;

        for (let index = 0; index < length; index++) {
          const element = data[key]![index];
          formData.append(`${key}`, element);
        }
      } else if (key === "amenities" || key === "equipments") {
        formData.append(key, JSON.stringify(data[key]));
      } else formData.append(key, data[key] as string);
    });

    const response: SuccessResponseProp<IRoomTypePayload> = await axios.post(
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

  public patchEdit = async (
    data: IRoomTypePayloadEdit,
    id: number
  ): Promise<IRoomTypePayloadEdit> => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IRoomTypePayloadEdit;

      if (key === "images") {
        const length = data[key]!.length;

        for (let index = 0; index < length; index++) {
          const element = data[key]![index];
          formData.append(`${key}`, element);
        }
      } else if (key === "amenities" || key === "equipments" || key === "removeImages") {
        formData.append(key, JSON.stringify(data[key]));
      } else formData.append(key, data[key] as string);
    });

    const response: SuccessResponseProp<IRoomTypePayloadEdit> = await axios.patch(
      `${this.getPrefix}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      }
    );

    return response.metadata;
  };

  // public restore = async (id: number) => {
  //   const response: SuccessResponseProp<boolean> = await axios.post(`${this.prefix}/Restore/${id}`);
  //   return response.metadata;
  // };

  // public deleteInTrash = async (id: number) => {
  //   const response: SuccessResponseProp<boolean> = await axios.post(
  //     `${this.prefix}/TruncateTrash/${id}`
  //   );
  //   return response.metadata;
  // };
}

export default new RoomTypeAPI("/RoomTypes");
