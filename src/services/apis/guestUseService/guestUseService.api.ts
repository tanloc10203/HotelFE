import ServiceCommon from "~/helpers/serviceCommon";
import instance from "~/services/axios/config.axios";
import { SuccessResponseProp } from "~/types";
import {
  GuestUseServiceType,
  GuestUseServicesPlusMinusPayload,
} from "~/types/guestUseServices.type";

class GuestUseServicesAPI extends ServiceCommon {
  plusMinus = async ({ data, guestUseServiceId }: GuestUseServicesPlusMinusPayload) => {
    const response: SuccessResponseProp<GuestUseServiceType[]> = await instance.patch(
      `${this.prefix}/PlusMinus/${guestUseServiceId}`,
      data
    );

    return response.metadata;
  };
}

export default new GuestUseServicesAPI("/GuestUseServices");
