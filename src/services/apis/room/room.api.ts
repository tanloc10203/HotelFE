import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import {
  AddGuestStayInformationPayload,
  ChangeRoomPayload,
  CheckInPayload,
  CheckoutPayload,
  FrontDesk,
  FrontDeskTimeline,
  GetChangeRoomsQuery,
  GetCustomerBooked,
  GetCustomerBookedPayload,
  IBookingDetail,
  IRoomPrice,
  InformationRoomDetails,
  RoomAddDiscount,
  RoomPayloadAdd,
  RoomsAvailableDesktop,
  SearchingAvailableDesktopPayload,
  SuccessResponseProp,
} from "~/types";

class RoomAPI extends ServiceCommon {
  getListPrices = async (roomId: number) => {
    const response: SuccessResponseProp<IRoomPrice[]> = await axios.get(
      `${this.getPrefix}/listPrices/${roomId}`
    );
    return response.metadata;
  };

  postFormData = async (data: RoomPayloadAdd) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof RoomPayloadAdd;

      if (key === "photo_publish") {
        formData.append(`${key}`, data[key]);
      } else if (key === "beds" || key === "room_numbers") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<RoomPayloadAdd> = await axios.post(
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

  patchFormData = async (data: RoomPayloadAdd) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof RoomPayloadAdd;

      if (key === "photo_publish") {
        formData.append(`${key}`, data[key]);
      } else if (key === "beds" || key === "room_numbers") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] as string);
      }
    });

    const response: SuccessResponseProp<RoomPayloadAdd> = await axios.patch(
      `${this.getPrefix}/${data.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };

  addDiscount = async (data: RoomAddDiscount) => {
    const response: SuccessResponseProp<number> = await axios.post(
      `${this.getPrefix}/addDiscount`,
      data
    );
    return response.metadata;
  };

  getFrontDesk = async () => {
    const response: SuccessResponseProp<FrontDesk[]> = await axios.get(
      `${this.getPrefix}/FrontDesk`
    );
    return response.metadata;
  };

  getFrontDeskTimeline = async (payload: { startDate: string; endDate: string }) => {
    const response: SuccessResponseProp<FrontDeskTimeline[]> = await axios.get(
      `${this.getPrefix}/FrontDeskTimeline`,
      { params: payload }
    );
    return response.metadata;
  };

  getAvailableDesktop = async (data: SearchingAvailableDesktopPayload) => {
    const response: SuccessResponseProp<RoomsAvailableDesktop[]> = await axios.post(
      `${this.getPrefix}/searchingAvailableDesktop`,
      data
    );
    return response.metadata;
  };

  getChangeRooms = async (query: GetChangeRoomsQuery) => {
    const response: SuccessResponseProp<RoomsAvailableDesktop[]> = await axios.get(
      `${this.getPrefix}/GetChangeRooms`,
      { params: query }
    );
    return response.metadata;
  };

  changeRoom = async (data: ChangeRoomPayload) => {
    const response: SuccessResponseProp<boolean> = await axios.post(
      `${this.getPrefix}/ChangeRoom`,
      data
    );
    return response.metadata;
  };

  getCustomerByRoomNumber = async (data: GetCustomerBookedPayload) => {
    const response: SuccessResponseProp<GetCustomerBooked[]> = await axios.get(
      `${this.getPrefix}/getCustomerByRoomNumber`,
      { params: data }
    );
    return response.metadata;
  };

  checkIn = async (data: CheckInPayload) => {
    const response: SuccessResponseProp<GetCustomerBooked[]> = await axios.post(
      `${this.getPrefix}/CheckInRooms`,
      data
    );
    return response.metadata;
  };
  addGuestStayInformation = async (data: AddGuestStayInformationPayload) => {
    const response: SuccessResponseProp<GetCustomerBooked[]> = await axios.post(
      `${this.getPrefix}/AddGuest`,
      data
    );
    return response.metadata;
  };

  getInformationRoom = async (bookingDetailsID: string) => {
    const response: SuccessResponseProp<InformationRoomDetails> = await axios.get(
      `${this.getPrefix}/InformationDetailsRoom/${bookingDetailsID}`
    );
    return response.metadata;
  };

  checkOut = async (bookingDetailsID: string, data: CheckoutPayload) => {
    const response: SuccessResponseProp<InformationRoomDetails> = await axios.post(
      `${this.getPrefix}/CheckOut/${bookingDetailsID}`,
      data
    );
    return response.metadata;
  };

  cleanupRoom = async (bookingDetailsID: string) => {
    const response: SuccessResponseProp<boolean> = await axios.post(
      `${this.getPrefix}/Cleanup/${bookingDetailsID}`
    );
    return response.metadata;
  };

  getInfoInDetailsBooking = async (bookingDetailsId: string) => {
    const response: SuccessResponseProp<IBookingDetail> = await axios.get(
      `${this.getPrefix}/InfoDetails/${bookingDetailsId}`
    );

    return response.metadata;
  };
}

export default new RoomAPI("/Rooms");
