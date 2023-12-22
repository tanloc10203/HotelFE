import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import { SuccessResponseProp } from "~/types";

class PriceListsAPI extends ServiceCommon {
  public postDiscount = async <Data>(data: Data): Promise<Data> => {
    const response: SuccessResponseProp<Data> = await axios.post(`${this.prefix}/Discount`, data);
    return response.metadata;
  };

  public patchDiscount = async <Data>(id: number | string, data: Data): Promise<Data> => {
    const response: SuccessResponseProp<Data> = await axios.patch(
      `${this.prefix}/Discount/${id}`,
      data
    );
    return response.metadata;
  };
}

export default new PriceListsAPI("/PriceLists");
