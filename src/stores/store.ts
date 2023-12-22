import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { amenityReducer } from "~/features/amenity";
import { amenityTypeReducer } from "~/features/amenityType";
import { appReducer } from "~/features/app";
import { authReducer } from "~/features/auth";
import { bannerReducer } from "~/features/banner";
import { bookingReducer } from "~/features/booking";
import { customerReducer } from "~/features/customer";
import { departmentReducer } from "~/features/department";
import { discountReducer } from "~/features/discount";
import { employeeReducer } from "~/features/employee";
import { equipmentReducer } from "~/features/equipment";
import { equipmentTypeReducer } from "~/features/equipmentType";
import { floorReducer } from "~/features/floor";
import { frontDeskReducer } from "~/features/frontDesk";
import { goodsReceiptNoteReducer } from "~/features/goodsReceiptNote";
import { guestUseServiceReducer } from "~/features/guestUseServices";
import { informationHotelReducer } from "~/features/informationHotel";
import { positionReducer } from "~/features/position";
import { rateReducer } from "~/features/rate";
import { reportReducer } from "~/features/report";
import { roomReducer } from "~/features/room";
import { roomTypeReducer } from "~/features/roomTypes";
import { serviceReducer } from "~/features/service";
import { serviceTypesReducer } from "~/features/serviceTypes";
import rootSaga from "./rootSaga";
import { priceListReducer } from "~/features/priceList";

export const sagaMiddleware = createSagaMiddleware();

const defaultMiddlewareConfig = {
  serializableCheck: {
    ignoredPaths: [
      "booking.checkIn",
      "booking.checkOut",
      "frontDesk.checkIn",
      "frontDesk.checkOut",
      "booking.roomsSelected.0.checkIn",
      "booking.roomsSelected.0.checkOut",
    ],
    ignoredActions: [
      "booking/setCheckInOut",
      "service/addDataProductStart",
      "booking/setRoomsSelected",
      "frontDesk/setCheckInOut",
    ],
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    position: positionReducer,
    department: departmentReducer,
    floor: floorReducer,
    app: appReducer,
    roomType: roomTypeReducer,
    room: roomReducer,
    amenity: amenityReducer,
    amenityType: amenityTypeReducer,
    equipmentType: equipmentTypeReducer,
    equipment: equipmentReducer,
    discount: discountReducer,
    booking: bookingReducer,
    serviceTypes: serviceTypesReducer,
    service: serviceReducer,
    customer: customerReducer,
    frontDesk: frontDeskReducer,
    goodsReceiptNote: goodsReceiptNoteReducer,
    guestUseService: guestUseServiceReducer,
    report: reportReducer,
    banner: bannerReducer,
    informationHotel: informationHotelReducer,
    rate: rateReducer,
    priceList: priceListReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (gMD) => gMD(defaultMiddlewareConfig).concat([sagaMiddleware]),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
