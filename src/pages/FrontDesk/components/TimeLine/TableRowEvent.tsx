import { TableCell } from "@mui/material";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { BookingFrontDeskTimeline, IRoomNumber } from "~/types";
import { SelectWeekState } from "~/types/timeline";
import TableRowEventBooking from "./TableRowEventBooking";

type TableRowEventProps = {
  row: IRoomNumber;
  date: SelectWeekState;
  dateIndex: number;
};

const TableRowEvent: FC<TableRowEventProps> = ({ row, date }) => {
  if (row.bookings?.length) {
    const initial: Record<string, BookingFrontDeskTimeline> = {};

    const newBooking = row.bookings?.reduce(
      (t, v) => ({ ...t, [dayjs(v.check_in).format("YYYY-MM-DD")]: v }),
      initial
    );

    const value = newBooking[date.date];

    if (!value) {
      const newBooking = row.bookings?.reduce(
        (t, v) => ({ ...t, [dayjs(v.check_out).format("YYYY-MM-DD")]: v }),
        initial
      );

      const value = newBooking[date.date];

      if (!value) {
        const newBookingV2 = useMemo(() => {
          const array: BookingFrontDeskTimeline[] = [];

          Object.values(newBooking).forEach((value) => {
            const isBetween = date.dayjs.isBetween(
              dayjs(new Date(value.check_in)),
              dayjs(new Date(value.check_out)),
              "day"
            );

            isBetween && array.push(value);
          });

          return array;
        }, [newBooking]);

        if (!newBookingV2.length) return <TableCell></TableCell>;

        return newBookingV2.map((t) => (
          <TableRowEventBooking status="between" booking={t} date={date} row={row} key={t.id} />
        ));
      }

      return <TableRowEventBooking status="end" booking={value} date={date} row={row} />;
    }

    return <TableRowEventBooking status="start" booking={value} date={date} row={row} />;
  }

  return <TableCell></TableCell>;
};

export default TableRowEvent;
