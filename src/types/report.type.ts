export type RateBookingState = {
  totalBookingRoom: number;
  totalRoom: number;
  rate: number;
  day: number;
};

export type QuantityBookingState = {
  online: number;
  offline: number;
  inProgress: number;
  canceled: number;
};

export type RoomTypeMoneyDetailsState = {
  id: number;
  name: string;
  character: string;
  money: number;
};

export type RoomTypeMoneyState = {
  totalMoney: number;
  date: string;
  details: RoomTypeMoneyDetailsState[];
};

export type ServiceMoneyState = {
  id: string;
  name: string;
  dates: { date: string; subTotal: number }[];
};

export type ServiceMoneyResponse = {
  resultsProducts: ServiceMoneyState[];
  resultsService: ServiceMoneyState[];
  dateRange: string[];
};
