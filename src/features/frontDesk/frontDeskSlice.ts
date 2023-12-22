import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import {
  AddGuestStayInformationPayload,
  ChangeRoomPayload,
  CheckInPayload,
  CheckoutPayload,
  GetChangeRoomsQuery,
  GetCustomerBooked,
  GetCustomerBookedPayload,
  IGuestStayInformation,
  ImportProductDataType,
  InformationRoomDetails,
  LoadingState,
  ModeBookingType,
  ResetFormType,
  RoomNumberItemProps,
  RoomNumberRender,
  RoomsAvailableDesktop,
  ServiceCustomerSelect,
} from "~/types";
import { ModeTimeLine } from "~/types/timeline";
import { endDate, startDate } from "~/utils";
import { CheckInOutPayload } from "../booking";

export type OptionsCheckIn = "CHECK_IN_ALL" | "CHECK_IN_ONE";

type CustomerService = {
  selectedServices: ServiceCustomerSelect[];
};

type InformationRoom = {
  data: InformationRoomDetails | null;
};

export interface InitialStateFrontDeskSlice {
  openListCustomerBooked: boolean;
  openDialogSaveGuestStay: boolean;
  openDialogAddGuest: boolean;
  openDialogCheckIn: boolean;
  openDialogServiceInformation: boolean;

  customerBooked: GetCustomerBooked[];
  customerBookedCheckIns: GetCustomerBooked[];
  customerBookedSelected: GetCustomerBooked | null;
  selectedRoomNumberForServiceInformation: RoomNumberItemProps | null;

  isLoading: LoadingState;
  optionCheckIn: OptionsCheckIn;

  checkIn: Dayjs;
  checkOut: Dayjs;
  modeBooking: ModeBookingType;

  selectRoomNumberId: string;
  error: string;

  customerService: CustomerService;

  informationRoom: InformationRoom;

  screenGrid: {
    selectedRoomNumber: null | RoomNumberItemProps;
    selectedRoomNumberChange: null | RoomNumberRender;
    selectedGuestEdit: IGuestStayInformation | null;

    isLoading: LoadingState;
    error: string;

    guestsInRoom: IGuestStayInformation[];
    dataChangeRooms: RoomsAvailableDesktop[];

    openChangeRoomDialog: boolean;
    openGuestDialog: boolean;
    openCheckoutDialog: boolean;
    openCleanupDialog: boolean;
    openAddCustomerDialog: boolean;
    openDialogListBooking: boolean;

    openBooking: boolean;
    openConfirm: boolean;
  };

  timeline: {
    dateRange: Date;
  };

  mode: ModeTimeLine;
}

const _startDate = startDate();
const _endDate = endDate(_startDate);

const initialState: InitialStateFrontDeskSlice = {
  openListCustomerBooked: false,
  openDialogSaveGuestStay: false,
  openDialogAddGuest: false,
  openDialogServiceInformation: false,
  openDialogCheckIn: false,

  customerBookedCheckIns: [],
  customerBooked: [],

  customerBookedSelected: null,
  selectedRoomNumberForServiceInformation: null,

  optionCheckIn: "CHECK_IN_ALL",
  selectRoomNumberId: "",
  isLoading: "ready",
  error: "",
  modeBooking: "day",

  checkIn: _startDate,
  checkOut: _endDate,

  customerService: {
    selectedServices: [],
  },

  informationRoom: {
    data: null,
  },

  mode: "grid",

  screenGrid: {
    openDialogListBooking: false,
    openGuestDialog: false,
    openChangeRoomDialog: false,

    openCheckoutDialog: false,
    openCleanupDialog: false,
    openAddCustomerDialog: false,

    openBooking: false,
    openConfirm: false,

    selectedRoomNumber: null,
    selectedGuestEdit: null,
    selectedRoomNumberChange: null,

    isLoading: "ready",
    error: "",

    guestsInRoom: [],
    dataChangeRooms: [],
  },

  timeline: {
    dateRange: new Date(),
  },
};

