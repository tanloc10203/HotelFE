import { Box, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { roomActions, useRoom } from "~/features/room";
import { useAppDispatch } from "~/stores";
import { BookingStatus } from "~/types";
import { datesOfWeek, selectWeek } from "~/utils";
import TableCellDateOfWeek from "./TableCellDateOfWeek";
import TableRowLabel from "./TableRowLabel";
import TimelineContainer from "./TimelineContainer";
import TimelineHelper from "./TimelineHelper";

type TimeLineProps = {};

// const timeSlots = Array.from(new Array(24)).map(
//   (_, index) => `${index < 10 ? "0" : ""}${Math.floor(index)}:${"00"}`
// );

const TimeLine: FC<TimeLineProps> = () => {
  const dispatch = useAppDispatch();
  const { dataFrontDeskTimeline } = useRoom();
  const {
    timeline: { dateRange },
  } = useFrontDeskSelector();
  const [dateOfWeek, setDateOfWeek] = useState(datesOfWeek());

  const handleChangeDate = useCallback((date: Dayjs | null) => {
    dispatch(frontDeskActions.setDateRange(date?.toDate() || new Date()));
    setDateOfWeek(selectWeek(date!.toDate()));
  }, []);

  useEffect(() => {
    dispatch(appActions.openOverplay(""));
    dispatch(
      roomActions.getDataFrontDeskTimelineStart({
        startDate: dateOfWeek[0].date,
        endDate: dateOfWeek[dateOfWeek.length - 1].date,
      })
    );
  }, [dateOfWeek]);

  const arrayHelper: { type: BookingStatus; value: string }[] = [
    { type: "canceled", value: "Đã hủy" },
    { type: "checked_out", value: "Đã trả phòng" },
    { type: "completed", value: "Đã hoàn thành" },
    { type: "confirmed", value: "Đã xác nhận" },
    { type: "in_progress", value: "Đang sử dụng" },
    { type: "pending_confirmation", value: "Đang chờ xác nhận" },
    { type: "pending_payment", value: "Đang chờ thanh toán" },
  ];

  return (
    <Box>
      <TimelineHelper helpers={arrayHelper} value={dayjs(dateRange)} onChange={handleChangeDate} />

      <TimelineContainer>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                minWidth: 170,
                padding: 0,
              }}
              align="center"
            ></TableCell>

            {dateOfWeek.map((date) => (
              <TableCellDateOfWeek date={date} key={date.day} />
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {dataFrontDeskTimeline.length
            ? dataFrontDeskTimeline.map((row) => (
                <TableRowLabel dates={dateOfWeek} row={row} key={row.id} />
              ))
            : null}
        </TableBody>
      </TimelineContainer>
    </Box>
  );
};

export default TimeLine;
