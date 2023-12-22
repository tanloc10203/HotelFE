import ServiceCommon from "~/helpers/serviceCommon";
import instance from "~/services/axios/config.axios";
import { CustomerPayload, SuccessResponseProp } from "~/types";

class CustomerAPI extends ServiceCommon {
  addFromFrontDesk = async (payload: CustomerPayload) => {
    const { metadata }: SuccessResponseProp<string> = await instance.post(
      `${this.getPrefix}/AddFromFrontDesk`,
      payload
    );

    return metadata;
  };
}

export default new CustomerAPI("/Customers");