const frontDeskSlice = createSlice({
  name: "frontDesk",
  initialState,
  reducers: {
    setMode: (state, { payload }: PayloadAction<ModeTimeLine>) => {
      state.mode = payload;
    },

    setDateRange: (state, { payload }: PayloadAction<Date>) => {
      state.timeline.dateRange = payload;
    },

    setToggleListCustomerBooked: (state, { payload }: PayloadAction<boolean>) => {
      state.openListCustomerBooked = payload;
    },
    setToggleDialogCheckIn: (state, { payload }: PayloadAction<boolean>) => {
      state.openDialogCheckIn = payload;
    },
    setToggleDialogAddGuest: (state, { payload }: PayloadAction<boolean>) => {
      state.openDialogAddGuest = payload;
    },
    setToggleDialogSaveGuestStay: (state, { payload }: PayloadAction<boolean>) => {
      state.openDialogSaveGuestStay = payload;
    },
    setToggleDialogListBooking: (state, { payload }: PayloadAction<boolean>) => {
      state.screenGrid.openDialogListBooking = payload;
    },
    setToggleDialogServiceInformations: (state, { payload }: PayloadAction<boolean>) => {
      state.openDialogServiceInformation = payload;
    },

    setToggleGuestDialog: (
      state,
      { payload }: PayloadAction<{ open: boolean; selected: null | RoomNumberItemProps }>
    ) => {
      state.screenGrid.openGuestDialog = payload.open;
      state.screenGrid.selectedRoomNumber = payload.selected;
    },

    setToggleChangeRoomDialog: (
      state,
      { payload }: PayloadAction<{ open: boolean; selected: null | RoomNumberItemProps }>
    ) => {
      state.screenGrid.openChangeRoomDialog = payload.open;
      state.screenGrid.selectedRoomNumber = payload.selected;
    },

    setToggleCheckoutDialog: (state, { payload }: PayloadAction<{ open: boolean }>) => {
      state.screenGrid.openCheckoutDialog = payload.open;
    },

    setToggleAddCustomerDialog: (state, { payload }: PayloadAction<{ open: boolean }>) => {
      state.screenGrid.openAddCustomerDialog = payload.open;
    },

    setToggleBooking: (state, { payload }: PayloadAction<{ open: boolean }>) => {
      state.screenGrid.openBooking = payload.open;
    },

    setToggleBookingConfirm: (state, { payload }: PayloadAction<{ open: boolean }>) => {
      state.screenGrid.openConfirm = payload.open;
    },

    setToggleCleanupDialog: (
      state,
      { payload }: PayloadAction<{ open: boolean; selected: null | RoomNumberItemProps }>
    ) => {
      state.screenGrid.openCleanupDialog = payload.open;
      state.screenGrid.selectedRoomNumber = payload.selected;
    },

    setSelectedRoomNumberForServiceInformation: (
      state,
      { payload }: PayloadAction<null | RoomNumberItemProps>
    ) => {
      state.selectedRoomNumberForServiceInformation = payload;
    },

    setOptionsCheckIn: (state, { payload }: PayloadAction<OptionsCheckIn>) => {
      state.optionCheckIn = payload;
    },
    setCustomerBookedSelected: (state, { payload }: PayloadAction<GetCustomerBooked | null>) => {
      state.customerBookedSelected = payload;
    },
    setSelectedRoomNumberId: (state, { payload }: PayloadAction<string>) => {
      state.selectRoomNumberId = payload;
    },
    setCheckInOut: (state, { payload: { type, value } }: PayloadAction<CheckInOutPayload>) => {
      if (type === "check-in") {
        state.checkIn = value;
      } else {
        state.checkOut = value;
      }
    },
    setResetCheckInOut: (state) => {
      state.checkIn = _startDate;
      state.checkOut = _endDate;
    },
    setModeBooking: (state, { payload }: PayloadAction<ModeBookingType>) => {
      state.modeBooking = payload;
    },

    getInformationRoomStart: (state, _: PayloadAction<string>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getInformationRoomSuccess: (state, { payload }: PayloadAction<InformationRoomDetails>) => {
      state.isLoading = "success";
      state.error = "";
      state.informationRoom.data = payload;
    },
    getInformationRoomFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    getCustomerBookedByRoomNumberStart: (state, _: PayloadAction<GetCustomerBookedPayload>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getCustomerBookedByRoomNumberSuccess: (
      state,
      { payload }: PayloadAction<GetCustomerBooked[]>
    ) => {
      state.isLoading = "success";
      state.error = "";
      state.customerBooked = payload;
    },
    getCustomerBookedByRoomNumberFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },
    getCustomerBookedCheckInsStart: (state, _: PayloadAction<GetCustomerBookedPayload>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getCustomerBookedCheckInsSuccess: (state, { payload }: PayloadAction<GetCustomerBooked[]>) => {
      state.isLoading = "success";
      state.error = "";
      state.customerBookedCheckIns = payload;
    },
    getCustomerBookedCheckInsFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },
    checkInStart: (state, _: PayloadAction<CheckInPayload>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    checkInSuccess: (state) => {
      state.isLoading = "success";
      state.openDialogSaveGuestStay = true;
      state.openDialogCheckIn = false;
    },
    checkOutStart: (state, _: PayloadAction<CheckoutPayload>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    checkOutSuccess: (state, { payload }: PayloadAction<InformationRoomDetails>) => {
      state.isLoading = "success";
      state.error = "";
      state.informationRoom.data = payload;
      state.openDialogServiceInformation = false;
      state.screenGrid.openCheckoutDialog = false;
    },
    addIdentificationGuestStart: (
      state,
      _: PayloadAction<{
        data: AddGuestStayInformationPayload;
        resetForm: ResetFormType;
      }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addIdentificationGuestSuccess: (state, { payload }: PayloadAction<GetCustomerBooked[]>) => {
      state.isLoading = "success";
      state.error = "";
      state.customerBookedCheckIns = payload;
      state.openDialogAddGuest = false;
    },

    setSelectedService: (state, { payload }: PayloadAction<ImportProductDataType>) => {
      const cSubTotal =
        Number(payload.unit_quantity) > 1
          ? Number(payload.priceData?.price_sell) * Number(payload.unit_quantity)
          : Number(payload.priceData?.price_sell);
      const cQuantity = 1;

      const lastData = [...state.customerService.selectedServices];

      // @ts-ignore
      const isProduct = Boolean(payload.is_product === 1);

      if (isProduct && cQuantity > Number(payload.unit_quantity_in_stock)) {
        toast.error("Đã vượt quá số lượng cho phép");
        return;
      }

      if (!lastData.length) {
        state.customerService.selectedServices = [
          {
            ...payload,
            c_service_discount: 0,
            c_service_quantity: cQuantity,
            c_service_subTotal: cSubTotal * 1,
          },
        ];

        return;
      }

      if (lastData.map((r) => r.unit_service_id).includes(payload.unit_service_id)) {
        const index = lastData.findIndex((t) => t.unit_service_id === payload.unit_service_id);

        if (
          isProduct &&
          lastData[index].c_service_quantity + cQuantity > Number(payload.unit_quantity_in_stock)
        ) {
          toast.error("Đã vượt quá số lượng cho phép");
          return;
        }

        const newQuantity = lastData[index].c_service_quantity + cQuantity;
        let newSubTotal = newQuantity * lastData[index].c_service_subTotal;
        newSubTotal -=
          lastData[index].c_service_discount >= 100
            ? lastData[index].c_service_discount
            : (newSubTotal * lastData[index].c_service_discount) / 100;

        if (index !== -1) {
          lastData[index] = {
            ...lastData[index],
            c_service_quantity: newQuantity,
            c_service_subTotal: newSubTotal,
          };
        }

        state.customerService.selectedServices = [...lastData];
        return;
      }

      state.customerService.selectedServices = [
        ...lastData,
        {
          ...payload,
          c_service_discount: 0,
          c_service_quantity: cQuantity,
          c_service_subTotal: cSubTotal * 1,
        },
      ];
    },

    setRemoveSelectedService: (state, { payload }: PayloadAction<ServiceCustomerSelect>) => {
      state.customerService.selectedServices = [
        ...state.customerService.selectedServices.filter(
          (s) => s.unit_service_id !== payload.unit_service_id
        ),
      ];
    },

    setChangeQuantitySelectedService: (
      state,
      { payload }: PayloadAction<{ unitServiceId: string; quantity: number; cSubTotal: number }>
    ) => {
      const lastData = [...state.customerService.selectedServices];
      const index = lastData.findIndex((t) => t.unit_service_id === payload.unitServiceId);

      if (index !== -1) {
        lastData[index] = {
          ...lastData[index],
          c_service_quantity: payload.quantity,
          c_service_subTotal: payload.cSubTotal,
        };
        state.customerService.selectedServices = [...lastData];
      }
    },

    getGuestsInRoomStart: (
      state,
      _: PayloadAction<{ bookingDetailsId: string; roomNumberId: string }>
    ) => {
      state.screenGrid.isLoading = "pending";
      state.screenGrid.error = "";
    },
    getGuestsInRoomSuccess: (state, { payload }: PayloadAction<IGuestStayInformation[]>) => {
      state.screenGrid.isLoading = "success";
      state.screenGrid.error = "";
      state.screenGrid.guestsInRoom = payload;
    },

    getGuestsInRoomError: (state, { payload }: PayloadAction<string>) => {
      state.screenGrid.isLoading = "error";
      state.screenGrid.error = payload;
    },

    addGuestsInRoomStart: (
      state,
      _: PayloadAction<{ data: IGuestStayInformation; resetForm: () => void; mode: "add" | "edit" }>
    ) => {
      state.screenGrid.isLoading = "pending";
      state.screenGrid.error = "";
    },
    addGuestsInRoomSuccess: (state, { payload }: PayloadAction<IGuestStayInformation[]>) => {
      state.screenGrid.isLoading = "success";
      state.screenGrid.error = "";
      state.screenGrid.guestsInRoom = payload;
    },

    getDataChangeRoomStart: (state, _: PayloadAction<GetChangeRoomsQuery>) => {
      state.screenGrid.isLoading = "pending";
      state.screenGrid.error = "";
    },

    getDataChangeRoomSuccess: (state, { payload }: PayloadAction<RoomsAvailableDesktop[]>) => {
      state.screenGrid.isLoading = "success";
      state.screenGrid.error = "";
      state.screenGrid.dataChangeRooms = payload;
    },

    changeRoomStart: (state, _: PayloadAction<ChangeRoomPayload>) => {
      state.screenGrid.isLoading = "pending";
      state.screenGrid.error = "";
    },

    changeRoomSuccess: (state) => {
      state.screenGrid.isLoading = "success";
      state.screenGrid.error = "";
      state.screenGrid.dataChangeRooms = [];
      state.screenGrid.openChangeRoomDialog = false;
      state.screenGrid.selectedRoomNumber = null;
      state.screenGrid.selectedRoomNumberChange = null;
    },

    cleanupStart: (state, _: PayloadAction<{ bookingDetailsId: string; mode: ModeTimeLine }>) => {
      state.screenGrid.isLoading = "pending";
      state.screenGrid.error = "";
    },

    cleanupSuccess: (state) => {
      state.screenGrid.isLoading = "success";
      state.screenGrid.error = "";

      state.screenGrid.openCleanupDialog = false;
      state.screenGrid.selectedRoomNumber = null;
    },

    setSelectedGuestEdit: (state, { payload }: PayloadAction<IGuestStayInformation | null>) => {
      state.screenGrid.selectedGuestEdit = payload;
    },

    setSelectedRoomNumberChange: (state, { payload }: PayloadAction<RoomNumberRender | null>) => {
      state.screenGrid.selectedRoomNumberChange = payload;
    },
  },
});

export const frontDeskActions = frontDeskSlice.actions;
export default frontDeskSlice.reducer;
