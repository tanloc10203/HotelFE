import { useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { ColumnState, TabOptions } from "~/components";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { useAppDispatch } from "~/stores";
import { BookingFor, BookingPayment, BookingStatus } from "~/types";
import { fBookingFor, fBookingPayment, fBookingStatus, fCurrency, fDateTime } from "~/utils";

const useManagerStateBooking = () => {
  const { isLoading, data, pagination, filters } = useBookingSelector();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const tabStatus = 1;

  useEffect(() => {
    dispatch(bookingActions.getDataStart(filters));
  }, [filters]);

  const tabsData = useMemo(
    (): TabOptions[] => [
      {
        id: 0,
        label: "Tất cả",
        bg: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        bgActive:
          theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        color:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
        colorActive:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
      },
      {
        id: 1,
        label: "Không hoạt động",
        bg: "rgba(255, 86, 48, 0.16)",
        bgActive: "rgb(255, 86, 48)",
        color: "rgb(255, 172, 130)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 2,
        label: "Xác thực",
        bg: "rgba(34, 197, 94, 0.16)",
        bgActive: "rgb(34, 197, 94)",
        color: "rgb(17, 141, 87)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 3,
        label: "Bị cấm",
        bg: "rgba(255, 171, 0, 0.16)",
        bgActive: "rgb(255, 171, 0)",
        color: "rgb(183, 110, 0)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 4,
        label: "Nghỉ hưu",
        bg: "rgba(145, 158, 171, 0.16)",
        bgActive: "rgb(145, 158, 171)",
        color: "rgb(99, 115, 129)",
        colorActive: "rgb(255, 255, 255)",
      },
    ],
    [theme]
  );

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "id", label: "M. Booking", minWidth: 30 },
      { id: "customer_id", label: "M. KH", minWidth: 30, align: "center" },
      {
        id: "payment",
        label: "Thanh toán",
        minWidth: 30,
        align: "left",
        format(value) {
          return fBookingPayment(value as BookingPayment);
        },
      },
      {
        id: "booking_for",
        label: "Đặt cho",
        minWidth: 30,
        align: "center",
        format(value) {
          return fBookingFor(value as BookingFor);
        },
      },
      {
        id: "check_in",
        label: "Check-in",
        minWidth: 30,
        format(value) {
          return fDateTime(value as string, "dd/MM/yyyy p");
        },
      },
      {
        id: "check_out",
        label: "Check-out",
        minWidth: 30,
        format(value) {
          return fDateTime(value as string, "dd/MM/yyyy p");
        },
      },
      { id: "guests_adults", label: "SL.Ng", minWidth: 30, align: "center" },
      {
        id: "total_price",
        label: "SL.Ph",
        minWidth: 30,
        format(value) {
          return fCurrency(value as number);
        },
      },
      {
        id: "status",
        label: "Trạng thái",
        minWidth: 30,
        format(value) {
          return fBookingStatus(value as BookingStatus);
        },
      },
      {
        id: "actions",
        label: "AC",
        minWidth: 30,
        align: "center",
        format(value) {
          return fBookingStatus(value as BookingStatus);
        },
      },
    ],
    []
  );

  const handleChangeTab = useCallback(() => {}, []);

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(bookingActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  return {
    tabsData,
    tabStatus,
    isLoading,
    columns,
    data,
    pagination,
    handleChangePage,
    handleChangeTab,
  };
};

export default useManagerStateBooking;
