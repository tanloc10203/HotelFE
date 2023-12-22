import { all } from "redux-saga/effects";
import { amenitySaga } from "~/features/amenity";
import { amenityTypeSaga } from "~/features/amenityType";
import { bannerSaga } from "~/features/banner";
import { bookingSaga } from "~/features/booking";
import { customerSaga } from "~/features/customer";
import { departmentSaga } from "~/features/department";
import { discountSaga } from "~/features/discount";
import { employeeSaga } from "~/features/employee";
import { equipmentSaga } from "~/features/equipment";
import { equipmentTypeSaga } from "~/features/equipmentType";
import { floorSaga } from "~/features/floor";
import { frontDeskSaga } from "~/features/frontDesk";
import { goodsReceiptNoteSaga } from "~/features/goodsReceiptNote";
import { guestUseServiceSaga } from "~/features/guestUseServices";
import { informationHotelSaga } from "~/features/informationHotel";
import { positionSaga } from "~/features/position";
import { priceListSaga } from "~/features/priceList";
import { rateSaga } from "~/features/rate";
import { reportSaga } from "~/features/report";
import { roomSaga } from "~/features/room";
import { roomTypeSaga } from "~/features/roomTypes";
import { serviceSaga } from "~/features/service";
import { serviceTypesSaga } from "~/features/serviceTypes";

function* rootSaga() {
  yield all([
    employeeSaga(),
    positionSaga(),
    departmentSaga(),
    floorSaga(),
    roomTypeSaga(),
    roomSaga(),
    amenityTypeSaga(),
    amenitySaga(),
    equipmentTypeSaga(),
    equipmentSaga(),
    discountSaga(),
    bookingSaga(),
    serviceTypesSaga(),
    serviceSaga(),
    customerSaga(),
    frontDeskSaga(),
    goodsReceiptNoteSaga(),
    guestUseServiceSaga(),
    reportSaga(),
    bannerSaga(),
    informationHotelSaga(),
    rateSaga(),
    priceListSaga(),
  ]);
}

export default rootSaga;
