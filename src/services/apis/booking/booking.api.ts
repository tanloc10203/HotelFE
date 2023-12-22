import ServiceCommon from "~/helpers/serviceCommon";
import instance from "~/services/axios/config.axios";
import { BookingDeskTopPayload, SuccessResponseProp } from "~/types";

class BookingAPI extends ServiceCommon {
  bookingDesktop = async (data: BookingDeskTopPayload) => {
    const { metadata }: SuccessResponseProp<string> = await instance.post(
      `${this.getPrefix}/BookingDesktop`,
      data
    );

    return metadata;
  };

  receiveRoomDesktop = async (data: BookingDeskTopPayload) => {
    const { metadata }: SuccessResponseProp<string> = await instance.post(
      `${this.getPrefix}/ReceiveRoomDesktop`,
      data
    );

    return metadata;
  };
}

export default new BookingAPI("/Bookings");
