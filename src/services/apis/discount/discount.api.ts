import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import { IDiscount, SuccessResponseProp } from "~/types";

class DiscountAPI extends ServiceCommon {
  getByRoomId = async (roomId: number) => {
    const response: SuccessResponseProp<IDiscount | null> = await axios.get(
      `${this.getPrefix}/Room/${roomId}`
    );

    return response.metadata;
  };
}

export default new DiscountAPI("/Discounts");
