import ServiceCommon from "~/helpers/serviceCommon";
import instance from "~/services/axios/config.axios";
import {
  QuantityBookingState,
  RateBookingState,
  RoomTypeMoneyState,
  ServiceMoneyResponse,
  SuccessResponseProp,
} from "~/types";

class ReportAPI extends ServiceCommon {
  public RateBooking = async (date: string) => {
    const response: SuccessResponseProp<RateBookingState, { dateStart: string; dateEnd: string }> =
      await instance.get(`${this.prefix}/RateBooking`, {
        params: { dateStart: date, dateEnd: date },
      });

    return response.metadata;
  };

  public QuantityBooking = async (date: string) => {
    const response: SuccessResponseProp<
      QuantityBookingState,
      { dateStart: string; dateEnd: string }
    > = await instance.get(`${this.prefix}/QuantityBooking`, {
      params: { dateStart: date, dateEnd: date },
    });

    return response.metadata;
  };

  public RoomTypeMoney = async (date: string) => {
    const response: SuccessResponseProp<RoomTypeMoneyState, { date: string }> = await instance.get(
      `${this.prefix}/RoomTypeMoney`,
      {
        params: { date },
      }
    );

    return response.metadata;
  };

  public ServiceMoney = async (dateStart: string, dateEnd: string) => {
    const response: SuccessResponseProp<ServiceMoneyResponse> = await instance.get(
      `${this.prefix}/ServiceMoney`,
      {
        params: { dateStart, dateEnd },
      }
    );

    return response.metadata;
  };
}

export default new ReportAPI("/Reports");
